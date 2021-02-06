export const state = () => ({
  API_URL: "http://localhost:5000",
  hidden: false,
  selectedRows: [],
  iconHeader: "",
  titleHeader: "",
  path: "",
  loading: true,
  page: 1,
  pageCount: 0,
  itemsPerPage: 10,
  data: [],

  userList: [{
    text: "All",
    value: ""
  }],
  modelList: [{
    text: "All",
    value: ""
  }],
  standList: [{
    text: "All",
    value: ""
  }],
  orderList: [{
    text: "All",
    value: ""
  }],
  actionList: [{
    text: "All",
    value: ""
  }],
  resultList: [{
    text: "All",
    value: ""
  }],
})

export const mutations = {
  toggle(state) {
    state.hidden = !state.hidden
  },

  SET_MODELS: (state, models) => {
    state.modelList = state.modelList.concat(models)
  },

  SET_STANDS: (state, stands) => {
    state.standList = state.standList.concat(stands)
  },

  SET_USERS: (state, users) => {
    state.userList = state.userList.concat(users)
  },

  SET_ACTIONS: (state, actions) => {
    state.actionList = state.actionList.concat(actions)
  },

  SET_ORDERS: (state, orders) => {
    state.orderList = state.orderList.concat(orders)
  },

  SET_RESULTS: (state, results) => {
    state.resultList = state.resultList.concat(results)
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
  setHeaderText(state, title) {
    state.titleHeader = title
  },
  setIcon(state, icon) {
    state.iconHeader = icon
  },
  setPath(state, path) {
    state.path = path
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setSortBy(state, key) {
    state.sortBy = key
  },
  setApiData(state, data) {
    state.data = data
  },
}

export const actions = {
  selectedRows({
    commit
  }, keyID) {
    commit('selectedRows', keyID)
  },

  GET_DATA({
    state,
    commit
  }, payload) {
    //http://localhost:5000/api/datatables/jobs
    this.$axios({
      method: payload.method === null ? 'get': payload.method,
      url: state.API_URL + payload.path,
      data: payload.data
    })
      .then((res) => {
        commit('setApiData', res.data.data)
        commit('setLoading', false)
      });
  },

  GET_MODELS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/servers/models").then((res) => {
      let models = [];
      res.data.models.forEach(function (item) {
        models.push({
          text: item.name,
          value: item.id
        });
      });
      commit('SET_MODELS', models)
    }).catch((error) => {
      console.log(error)
    });
  },

  GET_STANDS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/job/stands").then((res) => {
      let stands = [];
      res.data.stands.forEach(function (item) {
        stands.push({
          text: item.name,
          value: item.id
        });
      });
      commit('SET_STANDS', stands)
    }).catch((error) => {
      console.log(error)
    });
  },

  GET_USERS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/job/users").then((res) => {
      let users = [];
      res.data.users.forEach(function (item) {
        users.push({
          text: item.username,
          value: item.id
        });
      });
      commit('SET_USERS', users)
    }).catch((error) => {
      console.log(error)
    });
  },

  GET_ACTIONS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/job/actions").then((res) => {
      let actions = [];
      res.data.actions.forEach(function (item) {
        actions.push({
          text: item.name,
          value: item.id
        });
      });
      commit('SET_ACTIONS', actions)
    }).catch((error) => {
      console.log(error)
    });
  },

  GET_ORDERS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/job/orders").then((res) => {
      let orders = [];
      res.data.orders.forEach(function (item) {
        orders.push({
          text: item.name,
          value: item.id
        });
      });
      commit('SET_ORDERS', orders)
    }).catch((error) => {
      console.log(error)
    });
  },

  GET_RESULTS({
    state,
    commit
  }) {
    this.$axios.get(state.API_URL + "/api/job/results").then((res) => {
      let results = [];
      res.data.results.forEach(function (item) {
        results.push({
          text: item.name,
          value: item.id
        });
      });
      commit('SET_RESULTS', results)
    }).catch((error) => {
      console.log(error)
    });
  },

}
