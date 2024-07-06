import axios, { AxiosResponse } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, delay, put, race, select, take } from 'redux-saga/effects';
import type { Avatar, AvatarResponse } from './types';
import type { APIResponse } from '../types';
import { store, type RootState } from '../store';
import type { Event } from '../events/types';
import type { Rank } from '../leaderboard/types';
import { actions } from './store';
import { actions as eventsActions } from '../events';
import { actions as leaderboardActions } from '../leaderboard';
import { API_PROFILE_AVATAR } from '../../constants';

function* takeAvatars(wallets: string[], avatars: Record<string, Avatar>) {
    try {
        while (wallets.length > 0) {
            const chunk = wallets.splice(0, 100);
            const response: AxiosResponse<APIResponse<AvatarResponse[]>> =
                yield call(axios.post, API_PROFILE_AVATAR, { wallets: chunk });
            if (response.status === 200) {
                const newAvatars = response.data.data.filter(
                    (avatar) =>
                        !avatars[avatar.wallet] ||
                        avatars[avatar.wallet].url !== avatar.url
                );
                if (newAvatars.length > 0)
                    yield put(actions.changeAvatars(newAvatars));
            }
        }
    } catch (error) {
        // console.error('Error checking avatar', error, action);
    }
}

function* checkAvatars(list: string[]) {
    const avatars: RootState['avatars']['wallets'] = yield select(
        (state: RootState) => state.avatars.wallets
    );
    const newAvatars = list.filter((wallet) => !avatars[wallet]);
    const oldAvatars = Object.entries(avatars)
        .filter(([_key, value]) => value.fullFilled)
        .map(([key]) => key);
    const final = [...newAvatars, ...oldAvatars].reduce<string[]>(
        (acc, cur) => {
            if (!acc.includes(cur)) acc.push(cur);
            return acc;
        },
        []
    );
    yield call(takeAvatars, final, avatars);
}

interface Winner {
    recentActivities: PayloadAction<Event>;
    leaderboard: PayloadAction<Rank>;
}

function* checkEvents() {
    let list: string[] = [];
    let check = false;
    while (true) {
        if (!check) {
            const winner: Winner = yield race({
                recentActivities: take(eventsActions.addEvent.type),
                leaderboard: take(leaderboardActions.updateLeaderboard.type),
            });
            if (winner.recentActivities)
                list.push(winner.recentActivities.payload.wallet);
            if (winner.leaderboard)
                list.push(winner.leaderboard.payload.wallet);
        }

        const winner: Winner = yield race({
            delay: delay(500),
            recentActivities: take(eventsActions.addEvent.type),
            leaderboard: take(leaderboardActions.updateLeaderboard.type),
        });

        if (!winner.recentActivities && !winner.leaderboard) {
            yield call(checkAvatars, list);
            list = [];
            check = false;
        } else {
            check = true;
            if (winner.recentActivities)
                list.push(winner.recentActivities.payload.wallet);
            if (winner.leaderboard)
                list.push(winner.leaderboard.payload.wallet);
        }
    }
}

function* clearAvatrsNotUsed() {
    while (true) {
        yield delay(1000 * 60 * 5); // 5 minutes

        const avatars: RootState['avatars']['wallets'] = yield select(
            (state: RootState) => state.avatars.wallets
        );

        const walletsInLeaderboard: string[] = yield select(
            (state: RootState) =>
                state.leaderBoard.leaderboard.map((rank) => rank.wallet)
        );
        const walletsInRecentActivities: string[] = yield select(
            (state: RootState) =>
                state.events.events.map((event) => event.wallet)
        );

        const wallets = Object.keys(avatars);

        wallets.forEach((wallet) => {
            if (
                !walletsInLeaderboard.includes(wallet) &&
                !walletsInRecentActivities.includes(wallet)
            ) {
                store.dispatch(actions.removeAvatar(wallet));
            }
        });
    }
}

export function* avatarsSagas() {
    yield all([checkEvents(), clearAvatrsNotUsed()]);
}
