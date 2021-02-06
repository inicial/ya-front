export const state = () => ({
  optional: "",
  search: "",
  sortBy: 4,
  result: "",
  headers: [{
      text: "Server",
      align: "center",
      sortable: true,
      value: "server_sn",
      index: 0,
    },
    {
      text: "Motherboard",
      align: "center",
      value: "mbd_sn",
      index: 1
    },
    {
      text: "Model",
      align: "center",
      value: "server_model",
      index: 2
    },
    {
      text: "Stand",
      align: "center",
      value: "stand",
      index: 3,
    },
    {
      text: "Start",
      align: "center",
      value: "date_start",
      index: 4,
    },
    {
      text: "Started by",
      align: "center",
      value: "starter",
      index: 5
    },
    {
      text: "Stop",
      align: "center",
      value: "date_stop",
      index: 6,
    },
    {
      text: "Action",
      align: "center",
      value: "action",
      index: 7
    },
    {
      text: "Order",
      align: "center",
      value: "order",
      index: 8
    },
    {
      text: "SELs",
      align: "center",
      value: "sel_logs",
      filterable: false,
      index: 9,
    },
    {
      text: "Result",
      align: "center",
      value: "result",
      index: 10
    },
  ],
  postData: {},

})

export const mutations = {
  // toggle(state) {
  //   state.hidden = !state.hidden
  // },
  search(state, search) {
    state.search = search
  },
  result(state, result) {
    state.result = result
  },
  setApiData(state, data) {
    state.apiData = data
  },
  setPostData(state, data) {
    state.postData = ''
  }
}

export const actions = {
  // GET_DATA({
  //   state,
  //   commit
  // }, method, data) {
  //   //http://localhost:5000/api/datatables/jobs
  //   this.$axios({
  //     method: method,
  //     url: 'http://localhost:5000/api/datatables/jobs',
  //     data: data
  //   })
  //     .then((res) => {
  //       commit('setApiData', res.data.data)
  //       this.commit('setLoading', false)
  //     });
  // },
  search({
    commit
  }, search) {
    commit('search', search)
  },
  result({
    commit
  }, result) {
    commit('result', result)
  }
}
