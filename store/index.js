export const state = () => ({
  hidden: false,
  selectedRows: [],
  iconHeader: "",
  titleHeader: "",
  pageName: "",
  loading: true,
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
  title(state, title) {
    state.titleHeader = title
  },
  icon(state, icon) {
    state.iconHeader = icon
  },
  page(state, name) {
    state.pageName = name
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}

export const actions = {
  selectedRows({
    commit
  }, keyID) {
    commit('selectedRows', keyID)
  },
}
