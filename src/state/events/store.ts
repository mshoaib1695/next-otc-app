import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Event } from './types';

interface State {
    isRunning: boolean;
    events: Event[];
}

const initialState: State = {
    isRunning: false,
    events: [],
};

export const slice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        startEvents: (state) => {
            state.isRunning = true;
        },
        stopEvents: (state) => {
            state.isRunning = false;
        },
        reset: (state) => {
            state.events = [];
        },
        addEvent: (state, action: PayloadAction<Event>) => {
            // check allfields
            if (action.payload.wallet === undefined) return;
            if (action.payload.when === undefined) return;
            if (action.payload.eventType === undefined) return;
            if (action.payload.grossValue === undefined) return;
            if (action.payload.points === undefined) return;
            if (action.payload.transaction === undefined) return;

            // check, by transaction if the event is already in the list
            if (!action.payload.transaction) return;
            if (state.events.some((e) => e.transaction === action.payload.transaction)) return;
            state.events.push(action.payload);
            state.events.sort((a, b) => {
                return b.when.localeCompare(a.when);
            });
            state.events = state.events.slice(0, 100);
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
