<template>
  <v-data-table
    height="550"
    :headers="headers"
    :items="$store.state.data"
    :options.sync="options"
    :page.sync="page"
    @page-count="pageCount = $event"
    :items-per-page="itemsPerPage"
    :loading="$store.state.loading"
    elevation="0"
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
    <template v-slot:item="{ item }" v-if="$store.state.path === 'jobs'">
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
        <SelectFilter label="Filter by model" :items="$store.state.modelList" />
        <SelectFilter label="Filter by stand" :items="$store.state.standList" />
        <DateFilter label="Start date" />
        <SelectFilter label="Filter by user" :items="$store.state.userList" />
        <DateFilter label="Stop date" />
        <SelectFilter
          label="Filter by action"
          :items="$store.state.actionList"
        />
        <SelectFilter label="Filter by order" :items="$store.state.orderList" />
        <td></td>
        <SelectFilter
          label="Filter by result"
          :items="$store.state.resultList"
        />
      </tr>
    </template>

    <!-- <template v-slot:item.server_sn="props">
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
    </template> -->

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
</template>

<script>
export default {
    props: {
        headers: {
            type: Array,
            require: true,
        }
    },
  data() {
    return {
      page: this.$store.state.page,
      pageCount: this.$store.state.pageCount,
      itemsPerPage: this.$store.state.itemsPerPage,
      options: {
        sortBy: [this.$store.state.sortBy],
      },
        max25chars: (v) => v.length <= 25 || "Input too long!",
    };
  },
//   computed: {
    // headers() {
    //   return [
    //     {
    //       text: "Server",
    //       align: "center",
    //       sortable: true,
    //       value: "server_sn",
    //       index: 0,
    //     },
    //     { text: "Motherboard", align: "center", value: "mbd_sn", index: 1 },
    //     { text: "Model", align: "center", value: "server_model", index: 2 },
    //     { text: "Stand", align: "center", value: "stand", index: 3 },
    //     {
    //       text: "Start",
    //       align: "center",
    //       value: "date_start",
    //       filter: this.startFilter,
    //       index: 4,
    //     },
    //     { text: "Started by", align: "center", value: "starter", index: 5 },
    //     {
    //       text: "Stop",
    //       align: "center",
    //       value: "date_stop",
    //       filter: this.stopFilter,
    //       index: 6,
    //     },
    //     { text: "Action", align: "center", value: "action", index: 7 },
    //     { text: "Order", align: "center", value: "order", index: 8 },
    //     {
    //       text: "SELs",
    //       align: "center",
    //       value: "sel_logs",
    //       filterable: false,
    //       index: 9,
    //     },
    //     { text: "Result", align: "center", value: "result", index: 10 },
    //   ];
    // },
//     params(nv) {
//       return {
//         ...this.options,
//         query: this.$store.state.search,
//       };
//     },
//   },

//   watch: {
//     params: {
//       handler() {
//         this.$store.dispatch("GET_DATA", {method: 'post', path: '/api/datatables/jobs', data: ''});
//       },
//       deep: true,
//     },
//   },

  methods: {
    rowClicked(row) {
      this.$store.dispatch("selectedRows", row.date_start);
      console.log(row);
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

    editUser(item) {
      this.editedIndex = this.filteredtableData.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
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
</style>