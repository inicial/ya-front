<template>
  <v-card elevation="0" min-width="800">
    <v-sheet class="overflow-y-auto" max-height="800">
      <v-container style="height: auto">
        <Header />

        <Filters />

        <DataTable :headers="$store.state.jobs.headers" />

        <SnackBar />
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  head() {
    return {
      title: "Jobs Archive",
    };
  },
  computed: {
    data() {
      return {
        draw: 1,
        columns: [
          {
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
        order: [
          {
            column: this.$store.state.jobs.sortBy,
            dir: "desc",
          },
        ],
        start: 0,
        length: 0,
        search: {
          value: this.$store.state.jobs.search,
          regex: false,
        },
        optional: this.$store.state.jobs.result,
      };
    },
    params(nv) {
      return {
        ...this.options,
        query: this.$store.dispatch("GET_DATA", {
          method: "post",
          path: "/api/datatables/jobs",
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
          path: "/api/datatables/jobs",
          data: this.data,
        });
      },
      deep: true,
    },

  },

  mounted() {
    this.$store.commit("setPath", "jobs");
    this.$store.commit("setHeaderText", "Vegman Servers Jobs Archive");
    this.$store.commit("setIcon", "mdi-database-plus-outline");
    this.$store.commit("setSortBy", 4);
    this.$store.commit("setItemsPerPage", 10);
  },
};
</script>