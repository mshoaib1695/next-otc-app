import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';
import type { RootState } from '../../state/store';

import { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CALCULATED_VAM } from '../../constants';
import { actions as notificationActions } from '../notifications/store';
import { actions as profileActions } from '../profile/store';
import { actions as actionsOtcInfo } from './store';
import { Profile } from '../profile/types';

function* registerVAMCalculated() {
    const isRunning: boolean = yield select((state: RootState) => state.otcInfo.isRunning);
    if (isRunning) return;

    yield put(actionsOtcInfo.isRunning(true));

    const token: RootState['profile']['token'] = yield select(
        (state: RootState) => state.profile.token,
    );
    if (token?.trim().length === 0) return;

    const profileVam: RootState['profile']['vam'] = yield select(
        (state: RootState) => state.profile.vam,
    );

    if (!profileVam.calculatedAt) {
        yield put(
            notificationActions.show({
                type: 'error',
                title: 'This is taking longer than expected',
                message: 'Your VAM cannot be calculated at this moment. Please try again later.',
                buttons: ['OK'],
            }),
        );
        yield put(actionsOtcInfo.setVAMMultiplier(-1));
    }

    try {
        yield call(axios.put, API_CALCULATED_VAM, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        // something went wrong
    }

    yield delay(5_000);
    yield put(actionsOtcInfo.isRunning(false));
}

function* setVAM(action: PayloadAction<Profile>) {
    yield put(actionsOtcInfo.setVAMMultiplier(action.payload.vam.value));
}

export function* otcInfoSagas() {
    yield all([
        takeEvery(actionsOtcInfo.startRegisterVAM.type, registerVAMCalculated),
        takeEvery(profileActions.setProfile.type, setVAM),
    ]);
}
