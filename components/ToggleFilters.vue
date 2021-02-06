<template>
  <tr>
    <td></td>
    <td></td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="modelList"
        label="Filter by model"
        v-model="model"
        editable
        dense
      ></v-overflow-btn>
    </td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="standList"
        label="Filter by stand"
        v-model="stand"
        editable
        dense
      ></v-overflow-btn>
    </td>

    <td class="filter-item">
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateStartFilterValue"
            label="Start date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            @change="stopFilter"
            clearable
            dense
            @click:clear="dateStartFilterValue = null"
          ></v-text-field>
        </template>
        <v-date-picker
          width="260"
          no-title
          scrollable
          locale="ru-ru"
          v-model="dateStartFilterValue"
          @input="menu2 = false"
          @change="startFilter"
        ></v-date-picker>
      </v-menu>
    </td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="nameList"
        label="Filter by user"
        v-model="name"
        editable
        dense
      ></v-overflow-btn>
    </td>

    <td class="filter-item">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateStopFilterValue"
            label="Stop date"
            readonly
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            v-on="on"
            @change="stopFilter"
            clearable
            dense
            @click:clear="dateStopFilterValue = null"
          ></v-text-field>
        </template>
        <v-date-picker
          width="260"
          no-title
          scrollable
          locale="ru-ru"
          v-model="dateStopFilterValue"
          @input="menu = false"
          @change="stopFilter"
        ></v-date-picker>
      </v-menu>
    </td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="actionList"
        label="Filter by action"
        v-model="action"
        editable
        dense
      ></v-overflow-btn>
    </td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="orderList"
        label="Filter by order"
        v-model="order"
        editable
        dense
      ></v-overflow-btn>
    </td>

    <td class="filter-item"></td>

    <td class="filter-item">
      <v-overflow-btn
        class="my-2"
        :items="resultList"
        label="Filter by result"
        v-model="result"
        editable
        dense
      ></v-overflow-btn>
    </td>
  </tr>
</template>

<script>
export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",

      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      options: {
        sortBy: ["date_start"],
      },

      date: "",
      menu: false,
      modal: false,
      menu2: false,
    };
  },
  head() {
    return {
      title: "Jobs Archive",
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "Server",
          align: "center",
          sortable: true,
          value: "server_sn",
          index: 0,
        },
        { text: "Motherboard", align: "center", value: "mbd_sn", index: 1 },
        { text: "Model", align: "center", value: "server_model", index: 2 },
        { text: "Stand", align: "center", value: "stand", index: 3 },
        {
          text: "Start",
          align: "center",
          value: "date_start",
          filter: this.startFilter,
          index: 4,
        },
        { text: "Started by", align: "center", value: "starter", index: 5 },
        {
          text: "Stop",
          align: "center",
          value: "date_stop",
          filter: this.stopFilter,
          index: 6,
        },
        { text: "Action", align: "center", value: "action", index: 7 },
        { text: "Order", align: "center", value: "order", index: 8 },
        {
          text: "SELs",
          align: "center",
          value: "sel_logs",
          filterable: false,
          index: 9,
        },
        { text: "Result", align: "center", value: "result", index: 10 },
      ];
    },
    params(nv) {
      return {
        ...this.options,
        query: this.$store.dispatch("jobs/getJobs"),
      };
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    params: {
      handler() {
        this.$store.dispatch("jobs/getJobs");
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.dispatch("jobs/getJobs");
    this.$store.commit("title", "Vegman Servers Jobs Archive");
    this.$store.commit("icon", "mdi-database-plus-outline");
  },

  methods: {
    columnValueList(val) {
      return this.filteredtableData.map((d) => d[val]);
    },

    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    },

    rowClicked(row) {
      this.$store.dispatch("selectedRows", row.date_start);
      console.log(row);
    },
  },
};
</script>

<style>
.v-data-footer__icons-after {
  display: none;
}
.v-data-footer__icons-before {
  display: none;
}
.v-pagination {
  margin-top: 10px;
}
.filter-item {
  padding: 2px;
}
.v-progress-circular {
  margin-right: 0.5rem;
}

.overlayLeft {
  top: 80px;
  left: 20px;
  z-index: 1;
  position: absolute;
}
.overlayRight {
  bottom: -50px;
  right: 20px;
  z-index: 1;
  position: absolute;
}

.v-data-table-header th {
  text-transform: uppercase;
}

.theme--light.v-data-table .v-data-footer {
  width: 320px;
  border-top: thin solid rgba(0, 0, 0, 0);
  bottom: -50px;
  z-index: 1;
  position: absolute;
}

.theme--dark.v-data-table .v-data-footer {
  width: 320px;
  border-top: thin solid rgba(0, 0, 0, 0);
  bottom: -50px;
  z-index: 1;
  position: absolute;
}
.theme--light.v-banner.v-sheet {
  background-color: white;
}
.theme--dark.v-banner.v-sheet {
  background-color: #1e1e1e;
}
</style>