/* eslint-disable no-console */
import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
    all,
    put,
    race,
    select,
    take,
    takeEvery,
    delay,
} from 'redux-saga/effects';
import { API_EVENTS } from '../../constants';
import { actions as leaderboardActions } from '../leaderboard';
import { actions as notificationsActions } from '../notifications';
import { actions as profileActions } from '../profile';
import { actions as statisticsActions } from '../statistics';
import { RootState, store } from '../store';
import { actions } from './store';

function* start() {
    let retry = true;

    yield race({
        delay: delay(2000),
        rehidrate: take('persist/REHYDRATE'),
    });

    while (retry) {
        const token: RootState['profile']['token'] | null = yield select(
            (state: RootState) => state.profile.token
        );

        const clientId = localStorage.getItem('clientId')!;

        const ctrl = new AbortController();
        const control: { stop: boolean; change: boolean; disconnect: boolean } =
            yield race({
                retry: fetchEventSource(`${API_EVENTS}?clientId=${clientId}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'text/event-stream',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    onmessage: (event) => {
                        try {
                            const parsed = JSON.parse(event.data);

                            if (event.event === 'recentActivities') {
                                store.dispatch(actions.addEvent(parsed));
                            } else if (event.event === 'statistics') {
                                store.dispatch(
                                    statisticsActions.updateStatistics(parsed)
                                );
                            } else if (event.event === 'leaderboard') {
                                store.dispatch(
                                    leaderboardActions.updateLeaderboard(parsed)
                                );
                            } else if (event.event === 'profile') {
                                store.dispatch(
                                    profileActions.setProfile(parsed)
                                );
                            } else if (event.event === 'xUserAlreadyExist') {
                                store.dispatch(
                                    notificationsActions.show({
                                        type: 'error',
                                        title: 'User already exist',
                                        message:
                                            'This X account is already associated with another wallet',
                                        buttons: ['OK'],
                                    })
                                );
                            }
                        } catch (error) {
                            console.error('Error parsing event', error, event);
                        }
                    },
                    signal: ctrl.signal,
                }).catch((error) => {
                    console.error('Error fetching events', error);
                }),

                stop: take(actions.stopEvents.type),
                change: take(profileActions.setToken.type),
                disconnect: take(profileActions.setDisconnect.type),
            });

        if (control.stop || control.change || control.disconnect) {
            ctrl.abort();
            retry = !control.stop;
            yield put(leaderboardActions.reset());
        }
    }
}

function* setup() {
    yield put(actions.startEvents());
}

export function* eventsSagas() {
    yield all([takeEvery(actions.startEvents.type, start), setup()]);
}
