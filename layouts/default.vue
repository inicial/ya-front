<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- <Navbar v-if="$auth.loggedIn"/> -->
        <Navbar />
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "~/components/Navbar";

export default {
  components: {
    Navbar,
  },
};
</script>
