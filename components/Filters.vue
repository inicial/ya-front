        <template>
  <v-card-title>
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" flat tile>
          <v-btn
            tile
            class="mb-0"
            elevation="0"
            outlined
            x-small
            @click="getAll"
            >All</v-btn
          >
          <v-btn
            tile
            class="mb-0"
            elevation="0"
            outlined
            x-small
            @click="getRunning"
          >
            Running</v-btn
          >

          <v-btn
            tile
            class="mb-0"
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
            class="mb-0"
            elevation="0"
            outlined
            x-small
            v-show="$store.state.selectedRows.length >= 2"
            color="green"
            @click="resultFilterValue = 'FAILURE'"
          >
            <v-icon x-small>mdi-cached</v-icon>
            Rescan</v-btn
          >
        </v-card>
      </v-col>
    </v-row>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      hide-details
    ></v-text-field>
  </v-card-title>

</template>

<script>
export default {
  props: {
    pageOfFilter: {
      type: String,
      required: true,
      default: "",
    },
    hidden: {
        type: Boolean,
        default: true,
    },
  },
  data() {
    return {
      iconHeader: "mdi-database-plus-outline",
      titleHeader: "Vegman Servers Jobs Archive",
      action: "",
      order: "",
      model: "",
      name: "",
      stand: "",

      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",

      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      loading: true,
      options: {
        sortBy: ["date_start"],
      },
      nameList: [{ text: "All", value: "" }],
      modelList: [{ text: "All", value: "" }],
      standList: [{ text: "All", value: "" }],
      orderList: [{ text: "All", value: "" }],
      actionList: [{ text: "All", value: "" }],
      resultList: [{ text: "All", value: "" }],

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

    params(nv) {
      return {
        ...this.options,
        query: this.$store.dispatch('jobs/getJobs', { result: ''}),
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

    search(){
      this.$store.commit('jobs/search', this.search)
    },
    result(){
      this.$store.commit('jobs/search', this.search)
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

  },

  methods: {
      getAll(){
          this.$store.dispatch("jobs/result", "")
      },
      getRunning(){
          this.$store.dispatch("jobs/result", "running")
      },
    async getJobs() {
    },

    getFiltersData() {
      this.$store.commit('toggle')
      this.actionFilter();
      this.resultFilter();
      this.orderFilter();
      this.modelFilter();
      this.nameFilter();
      this.standFilter();
    },

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
      this.toggleSelection(row.date_start);
      console.log(row);
    },
  },
};
</script>