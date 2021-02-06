<template>
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
            :label="label"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            clearable
            dense
          ></v-text-field>
        </template>
        <v-date-picker
          width="260"
          no-title
          scrollable
          locale="ru-ru"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
    </td>
</template>

<script>
export default {
    props: {
        label: "",
    },
      data() {
    return {
      date: "",
      menu: false,
      modal: false,
      menu2: false,
    };
  },
  // computed: {
  //   params(nv) {
  //     return {
  //       ...this.options,
  //       query: this.$store.dispatch("jobs/getJobs"),
  //     };
  //   },
  // },

  // watch: {
  //   params: {
  //     handler() {
  //       this.$store.dispatch("jobs/getJobs");
  //     },
  //     deep: true,
  //   },
  // },

  // mounted() {
  //   this.$store.dispatch("jobs/getJobs");
  // },

  // methods: {},
};
</script>

<style>
.filter-item {
  padding: 2px;
}
</style>