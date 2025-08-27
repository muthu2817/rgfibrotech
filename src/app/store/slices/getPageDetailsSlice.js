import { createSlice } from "@reduxjs/toolkit";

const PageDetailsSlice = createSlice({
    name:'pageDetails',
    initialState: {
    pageDetails: [],
    loading: false,
    error: null,
    isFormOpen:false //form open/close
  },
  reducers:{
     fetchPageDetailsSuccess: (state, action) => {
      state.loading = false;
      state.Details = action.payload;
    },
    setFormOpen:(state,action) => {
      state.isFormOpen = action.payload;
    }
  }
})

export const{fetchPageDetailsSuccess, setFormOpen} = PageDetailsSlice.actions; 
export default PageDetailsSlice.reducer;