import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
    isShowing: boolean;
    type: 'error' | 'info' | 'warn';
    title: string;
    message: string;
    buttons: string[];
    selectedButton: string;
}

const initialState: State = {
    isShowing: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    selectedButton: '',
};

export const slice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        show: (
            state,
            action: PayloadAction<Omit<State, 'isShowing' | 'selectedButton'>>
        ) => {
            state.isShowing = true;
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.message = action.payload.message;
            state.buttons = action.payload.buttons;
        },
        hide: (state, action: PayloadAction<string>) => {
            state.selectedButton = action.payload;
            state.isShowing = false;
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
