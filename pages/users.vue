<template>
  <v-card elevation="0" min-width="800">
    <v-sheet class="overflow-y-auto" max-height="800">
      <v-container style="height: auto">
        <Header />

        <Filters />

        <DataTable :headers="$store.state.users.headers" />

        <SnackBar />
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  head() {
    return {
      title: "Users",
    };
  },
  computed: {
    data() {
      return {
        draw: 1,
        columns: [
          {
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
        order: [
          {
            column: this.$store.state.users.sortBy,
            dir: "desc",
          },
        ],
        start: 0,
        length: 0,
        search: {
          value: this.$store.state.users.search,
          regex: false,
        },
        optional: this.$store.state.users.result,
      };
    },
    params(nv) {
      return {
        ...this.options,
        query: this.$store.dispatch("GET_DATA", {
          method: "post",
          path: "/api/datatables/users",
          data: this.data,
        }),
      };
    },
  },

  watch: {
    params: {
      handler() {
        this.$store.dispatch("GET_DATA", {
          method: "post",
          path: "/api/datatables/users",
          data: this.data,
        });
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.commit("setPath", "users");

    this.$store.commit("setHeaderText", "User Administration");
    this.$store.commit("setIcon", "mdi-account-multiple");
    this.$store.commit("setSortBy", 2);
    // this.$store.dispatch("GET_DATA", {
    //   method: "post",
    //   path: "/api/datatables/users",
    //   data: this.data,
    // });
  },
};
</script>