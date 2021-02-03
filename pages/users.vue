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
          :items="tableData"
          :options.sync="options"
          item-key="items.username"
          :page.sync="page"
          @page-count="pageCount = $event"
          :items-per-page="itemsPerPage"
          :loading="loading"
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
          <template v-slot:item.company="{ item }">{{ item.company }}</template>

          <template v-slot:item.username="props"
            ><a @click="editUser(props.item)">{{
              props.item.username
            }}</a></template
          >

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

          <template v-slot:item.first_name="{ item }">
            <v-edit-dialog
              :return-value.sync="item.first_name"
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              {{ item.first_name }}
              <template v-slot:input>
                <v-text-field
                  v-model="item.first_name"
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
                      v-model="editedUser.username"
                      label="Username"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.first_name"
                      label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.last_name"
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
      hidden: true,
      active: false,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      loading: true,
      options: {
        sortBy: ["username"],
      },
      totalData: 0,
      tableData: [],

      editedIndex: -1,
      editedUser: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        role: "",
      },
      defaultUser: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        role: "",
      },

      date: "",
      menu: false,
      modal: false,
      menu2: false,
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
          align: "center",
          sortable: true,
          value: "username",
          index: 0,
        },
        { text: "First Name", value: "first_name", align: "center", index: 1 },
        { text: "Last Name", value: "last_name", align: "center", index: 2 },
        { text: "eMail", value: "email", align: "center", index: 3 },
        { text: "Role", value: "role", align: "center", index: 4 },
        { text: "Company", value: "company", align: "center", index: 5 },
        { text: "Online", value: "online", index: 6 },
      ];
    },

    formTitle() {
      return this.editedIndex === -1 ? "User" : "Edit";
    },

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
        this.getUsers();
      },
      deep: true,
    },
  },

  methods: {
    async getUsers() {
      await this.$axios
        .post("http://localhost:5000/api/datatables/users", {
          draw: 1,
          columns: [
            {
              data: "username",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "first_name",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "last_name",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "email",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "role",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "company",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
                regex: false,
              },
            },
            {
              data: "online",
              name: "",
              searchable: true,
              orderable: true,
              search: {
                value: this.search,
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
          length: this.options.itemsPerPage,
          search: {
            value: this.search,
            regex: false,
          },
          optional: "null",
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.loading = false;
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