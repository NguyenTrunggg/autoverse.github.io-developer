import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  balance?: number;
  role?: {
    id: number;
    name: string;
  };
}

interface UserState {
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<CurrentUser>) {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = userSlice.actions;
export default userSlice.reducer;