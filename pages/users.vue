<template>
  <v-card elevation="0">
    <v-sheet
      id="scrolling-techniques-4"
      class="overflow-y-auto"
      max-height="800"
    >
      <v-container style="height: auto">
        <v-banner sticky
          ><v-icon slot="icon" size="36"> mdi-account-multiple </v-icon>
          <h2>User Administration</h2>
        </v-banner>
        <v-card-title>
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
          :sort-by="['name']"
          :sort-desc="[false]"
          elevation="0"
          show-select
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
          <template v-slot:item.company="{ item }"
            >{{ item.company }} [{{ item.email }}]</template
          >

          <template v-slot:item.name="props"
            ><a @click="editUser(props.item)">{{
              props.item.name
            }}</a></template
          >

          <template v-slot:item.state="{ item }">
            <v-icon
              color="green"
              size="18"
              text-color="white"
              class="ma-2"
              v-if="item.state === 'true'"
              >mdi-checkbox-blank-circle</v-icon
            >

            <v-icon
              color="gray"
              size="18"
              text-color="white"
              class="ma-2"
              v-if="item.state === 'false'"
              >mdi-cancel</v-icon
            >
          </template>

          <template v-slot:item.firstName="{ item }">
            <v-edit-dialog
              :return-value.sync="item.firstName"
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              {{ item.firstName }}
              <template v-slot:input>
                <v-text-field
                  v-model="item.firstName"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.role="{ item }">
            <v-edit-dialog
              :return-value.sync="item.role"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ item.role }}</div>
              <template v-slot:input>
                <div class="mt-4 title">Update user role</div>
                <v-text-field
                  v-model="item.role"
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

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.name"
                      label="Username"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.firstName"
                      label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.lastName"
                      label="Last Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.email"
                      label="eMail"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.role"
                      label="Role"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.company"
                      label="Company"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="saveUser"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}

          <template v-slot:action="{ attrs }">
            <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,

      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",

      page: 1,
      timer: "",
      hidden: true,
      active: false,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      loading: false,
      pagination: {
        sortBy: "name",
      },
      tableData: [],

      editedIndex: -1,
      editedUser: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
      },
      defaultUser: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
      },

      date: "",
      menu: false,
      modal: false,
      menu2: false,

      filters: {
        name: [],
        lastName: [],
      },
    };
  },
  head() {
    return {
      title: "Users",
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "Username",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "eMail", value: "email" },
        { text: "Role", value: "role" },
        { text: "Company", value: "company" },
        { text: "Online", value: "state" },
      ];
    },

    filteredtableData() {
      return this.tableData.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? "User" : "Edit";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    getUsers() {
      this.$axios.get("http://localhost:4000/users").then((res) => {
        this.tableData = res.data;
        this.loading = true;
      });
    },

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

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },

    saveUser() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.filteredtableData[this.editedIndex],
          this.editedUser
        );
      } else {
        this.filteredtableData.push(this.editedUser);
      }
      this.close();
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
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
  padding: 0 10px 0 10px;
}
.v-progress-circular {
  margin-right: 0.5rem;
}

.theme--light.v-data-table .v-data-footer {
  border-top: thin solid rgba(0, 0, 0, 0);
  float: left;
  width: 310px;
}
.theme--dark.v-data-table .v-data-footer {
  border-top: thin solid rgba(0, 0, 0, 0);
  float: left;
  width: 310px;
}
</style>