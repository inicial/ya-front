export const state = () => ({
  hidden: false,
  // selectedRows: [],
  optional: "",
  loading: true,
  search: "",
  apiData: [],
  result: "",
})

export const mutations = {
  toggle(state) {
    state.hidden = !state.hidden
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  search(state, search) {
    state.search = search
  },
  result(state, result) {
    state.result = result
  },
  setApiData(state, data) {
    state.apiData = data
  },
}

export const actions = {
  getJobs({
    state,
    commit
  }) {
    //http://localhost:5000/api/datatables/jobs
    this.$axios
      .post('http://localhost:5000/api/datatables/jobs', {
        draw: 1,
        columns: [{
            data: "server_sn",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "mbd_sn",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "server_model",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "stand",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "start",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "starter",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "stop",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "action",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "order",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "sel_logs",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "result",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
        ],
        order: [{
          column: 4,
          dir: "desc"
        }, ],
        start: 0,
        length: 0,
        search: {
          value: state.search,
          regex: false,
        },
        optional: state.result,
      })
      .then((res) => {
        commit('setApiData', res.data.data)
        commit('setLoading', false)
      });
  },
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
