import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData : {
    toolID: null,
  userId: null,
  userName: null,
  orgId: null,
  roleID: null,
  globalAdminRole: null,
  clientAdminRole: null,
  accessToken: null,
  refreshToken: null,
  openTaskCount: null,
  defaultPassword: null,
  isMFAEnabled: null,
  accountName: null,
  accountId: null,
  siteName: null,
  siteId: null,
  groupName: null,
  groupId: null,
  toolExpire: null,
  sentinalTesting: null,
  loading: false,
  error: null,
  }
};
const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserData, setLoading, setError } = loginUserSlice.actions;
export default loginUserSlice.reducer;