import { PayloadAction } from '@reduxjs/toolkit';
import { disconnect, signMessage } from '@wagmi/core';
import axios, { AxiosResponse } from 'axios';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { SignMessageReturnType } from 'viem';
import {
    API_AUTH_REQUEST,
    API_AUTH_TOKEN,
    API_CHECK_INVITECODE,
    API_PROFILE_CHANGED_WALLET,
    API_REFERRAL_GENERATED,
    API_X_FINAL_POST,
    API_X_REQUEST_TOKEN,
} from '../../constants';
import { config } from '../../main';
import { routes } from '../../providers/routes';
import { RootState } from '../../state/store';
import { actions as notificationActions } from '../notifications';
import { actions as otcInfoActions } from '../otcInfo';
import type { APIResponse } from '../types';
import { actions } from './store';
import { hasDeviceiOS } from '../../utils/hasDeviceIOS';

function* checkInviteCode(action: PayloadAction<string>) {
    const endPoint = `${API_CHECK_INVITECODE}/${action.payload}`;
    try {
        const response: AxiosResponse<
            APIResponse<{ from: 'thirdParty' | 'shortlink' }>
        > = yield call(axios.get, endPoint);
        if (response.status === 200) {
            if (response.data.data.from === 'shortlink') {
                yield put(actions.setReferral(action.payload));
                yield put(actions.checkedReferralCode(true));
            }

            if (response.data.data.from === 'thirdParty')
                yield put(actions.checkedInviteCode(true));

            return;
        }
    } catch (error) {
        // invalid invite code
    }
    yield put(actions.checkedInviteCode(false));
    yield put(actions.checkedReferralCode(false));
}

function* navigateToNextScreen(action: PayloadAction<boolean>) {
    if (action.payload) routes.navigate('/early');
    else {
        yield put(
            notificationActions.show({
                type: 'error',
                title: 'Invalid Invite Code',
                message:
                    'The invite code you entered is invalid. Please try again.',
                buttons: ['OK'],
            })
        );
    }
}

function* login(action: PayloadAction<string>) {
    if (action.payload.trim().length === 0) {
        yield put(actions.setToken(''));
        return;
    }

    const inviteCode: RootState['profile']['inviteCode'] = yield select(
        (state: RootState) => state.profile.inviteCode
    );
    const referral: RootState['profile']['referral']['value'] = yield select(
        (state: RootState) => state.profile.referral.value
    );
    try {
        const nonceResponse: AxiosResponse<APIResponse<{ nonce: string }>> =
            yield call(axios.post, API_AUTH_REQUEST, {
                wallet: action.payload.trim(),
            });

        let signedMessage: SignMessageReturnType;
        try {
            signedMessage = yield call(signMessage, config, {
                account: action.payload.trim() as `0x${string}`,
                message: nonceResponse.data.data.nonce,
            });
            // console.log('Login:', signedMessage);
        } catch (error) {
            yield call(disconnect, config);
            return;
        }

        const response: AxiosResponse<
            APIResponse<{
                token: string;
                referral: { code: string };
                discord: { code: string };
                vam: { value: number; calculatedAt: string | null };
            }>
        > = yield call(axios.post, API_AUTH_TOKEN, {
            signature: signedMessage,
            wallet: action.payload,
            code:
                inviteCode.isValid && inviteCode.isChecked
                    ? inviteCode.value
                    : undefined,
            shortlink: referral ? referral : undefined,
        });
        if (response.status === 200) {
            const remoteToken = response.data.data.token;
            const remoteReferral = response.data.data.referral.code;
            const remoteDiscordCode = response.data.data.discord.code;
            const remoteVam = response.data.data.vam;

            yield put(actions.setToken(remoteToken));
            yield put(actions.setDiscordCode(remoteDiscordCode));
            yield put(actions.setVam(remoteVam));
            if (remoteVam.calculatedAt)
                yield put(otcInfoActions.setVAMMultiplier(remoteVam.value));
            yield put(otcInfoActions.isRunning(false));
            yield put(actions.start());
            if (remoteReferral) yield put(actions.setShortlink(remoteReferral));

            yield put(actions.clearInviteCode());
            yield put(actions.setWallet(action.payload.trim()));
            routes.navigate('/airdrop');
        }
    } catch (error) {
        // fazer um notification de problema de login
    }
}

