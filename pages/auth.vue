<template>
  <v-app id="login" class="primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-3 pa-3" rounded="sm">
              <v-card-text>
                <div class="layout column align-center">
                  <img
                    src="yadro_logo.png"
                    alt="YADRO"
                    width="80"
                    height="80"
                  />
                  <h3 class="flex my-6">
                    Welcome to the Vegman Automated Testing!
                  </h3>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="mdi-account-outline"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="login.username"
                    :error="error"
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    :type="hidePassword ? 'password' : 'text'"
                    :append-icon="hidePassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                    name="password"
                    label="Password"
                    id="password"
                    :rules="[rules.required]"
                    v-model="login.password"
                    :error="error"
                    @click:append="hidePassword = !hidePassword"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  block
                  color="primary"
                  @click="logedIn"
                  :loading="loading"
                  elevation="0"
                  tile
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar v-model="showResult" :timeout="2000" top>
        {{ result }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import jsCookie from 'js-cookie';

export default {
  data() {
    return {
      loading: false,
      login: {
        username: "",
        password: "",
      },
      hidePassword: true,
      error: false,
      showResult: false,
      result: "",
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },

  methods: {
//     getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// },

    async logedIn() {
      try {
        // let cookie = this.getCookie('session')
        let data = new FormData();
        data.append("username", this.login.username);
        data.append("password", this.login.password);
        let res = await this.$auth
          .loginWith("local", { data: data });

        this.$auth.setUser(res.data.user);
        // jsCookie.set('session', res.data.token);
        // this.$auth.$storage.setUniversal('session', res.token);
        this.$auth.$storage.setUniversal("user", res.data.user, true);
        this.$auth.$storage.setUniversal("role", res.data.role, true);
        this.$toast
          .show(res.data.msg, {
            theme: "toasted-primary",
            position: "bottom-center",
            icon: "fingerprint"
          })
          .goAway(5000);
        this.$router.push("/");
      } catch (err) {
        this.$toast
          .show(err, {
            theme: "toasted-primary",
            position: "bottom-center",
            icon: "fingerprint"
          })
          .goAway(5000);
      }
    },
  },
};
</script>

<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
