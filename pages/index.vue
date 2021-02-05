<template>
  <v-col>
    <!-- <v-layout> -->
    <v-card elevation="0" min-width="800">
      <v-sheet class="overflow-y-auto" max-height="800">
        <v-container style="height: auto">
          <Header
            :titleHeader="titleHeader"
            :iconHeader="iconHeader"
          />

          <Filters pageOfFilter="Jobs" />

          <v-data-table
            height="550"
            :headers="headers"
            :items="$store.state.jobs.apiData"
            :options.sync="options"
            :page.sync="page"
            @page-count="pageCount = $event"
            :items-per-page="itemsPerPage"
            :loading="$store.state.jobs.loading"
            elevation="0"
            item-key="date_start"
            fixed-header
            dense
            :footer-props="{
              showFirstLastPage: false,
              firstIcon: '',
              lastIcon: '',
              prevIcon: '',
              nextIcon: '',
            }"
            class="text-sm-caption"
          >
            <template v-slot:item="{ item }">
              <tr
                :class="
                  $store.state.selectedRows.indexOf(item.date_start) > -1
                    ? 'v-data-table__selected'
                    : ''
                "
                @click="rowClicked(item)"
              >
                <td>
                  <v-layout justify-center>{{ item.server_sn }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>
                    <a>{{ item.mbd_sn }}</a>
                  </v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{ item.server_model }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{ item.stand }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{
                    $moment.utc(item.date_start).format("YYYY-MM-DD HH:mm:ss")
                  }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{ item.starter }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{
                    $moment.utc(item.date_stop).format("YYYY-MM-DD HH:mm:ss")
                  }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center>{{ item.action }}</v-layout>
                </td>
                <td>
                  <v-layout justify-center
                    >[{{ item.server_sn }}] {{ item.order }}</v-layout
                  >
                </td>
                <td>
                  <v-layout justify-center>
                    <a href="/job_sels">{{ item.sel_logs }}</a>
                  </v-layout>
                </td>
                <td>
                  <v-layout justify-center>
                    <v-chip
                      color="green"
                      small
                      text-color="white"
                      class="ma-0"
                      v-if="item.result.toLowerCase() === 'success'"
                    >
                      <v-icon size="18" class="mr-1"> mdi-check-circle </v-icon>
                      {{ item.result.toLowerCase() }}</v-chip
                    >
                    <v-chip
                      color="error"
                      small
                      text-color="white"
                      class="ma-0"
                      v-if="item.result.toLowerCase() === 'failure'"
                    >
                      <v-icon size="18" class="mr-1"> mdi-close-circle </v-icon>
                      <b>{{ item.result.toLowerCase() }}</b></v-chip
                    >

                    <v-chip
                      color="orange"
                      small
                      text-color="white"
                      class="ma-0"
                      v-if="item.result.toLowerCase() === 'error'"
                    >
                      <v-icon size="18" class="mr-1"> mdi-close-circle </v-icon>
                      <b>{{ item.result.toLowerCase() }}</b></v-chip
                    >

                    <v-chip
                      color="secondary"
                      small
                      text-color="white"
                      class="ma-0"
                      v-if="item.result.toLowerCase() === 'running'"
                      link
                      to="/users"
                    >
                      <v-progress-circular
                        indeterminate
                        color="white"
                        :size="16"
                      ></v-progress-circular>
                      <b>{{ item.result }}</b>
                    </v-chip>

                    <v-chip
                      color="info"
                      small
                      text-color="white"
                      class="ma-0"
                      v-if="item.result.toLowerCase() === 'interrupted'"
                      link
                      to="/users"
                    >
                      <v-icon size="18" class="mr-1"> mdi-information </v-icon>
                      <b>stopped by {{ item.stopper }}</b>
                    </v-chip>
                  </v-layout>
                </td>
              </tr>
            </template>

            <template v-slot:header v-if="$store.state.hidden">
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

            <template v-slot:item.server_sn="props">
              <v-edit-dialog
                :return-value.sync="props.item.server_sn"
                @save="save"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                {{ props.item.server_sn }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.server_sn"
                    :rules="[max25chars]"
                    label="Edit server"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.server_model="props">
              <v-edit-dialog
                :return-value.sync="props.item.server_model"
                large
                persistent
                @save="save"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                <div>{{ props.item.server_model }}</div>
                <template v-slot:input>
                  <div class="mt-4 title">Update server model</div>
                  <v-text-field
                    v-model="props.item.server_model"
                    :rules="[max25chars]"
                    label="Edit"
                    single-line
                    counter
                    autofocus
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>

            <template v-slot:footer>
              <div class="overlayRight">
                <div class="float-right">
                  <div class="text-center">
                    <v-pagination
                      v-model="page"
                      :length="pageCount"
                      :total-visible="7"
                    ></v-pagination>
                  </div>
                </div>
              </div>
            </template>
          </v-data-table>

          <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
              <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
          </v-snackbar>
        </v-container>
      </v-sheet>
    </v-card>
    <!-- </v-layout> -->
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      iconHeader: "mdi-database-plus-outline",
      titleHeader: "Vegman Servers Jobs Archive",

      result: "",
      action: "",
      order: "",
      model: "",
      name: "",
      stand: "",
      optional: "",

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
      nameList: [{ text: "All", value: "" }],
      modelList: [{ text: "All", value: "" }],
      standList: [{ text: "All", value: "" }],
      orderList: [{ text: "All", value: "" }],
      actionList: [{ text: "All", value: "" }],
      resultList: [{ text: "All", value: "" }],
      tableData: this.$store.state.jobs.apiData,

      date: "",
      menu: false,
      modal: false,
      menu2: false,

      dateStartFilterValue: null,
      dateStopFilterValue: null,
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
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    action() {
      this.getJobs();
    },
    result() {
      this.getJobs();
    },
    order() {
      this.getJobs();
    },
    model() {
      this.getJobs();
    },
    name() {
      this.getJobs();
    },
    stand() {
      this.getJobs();
    },

    params: {
      handler() {
        this.getJobs();
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.dispatch("jobs/getJobs", { result: ''});
  },

  methods: {
    async getJobs() {
      
    },

    // getFiltersData() {
    //   this.hidden = !this.hidden;
    //   this.actionFilter();
    //   this.resultFilter();
    //   this.orderFilter();
    //   this.modelFilter();
    //   this.nameFilter();
    //   this.standFilter();
    // },

    columnValueList(val) {
      return this.filteredtableData.map((d) => d[val]);
    },

    nameFilter() {
      this.$axios.get("http://localhost:5000/api/job/users").then((res) => {
        let users = [];
        res.data.users.forEach(function (item) {
          users.push({ text: item.username, value: item.id });
        });
        this.nameList = this.nameList.concat(users);
      });
    },
    modelFilter() {
      this.$axios
        .get("http://localhost:5000/api/servers/models")
        .then((res) => {
          let models = [];
          res.data.models.forEach(function (item) {
            models.push({ text: item.name, value: item.id });
          });
          this.modelList = this.modelList.concat(models);
        });
    },
    standFilter() {
      this.$axios.get("http://localhost:5000/api/job/stands").then((res) => {
        let stands = [];
        res.data.stands.forEach(function (item) {
          stands.push({ text: item.name, value: item.id });
        });
        this.standList = this.standList.concat(stands);
      });
    },
    orderFilter() {
      this.$axios.get("http://localhost:5000/api/job/orders").then((res) => {
        let orders = [];
        res.data.orders.forEach(function (item) {
          orders.push({ text: item.name, value: item.id });
        });
        this.orderList = this.orderList.concat(orders);
      });
    },
    actionFilter() {
      this.$axios.get("http://localhost:5000/api/job/actions").then((res) => {
        let actions = [];
        res.data.actions.forEach(function (item) {
          actions.push({ text: item.name, value: item.id });
        });
        this.actionList = this.actionList.concat(actions);
      });
    },
    startFilter(value) {
      if (!this.dateStartFilterValue) {
        return true;
      }
      value = this.$moment(value).format("YYYY-MM-DD");
      return value === this.dateStartFilterValue;
    },
    stopFilter(value) {
      if (!this.dateStopFilterValue) {
        return true;
      }
      value = this.$moment(value).format("YYYY-MM-DD");
      return value === this.dateStopFilterValue;
    },
    resultFilter() {
      this.$axios.get("http://localhost:5000/api/job/results").then((res) => {
        let results = [];
        res.data.results.forEach(function (item) {
          results.push({ text: item.name, value: item.id });
        });
        this.resultList = this.resultList.concat(results);
      });
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
      this.$store.dispatch('selectedRows', row.date_start)
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
  width: 310px;
  border-top: thin solid rgba(0, 0, 0, 0);
  bottom: -50px;
  left: 20px;
  z-index: 1;
  position: absolute;
}

.theme--dark.v-data-table .v-data-footer {
  width: 310px;
  border-top: thin solid rgba(0, 0, 0, 0);
  bottom: -50px;
  left: 20px;
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