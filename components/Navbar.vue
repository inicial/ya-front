    <template>
  <v-app-bar :clipped-left="clipped" app elevation="0" dense flat>
    <v-img
      class="mx-2"
      src="yadro_logo.png"
      max-height="40"
      max-width="40"
      contain
    ></v-img>

    <v-menu transition="slide-y-transition" bottom right offset-y rounded="0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="gray"
          v-bind="attrs"
          v-on="on"
          elevation="0"
          small
          tile
          class="mb-0"
        >
          Results
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in results"
          :key="i"
          :to="item.to"
          router
          dense
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template>
      <v-btn
        color="gray"
        elevation="0"
        small
        tile
        class="mb-0"
        link
        to="/vegmans_list"
      >
        Vegmans List
      </v-btn>
    </template>

    <v-menu transition="slide-y-transition" bottom right offset-y rounded="0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="gray"
          v-bind="attrs"
          v-on="on"
          elevation="0"
          small
          tile
          class="mb-0"
        >
          Dials
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in dials"
          :key="i"
          :to="item.to"
          router
          dense
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template>
      <v-btn
        color="gray"
        elevation="0"
        small
        tile
        class="mb-0"
        link
        to="/dhcp_leases"
      >
        DHCP
      </v-btn>
    </template>

    <template>
      <v-btn
        color="gray"
        elevation="0"
        small
        tile
        class="mb-0"
        link
        to="/users"
      >
        Users
      </v-btn>
    </template>

    <v-menu transition="slide-y-transition" bottom right offset-y rounded="0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="gray"
          v-bind="attrs"
          v-on="on"
          elevation="0"
          small
          tile
          class="mb-0"
        >
          Settings
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in settings"
          :key="i"
          :to="item.to"
          router
          dense
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />
    <v-spacer />
    <v-spacer />

    <v-list-item-content class="float-right">
      <v-list-item-title style="font-size: 12px; font-weight: bold"
        >VAT</v-list-item-title
      >
      <v-list-item-subtitle style="font-size: 10px">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on"
              >v.1.6.8 b.DA1721C (2020-12-21 17:27:13)</span
            >
          </template>
          <span>v.1.6.8 b.DA1721C (2020-12-21 17:27:13)</span>
        </v-tooltip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-divider class="mx-6" inset vertical v-if="$auth.loggedIn"></v-divider>

    <v-list-item-content style="text-align: center" v-if="$auth.loggedIn">
      <v-list-item-title style="font-size: 12px">
        <v-icon slot="icon" size="18"> mdi-account </v-icon
        >{{ $auth.user.name }}</v-list-item-title
      >
    </v-list-item-content>

    <v-divider class="mx-6" inset vertical v-if="$auth.loggedIn"></v-divider>

    <template>
      <v-btn
        color="gray"
        elevation="0"
        x-small
        tile
        class="mb-0"
        link
        to="/logout"
        v-if="$auth.loggedIn"
      >
        Logout
      </v-btn>

      <v-divider class="mx-6" inset vertical v-if="$auth.loggedIn"></v-divider>

      <v-btn icon @click="darkMode">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      username: "testDAT",
      results: [
        {
          icon: "mdi-apps",
          title: "Jobs",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "Queues",
          to: "/queues",
        },
      ],
      dials: [
        {
          icon: "mdi-orders",
          title: "Orders",
          to: "/orders",
        },
        {
          icon: "mdi-companies",
          title: "Companies",
          to: "/companies",
        },
      ],
      settings: [
        {
          icon: "mdi-orders",
          title: "Configurations",
          to: "/configurations",
        },
        {
          icon: "mdi-companies",
          title: "Programs",
          to: "/programs",
        },
        {
          icon: "mdi-companies",
          title: "Operation Systems",
          to: "/operation_systems",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "DAT",
    };
  },

  methods: {
    darkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkTheme", this.$vuetify.theme.dark.toString());
    },
  },
  mounted() {
    const theme = localStorage.getItem("darkTheme");
    if (theme) {
      if (theme === "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
      localStorage.setItem("darkTheme", this.$vuetify.theme.dark.toString());
    }
  },
};
</script>
