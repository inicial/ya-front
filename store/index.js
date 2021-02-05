export const state = () => ({
  hidden: false,
  selectedRows: [],
})

export const mutations = {
  toggle(state) {
    state.hidden = !state.hidden
  },
  selectedRows(state, keyID) {
    if (state.selectedRows.includes(keyID)) {
      state.selectedRows = state.selectedRows.filter(
        (selectedKeyID) => selectedKeyID !== keyID
      );
    } else {
      state.selectedRows.push(keyID);
    }
  },
}

export const actions = {
  selectedRows({
    commit
  }, keyID) {
    commit('selectedRows', keyID)
  },
}
