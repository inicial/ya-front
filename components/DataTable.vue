<template>
  <v-data-table
    v-model="selected"
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
    item-key="id"
    @click:row="rowClicked"
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
    <template v-slot:item.server_sn="props"
      ><a>{{ props.item.server_sn }}</a></template
    >

    <template v-slot:item.result="props">
      <v-chip
        color="green"
        small
        text-color="white"
        class="ma-0"
        v-if="props.item.result === 'SUCCESS'"
      >
        <v-icon size="18" class="mr-1"> mdi-check-circle </v-icon>
        {{ props.item.result }}</v-chip
      >
      <v-chip
        color="error"
        small
        text-color="white"
        class="ma-0"
        v-if="props.item.result === 'FAILURE'"
      >
        <v-icon size="18" class="mr-1"> mdi-close-circle </v-icon>
        <b>{{ props.item.result }}</b></v-chip
      >

      <v-chip
        color="orange"
        small
        text-color="white"
        class="ma-0"
        v-if="props.item.result === 'ERROR'"
      >
        <v-icon size="18" class="mr-1"> mdi-close-circle </v-icon>
        <b>{{ props.item.result }}</b></v-chip
      >

      <v-chip
        color="secondary"
        small
        text-color="white"
        class="ma-0"
        v-if="props.item.result === 'RUNNING'"
        link
        to="/users"
      >
        <v-progress-circular
          indeterminate
          color="white"
          :size="16"
        ></v-progress-circular>
        <b>{{ props.item.result }}</b>
      </v-chip>

      <v-chip
        color="info"
        small
        text-color="white"
        class="ma-0"
        v-if="props.item.result === 'INTERRUPTED'"
        link
        to="/users"
      >
        <v-icon size="18" class="mr-1"> mdi-information </v-icon>
        <b>stopped by {{ props.item.stopper }}</b>
      </v-chip>
    </template>

    <template v-slot:item.online="{ item }">
      <v-icon
        color="green"
        size="18"
        text-color="white"
        class="ma-2"
        v-if="item.online === true"
        >mdi-checkbox-blank-circle</v-icon
      >

      <v-icon
        color="gray"
        size="18"
        text-color="white"
        class="ma-2"
        v-if="item.online === false"
        >mdi-cancel</v-icon
      >
    </template>

    <template v-slot:item.date_start="props">{{
      $moment.utc(props.item.date_start).format("YYYY-MM-DD HH:mm:ss")
    }}</template>

    <template v-slot:item.date_stop="props">{{
      $moment.utc(props.item.date_stop).format("YYYY-MM-DD HH:mm:ss")
    }}</template>

    <template v-slot:item.username="props"
      ><a>{{ props.item.username }}</a></template
    >

    <template v-slot:item.sel_logs="props"
      ><a>{{ props.item.sel_logs }}</a></template
    >

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
              :total-visible="8"
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
    },
  },
  data() {
    return {
      selected: [],
      page: this.$store.state.page,
      pageCount: this.$store.state.pageCount,
      itemsPerPage: this.$store.state.itemsPerPage,
      options: {
        sortBy: [this.$store.state.sortBy],
      },
    };
  },

  methods: {
    rowClicked(value, row) {
      this.$store.dispatch("selectedRows", value);
      if (row.isSelected) row.select(false);
      else row.select(true);
      console.log(this.$store.state.selectedRows);
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
      this.editedIndex = this.$store.state.data.indexOf(item);
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