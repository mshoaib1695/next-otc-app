import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Avatar, AvatarResponse } from './types';

interface State {
    wallets: Record<string, Avatar>;
}

const initialState: State = {
    wallets: {},
};

export const slice = createSlice({
    name: 'avatars',
    initialState,
    reducers: {
        changeAvatars: (state, action: PayloadAction<AvatarResponse[]>) => {
            action.payload.forEach((avatar) => {
                state.wallets[avatar.wallet] = avatar;
            });
        },
        removeAvatar: (state, action: PayloadAction<string>) => {
            delete state.wallets[action.payload];
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