function* confirmGetReferralLink() {
    const token: RootState['profile']['token'] = yield select(
        (state: RootState) => state.profile.token
    );
    if (token?.trim().length === 0) return;

    try {
        const response: AxiosResponse<APIResponse<{ token: string }>> =
            yield call(axios.put, API_REFERRAL_GENERATED, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
            yield put(actions.generateShortlink());
            // routes.navigate('/refer');
            return;
        }
    } catch (error) {
        // log error somewhere
    }
}

function* updateXProfile() {
    const token: RootState['profile']['token'] = yield select(
        (state: RootState) => state.profile.token
    );
    if (token?.trim().length === 0) return;

    const wallet: RootState['profile']['wallet'] = yield select(
        (state: RootState) => state.profile.wallet
    );
    if (wallet?.trim().length === 0) return;

    try {
        const response: AxiosResponse<APIResponse<string>> = yield call(
            axios.post,
            API_X_REQUEST_TOKEN,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            if (hasDeviceiOS()) {
                window.location.href = response.data.data;
            } else {
                window.open(response.data.data, '_blank');
            }
        }
    } catch (error) {
        // log error somewhere
    }
}

function* postToX(action: PayloadAction<string>) {
    if (action.payload.trim().length === 0) {
        return;
    }

    const token: RootState['profile']['token'] = yield select(
        (state: RootState) => state.profile.token
    );

    try {
        const file: File = yield fetch(action.payload)
            .then((res) => res.blob())
            .then(
                (blob) =>
                    new File([blob], 'screenshot.png', { type: 'image/png' })
            );

        const data = new FormData();
        data.append('file', file);

        yield call(axios.post, API_X_FINAL_POST, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        // fazer um notification de problema de login
    }
}

function* changedWallet(action: PayloadAction<string>) {
    try {
        // TODO: implementing a workaround (and after we will call via api)
        const lastWallet: string = yield select(
            (state: RootState) => state.profile.wallet
        );
        const myCache = localStorage.getItem('walletsInCache');
        const listWallets: string[] = myCache
            ? JSON.parse(myCache)
            : [lastWallet];
        const ignoreDialog = listWallets.includes(action.payload);
        let attachedWallet = ignoreDialog;
        attachedWallet = ignoreDialog;

        if (!ignoreDialog) {
            yield put(
                notificationActions.show({
                    type: 'warn',
                    title: 'New Wallet Detected',
                    message:
                        'Do you want to attach the new wallet to your current profile?',
                    buttons: ['YES', 'NO'],
                })
            );
            const answer: PayloadAction<string> = yield take(
                notificationActions.hide.type
            );
            attachedWallet = answer.payload === 'YES';
        }
        if (attachedWallet) {
            localStorage.setItem(
                'walletsInCache',
                JSON.stringify([
                    action.payload,
                    ...listWallets.filter((item) => item !== action.payload),
                ])
            );

            const token: string = yield select(
                (state: RootState) => state.profile.token
            );
            const response: AxiosResponse<
                APIResponse<{
                    token: string;
                    referral: { code: string };
                    discord: { code: string };
                    vam: { value: number; calculatedAt: string | null };
                }>
            > = yield call(
                axios.post,
                API_PROFILE_CHANGED_WALLET,
                { currentWallet: action.payload },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                const remoteToken = response.data.data.token;
                const remoteReferral = response.data.data.referral.code;
                const remoteDiscordCode = response.data.data.discord.code;
                const remoteVam = response.data.data.vam;

                yield put(actions.setToken(remoteToken));
                yield put(actions.setDiscordCode(remoteDiscordCode));
                yield put(actions.setVam(remoteVam));
                if (remoteVam.calculatedAt)
                    yield put(otcInfoActions.setVAMMultiplier(remoteVam.value));
                yield put(otcInfoActions.isRunning(false));
                yield put(actions.start());
                if (remoteReferral)
                    yield put(actions.setShortlink(remoteReferral));

                yield put(actions.clearInviteCode());
                yield put(actions.setWallet(action.payload.trim()));
            }
        } else {
            yield call(disconnect, config);
        }
    } catch (error) {
        // log error somewhere
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

export function* profileSagas() {
    yield all([
        takeEvery(actions.setInviteCode.type, checkInviteCode),
        takeEvery(actions.checkedInviteCode.type, navigateToNextScreen),
        takeEvery(actions.checkedReferralCode.type, navigateToNextScreen),
        takeEvery(actions.requestLogin.type, login),
        takeEvery(actions.askGenerateShortlink.type, confirmGetReferralLink),
        takeEvery(actions.askFollowTwitter.type, updateXProfile),
        takeEvery(actions.postToX.type, postToX),
        takeEvery(actions.changedWalet.type, changedWallet),
    ]);
}
