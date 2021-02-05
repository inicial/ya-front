export const state = () => ({
  hidden: false,
  optional: "",
  search: "",
  apiData: [],
  result: "",
})

export const mutations = {
  toggle(state) {
    state.hidden = !state.hidden
  },
  // setLoading(state, loading) {
  //   state.loading = loading
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
}

export const actions = {
  getUsers({
    state,
    commit
  }) {
    this.$axios
      .post('http://localhost:5000/api/datatables/users', {
        draw: 1,
        columns: [{
            data: "username",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "first_name",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "last_name",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "email",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "role",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "company",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "online",
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
          column: 2,
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
        this.commit('setLoading', false)
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
