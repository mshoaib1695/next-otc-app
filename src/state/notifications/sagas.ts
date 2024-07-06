import { all, takeEvery } from 'redux-saga/effects';
import { actions } from './store';

// temporary debug message
function showConsole(action: unknown) {
    // eslint-disable-next-line no-console
    console.log('Notification:', action);
}

export function* notificationsSagas() {
    yield all([takeEvery(actions.show, showConsole)]);
}
