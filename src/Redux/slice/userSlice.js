import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: {
      ID: "",
      name: "",
      email: "",
      isAdmin: "",
      isVerify: "",
    },
    userlist: [],
  },
  reducers: {
    userLogin: (state, action) => {
      state.info.ID = action.payload._id;
      state.info.name = action.payload.name;
      state.info.email = action.payload.email;
      state.info.isAdmin = action.payload.isAdmin;
      state.info.isVerify = action.payload.isVerify;
    },
    updateUser: (state, action) => {
      state.info.ID = action.payload._id;
      state.info.name = action.payload.name;
      state.info.email = action.payload.email;
      state.info.isAdmin = action.payload.isAdmin;
      state.info.isVerify = action.payload.isVerify;
    },
    userLogout: (state, action) => {
      state.info.ID = "";
      state.info.name = "";
      state.info.email = "";
      state.info.isAdmin = "";
      state.info.isVerify = "";
    },
    getAllUser: (state, action) => {
      state.list = action.payload;
    },
  },
});
export const { userLogin, getAllUser, userLogout, updateUser } =
  userSlice.actions;

export default userSlice.reducer;
