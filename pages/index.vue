<template>
  <!-- <v-layout> -->
  <v-card elevation="0">
    <v-sheet class="overflow-y-auto" max-height="800">
      <v-container style="height: auto">
        <v-banner sticky
          ><v-icon slot="icon" size="36"> mdi-database-plus-outline </v-icon>
          <h2>Dell Servers Jobs Archive</h2>
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
            @click="hidden = !hidden"
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
          :items="filteredtableData"
          :search="search"
          :page.sync="page"
          @page-count="pageCount = $event"
          :items-per-page="itemsPerPage"
          :loading="!loading"
          :sort-by="['date_start']"
          :sort-desc="[false]"
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
              <td>{{ item.server_sn }}</td>
              <td>
                <a>{{ item.mbd_sn }}</a>
              </td>
              <td>{{ item.server_model }}</td>
              <td>{{ $moment(item.date_start).format("YYYY-MM-DD hh:mm:ss") }}</td>
              <td>{{ item.starter }}</td>
              <td>{{ $moment(item.date_stop).format("YYYY-MM-DD hh:mm:ss") }}</td>
              <td>{{ item.action }}</td>
              <td>[{{ item.server_sn }}] {{ item.order }}</td>
              <td>
                <a href="/job_sels">{{ item.sel_logs }}</a>
              </td>
              <td>
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
                  {{ item.result.toLowerCase() }}</v-chip
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
                  {{ item.result }}
                </v-chip>
              </td>
            </tr>
          </template>

          <template v-slot:header v-if="!hidden">
            <tr>
              <td></td>
              <td></td>

              <td class="filter-item">
                <v-select
                  :items="modelList"
                  label="Filter by model"
                  v-model="modelFilterValue"
                ></v-select>
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
                      @click:clear="dateStartFilterValue = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateStartFilterValue"
                    @input="menu2 = false"
                    @change="stopFilter"
                  ></v-date-picker>
                </v-menu>
              </td>

              <td class="filter-item">
                <v-select
                  :items="nameList"
                  label="Filter by user"
                  v-model="nameFilterValue"
                ></v-select>
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
                      @click:clear="dateStopFilterValue = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateStopFilterValue"
                    @input="menu = false"
                    @change="stopFilter"
                  ></v-date-picker>
                </v-menu>
              </td>

              <td class="filter-item">
                <v-select
                  v-model="actionFilterValue"
                  :items="actionList"
                  label="Filter by action"
                ></v-select>
              </td>

              <td class="filter-item">
                <v-select
                  v-model="orderFilterValue"
                  :items="orderList"
                  label="Filter by order"
                ></v-select>
              </td>

              <td class="filter-item"></td>

              <td class="filter-item">
                <v-select
                  v-model="resultFilterValue"
                  :items="resultList"
                  label="Filter by result"
                ></v-select>
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
      loading: false,
      pagination: {
        sortBy: "server_sn",
      },
      nameList: [
        { text: "All", value: null },
        { text: "assembly", value: "assembly" },
        { text: "test", value: "test" },
      ],

      modelList: [
        { text: "All", value: null },
        { text: "VEGMAN Barebone Server", value: "VEGMAN Barebone Server" },
        { text: "MFI", value: "MFI" },
      ],
      orderList: [
        { text: "All", value: null },
        { text: "Rev.E 1890 pcs", value: "Rev.E 1890 pcs" },
        { text: "yadro", value: "yadro" },
      ],
      actionList: [
        { text: "All", value: null },
        { text: "Flash MACs", value: "Flash MACs" },
        { text: "Scan Inventory", value: "Scan Inventory" },
        { text: "Write FRU Data", value: "Write FRU Data" },
        { text: "Write VRM Data", value: "Write VRM Data" },
      ],
      resultList: [
        { text: "All", value: null },
        { text: "RUNNING", value: "running" },
        { text: "SUCCESS", value: "SUCCESS" },
        { text: "FAILURE", value: "FAILURE" },
      ],
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
          align: "start",
          sortable: true,
          value: "server_sn",
        },
        { text: "Motherboard", value: "mbd_sn" },
        { text: "Model", value: "server_model", filter: this.modelFilter },
        { text: "Start", value: "date_start", filter: this.startFilter },
        { text: "Started by", value: "starter", filter: this.nameFilter },
        { text: "Stop", value: "date_stop", filter: this.stopFilter },
        { text: "Action", value: "action", filter: this.actionFilter },
        { text: "Order", value: "order", filter: this.orderFilter },
        { text: "SELs", value: "sel_logs", filterable: false },
        { text: "Result", value: "result", filter: this.resultFilter },
      ];
    },

    filteredtableData() {
      return this.tableData.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
  },

  mounted() {
    this.$axios.get("http://localhost:4000/jobs").then((res) => {
      this.tableData = res.data;
      this.loading = true;
    });
  },

  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.filteredtableData.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
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
      console.log(value)
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