<template>
  <!-- <v-layout> -->
  <v-card elevation="0">
    <v-sheet class="overflow-y-auto" max-height="800">
      <v-container style="height: auto">
        <v-banner sticky
          ><v-icon slot="icon" size="36"> mdi-database-plus-outline </v-icon>
          <h2>Vegman Servers Jobs Archive</h2>
          <h6 v-if="selectedRows.length != 0">
            <span v-if="selectedRows.length <= 1"
              >{{ selectedRows.length }} row selected</span
            >
            <span v-else-if="selectedRows.length >= 2"
              >+ {{ selectedRows.length }} rows selected</span
            >
          </h6>
        </v-banner>
        <v-card-title>
          <v-btn
            tile
            class="mb-4"
            elevation="0"
            outlined
            x-small
            @click="resultFilterValue = ''"
            >All</v-btn
          >
          <v-btn
            tile
            class="mb-4"
            elevation="0"
            outlined
            x-small
            @click="resultFilterValue = 'running'"
          >
            Running</v-btn
          >

          <v-btn
            tile
            class="mb-4"
            @click="getFiltersData"
            elevation="0"
            outlined
            x-small
            color="indigo"
          >
            <v-icon x-small>mdi-filter</v-icon>
            Filter
          </v-btn>

          <v-btn
            tile
            class="mb-4"
            elevation="0"
            outlined
            x-small
            v-show="selectedRows.length >= 2"
            color="green"
            @click="resultFilterValue = 'FAILURE'"
          >
            <v-icon x-small>mdi-cached</v-icon>
            Rescan</v-btn
          >

          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          height="450"
          :headers="headers"
          :items="tableData"
          :options.sync="options"
          :page.sync="page"
          @page-count="pageCount = $event"
          :items-per-page="itemsPerPage"
          :loading="loading"
          elevation="0"
          item-key="date_start"
          v-model="selectedRows"
          fixed-header
          dense
          :footer-props="{
            showFirstLastPage: false,
            firstIcon: '',
            lastIcon: '',
            prevIcon: '',
            nextIcon: '',
          }"
        >
          <template v-slot:item="{ item }">
            <tr
              :style="
                selectedRows.indexOf(item.date_start) > -1
                  ? 'background:#eeeeee;'
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
                <v-layout justify-center>{{
                  $moment(item.date_start).format("YYYY-MM-DD hh:mm:ss")
                }}</v-layout>
              </td>
              <td>
                <v-layout justify-center>{{ item.starter }}</v-layout>
              </td>
              <td>
                <v-layout justify-center>{{
                  $moment(item.date_stop).format("YYYY-MM-DD hh:mm:ss")
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
                    class="ma-2"
                    v-if="item.result.toLowerCase() === 'success'"
                  >
                    <v-icon size="18"> mdi-check-circle </v-icon>
                    {{ item.result.toLowerCase() }}</v-chip
                  >
                  <v-chip
                    color="error"
                    small
                    text-color="white"
                    class="ma-2"
                    v-if="item.result.toLowerCase() === 'failure'"
                  >
                    <v-icon size="18"> mdi-close-circle </v-icon>
                    <b>{{ item.result.toLowerCase() }}</b></v-chip
                  >

                  <v-chip
                    color="orange"
                    small
                    text-color="white"
                    class="ma-2"
                    v-if="item.result.toLowerCase() === 'error'"
                  >
                    <v-icon size="18"> mdi-close-circle </v-icon>
                    <b>{{ item.result.toLowerCase() }}</b></v-chip
                  >

                  <v-chip
                    color="secondary"
                    small
                    text-color="white"
                    class="ma-2"
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
                    class="ma-2"
                    v-if="item.result.toLowerCase() === 'interrupted'"
                    link
                    to="/users"
                  >
                    <v-icon size="18"> mdi-information </v-icon>
                    <b>Stopped by {{ item.stopper }}</b></v-chip
                  >
                </v-layout>
              </td>
            </tr>
          </template>

          <template v-slot:header v-if="!hidden">
            <tr>
              <td></td>
              <td></td>

              <td class="filter-item">
                <v-overflow-btn
                  class="my-2"
                  :items="modelList"
                  label="Filter by model"
                  v-model="modelFilterValue"
                  editable
                  dense
                  hint="Select Vegman Server model"
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
                  v-model="nameFilterValue"
                  editable
                  dense
                  hint="Select username"
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
                  v-model="actionFilterValue"
                  editable
                  dense
                  hint="Select action"
                ></v-overflow-btn>
              </td>

              <td class="filter-item">
                <v-overflow-btn
                  class="my-2"
                  :items="orderList"
                  label="Filter by order"
                  v-model="orderFilterValue"
                  editable
                  dense
                  hint="Select order"
                ></v-overflow-btn>
              </td>

              <td class="filter-item"></td>

              <td class="filter-item">
                <v-overflow-btn
                  class="my-2"
                  :items="resultList"
                  label="Filter by result"
                  v-model="resultFilterValue"
                  editable
                  dense
                  hint="Select result"
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
</template>

<script>
export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",

      selectedRows: [],

      page: 1,
      hidden: true,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      loading: true,
      options: {
        sortBy: ["date_start"],
      },
      nameList: [{ text: "All", value: null }],
      modelList: [{ text: "All", value: null }],
      orderList: [{ text: "All", value: null }],
      actionList: [{ text: "All", value: null }],
      resultList: [{ text: "All", value: null }],
      tableData: [],

      date: "",
      menu: false,
      modal: false,
      menu2: false,

      nameFilterValue: null,
      // serverFilterValue: null,
      modelFilterValue: null,
      dateStartFilterValue: null,
      dateStopFilterValue: null,
      resultFilterValue: null,
      orderFilterValue: null,
      companyFilterValue: null,
      actionFilterValue: null,

      filters: {
        server_sn: [],
        server_model: [],
        date_start: [],
        date_stop: [],
        result: [],
        action: [],
        order: [],
        starter: [],
      },
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
        {
          text: "Model",
          align: "center",
          value: "server_model",
          filter: this.modelFilter,
          index: 2,
        },
        {
          text: "Start",
          align: "center",
          value: "date_start",
          filter: this.startFilter,
          index: 3,
        },
        {
          text: "Started by",
          align: "center",
          value: "starter",
          filter: this.nameFilter,
          index: 4,
        },
        {
          text: "Stop",
          align: "center",
          value: "date_stop",
          filter: this.stopFilter,
          index: 5,
        },
        {
          text: "Action",
          align: "center",
          value: "action",
          filter: this.actionFilter,
          index: 6,
        },
        {
          text: "Order",
          align: "center",
          value: "order",
          filter: this.orderFilter,
          index: 7,
        },
        {
          text: "SELs",
          align: "center",
          value: "sel_logs",
          filterable: false,
          index: 8,
        },
        {
          text: "Result",
          align: "center",
          value: "result",
          filter: this.resultFilter,
          index: 9,
        },
      ];
    },

    // filteredtableData() {
    //   return this.tableData.filter((d) => {
    //     return Object.keys(this.filters).every((f) => {
    //       return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
    //     });
    //   });
    // },

    params(nv) {
      return {
        ...this.options,
        query: this.search,
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
        this.getJobs();
      },
      deep: true,
    },
  },

  mounted() {
    // this.$axios.get("http://localhost:4000/jobs").then((res) => {
    //   this.tableData = res.data;
    //   this.loading = true;
    // });
  },

  methods: {
    async getJobs() {
      await this.$axios
        .post("http://localhost:5000/api/datatables/jobs", {
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
              column: this.headers.find(
                ({ value }) => value === this.options.sortBy[0]
              ).index,
              dir:
                this.options.sortDesc === false ||
                this.options.sortDesc[0] === false
                  ? "desc"
                  : "asc",
            },
          ],
          start: 0,
          length: 15,
          search: {
            value: "",
            regex: false,
          },
          optional: "",
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.loading = false;
        });
    },

    getFiltersData() {
      this.hidden = !this.hidden;

      let server_models = [];
      let started_by = [];
      let actions = [];
      let orders = [];
      let results = [];

      this.tableData.forEach(function (item) {
        server_models.push({
          text: item.server_model,
          value: item.server_model,
        });
      });

      this.tableData.forEach(function (item) {
        started_by.push({ text: item.starter, value: item.starter });
      });

      this.tableData.forEach(function (item) {
        actions.push({ text: item.action, value: item.action });
      });

      this.tableData.forEach(function (item) {
        orders.push({ text: item.order, value: item.order });
      });

      this.tableData.forEach(function (item) {
        results.push({ text: item.result, value: item.result });
      });

      this.modelList = this.modelList.concat(server_models);
      this.nameList = this.nameList.concat(started_by);
      this.actionList = this.actionList.concat(actions);
      this.orderList = this.orderList.concat(orders);
      this.resultList = this.orderList.concat(results);
    },

    columnValueList(val) {
      return this.filteredtableData.map((d) => d[val]);
    },

    nameFilter(value) {
      if (!this.nameFilterValue) {
        return true;
      }
      return value === this.nameFilterValue;
    },
    modelFilter(value) {
      if (!this.modelFilterValue) {
        return true;
      }
      return value === this.modelFilterValue;
    },
    orderFilter(value) {
      if (!this.orderFilterValue) {
        return true;
      }
      return value === this.orderFilterValue;
    },
    actionFilter(value) {
      if (!this.actionFilterValue) {
        return true;
      }
      return value === this.actionFilterValue;
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
      console.log(value);
      return value === this.dateStopFilterValue;
    },
    resultFilter(value) {
      if (!this.resultFilterValue) {
        return true;
      }
      return value === this.resultFilterValue;
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
      this.toggleSelection(row.date_start);
      console.log(row);
    },
    toggleSelection(keyID) {
      if (this.selectedRows.includes(keyID)) {
        this.selectedRows = this.selectedRows.filter(
          (selectedKeyID) => selectedKeyID !== keyID
        );
      } else {
        this.selectedRows.push(keyID);
      }
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
  padding: 0 20px 0 20px;
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