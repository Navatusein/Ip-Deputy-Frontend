import {IUser} from "@/entities/user";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface State {
  user?: IUser
}

const initialState: State = {
  user: JSON.parse(localStorage.getItem("user")!) ?? undefined,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = undefined;
      localStorage.removeItem("user");
    }
  }
})

export const {setUser, logout} = userSlice.actions;
export default userSlice.reducer;