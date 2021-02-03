<template>
  <v-app id="login" class="primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-3 pa-3" rounded="sm">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="yadro_logo.png" alt="YADRO" width="80" height="80">
                  <h1 class="flex my-6">Welcome to the Vegman Automated Testing!</h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="username"
                    :error="error"
                    :rules="[rules.required]"/>
                  <v-text-field
                    :type="hidePassword ? 'password' : 'text'"
                    append-icon="mdi-key"
                    name="password"
                    label="Password"
                    id="password"
                    :rules="[rules.required]"
                    v-model="password"
                    :error="error"
                    @click:append="hidePassword = !hidePassword"/>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" :loading="loading" elevation="0" tile>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar
        v-model="showResult"
        :timeout="2000"
        top>
        {{ result }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      username: '',
      password: '',
      hidePassword: true,
      error: false,
      showResult: false,
      result: '',
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },

  methods: {
    // login() {
    //   const vm = this;

    //   if (!vm.userEmail || !vm.password) {

    //     vm.result = "Email and Password can't be empty.";
    //     vm.showResult = true;

    //     return;
    //   }

    //   if (vm.userEmail === vm.$root.userEmail && vm.password === vm.$root.userPassword) {
    //     vm.$router.push({ name: 'Jobs' });
    //   }
    //   else {
    //     vm.error = true;
    //     vm.result = "Email or Password is incorrect.";
    //     vm.showResult = true;
    //   }
    // },


//     loginUser(){
//         this.$axios.post('http://localhost:5000/login'), {
//   username: this.username,
//   password: this.password
// }
// .then((response) => {
//   console.log(response);
// }, (error) => {
//   console.log(error);
// });
//     }

async login() {
this.$axios.post('http://localhost:5000/login', {
    username: this.username,
    password: this.password
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
    }
  }
}
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
