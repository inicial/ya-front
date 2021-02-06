export const state = () => ({
  optional: "",
  search: "",
  apiData: [],
  result: "",
  sortBy: 2,
  headers: [
    {
      text: "Username",
      align: "center",
      sortable: true,
      value: "username",
      index: 0,
    },
    { text: "First Name", value: "first_name", align: "center", index: 1 },
    { text: "Last Name", value: "last_name", align: "center", index: 2 },
    { text: "eMail", value: "email", align: "center", index: 3 },
    { text: "Role", value: "role", align: "center", index: 4 },
    { text: "Company", value: "company", align: "center", index: 5 },
    { text: "Online", value: "online", index: 6 },
  ],
})

export const mutations = {
  // toggle(state) {
  //   state.hidden = !state.hidden
  // },
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
  // GET_DATA({
  //   state,
  //   commit
  // }) {
  //   this.$axios
  //     .post('http://localhost:5000/api/datatables/users', {
  //       draw: 1,
  //       columns: [{
  //           data: "username",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "first_name",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "last_name",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "email",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "role",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "company",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //         {
  //           data: "online",
  //           name: "",
  //           searchable: true,
  //           orderable: true,
  //           search: {
  //             value: "",
  //             regex: false,
  //           },
  //         },
  //       ],
  //       order: [{
  //         column: 2,
  //         dir: "desc"
  //       }, ],
  //       start: 0,
  //       length: 0,
  //       search: {
  //         value: state.search,
  //         regex: false,
  //       },
  //       optional: state.result,
  //     })
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
