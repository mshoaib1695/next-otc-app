import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { all, spawn } from 'redux-saga/effects';
import { PERSIST_KEY, PERSIST_VERSION } from '../constants/store';
import { avatarsReducer, avatarsSagas } from './avatars';
import { eventsReducer, eventsSagas } from './events';
import { leaderboardReducer } from './leaderboard';
import { notificationsReducer, notificationsSagas } from './notifications';
import { otcInfoReducer, otcInfoSagas } from './otcInfo';
import { profileReducer, profileSagas } from './profile';
import { scoreReducer, scoreSagas } from './score';
import { statisticsReducer } from './statistics';

const sagaMiddleware = createSagaMiddleware({
    onError: (error, errorInfo) => {
        // eslint-disable-next-line no-console
        console.error('Saga error', error, errorInfo);
    },
});

const persistConfig = {
    key: PERSIST_KEY,
    version: PERSIST_VERSION,
    storage,
    blacklist: ['otcInfo'],
};

const rootReducer = combineReducers({
    avatars: avatarsReducer,
    events: eventsReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    score: scoreReducer,
    leaderBoard: leaderboardReducer,
    statistics: statisticsReducer,
    otcInfo: otcInfoReducer,
});

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: false,
        }).concat(sagaMiddleware),
});

export const persistor = persistStore(store);

// Run sagas
function* rootSaga() {
    yield all([
        spawn(avatarsSagas),
        spawn(eventsSagas),
        spawn(profileSagas),
        spawn(notificationsSagas),
        spawn(scoreSagas),
        spawn(otcInfoSagas),
    ]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
