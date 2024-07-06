import { PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeEvery } from 'redux-saga/effects';
import { actions as profileActions } from '../profile';
import { Profile } from '../profile/types';
import { actions } from './store';

function* setProfile(action: PayloadAction<Profile>) {
    yield put(actions.setPoints(action.payload.points));
}

function* reset() {
    yield put(actions.reset());
}

export function* scoreSagas() {
    yield all([
        takeEvery(profileActions.setProfile.type, setProfile),
        takeEvery(profileActions.setDisconnect.type, reset),
    ]);
}
