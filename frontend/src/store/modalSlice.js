import {createSlice} from '@reduxjs/toolkit' 
const initialState = {
  activeModal: '',
  modalData: null,
}
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action) {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal(state) {
      state.activeModal = '',
      state.modalData =  null
    }
  }
})

export const {openModal, closeModal} = modalSlice.actions;
export default modalSlice.reducer