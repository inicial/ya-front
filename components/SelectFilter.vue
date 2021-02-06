<template>
  <td class="filter-item">
    <v-overflow-btn
      class="my-2"
      :items="items"
      :label="label"
      editable
      dense
    ></v-overflow-btn>
  </td>
</template>

<script>
export default {
    props: {
        label: "",
        items: {
            type: Array,
            require: true,
        },
    },
  //   data() {
  //     return {
  //       snack: false,
  //       snackColor: "",
  //       snackText: "",
  //       max25chars: (v) => v.length <= 25 || "Input too long!",

  //       page: 1,
  //       pageCount: 0,
  //       itemsPerPage: 10,
  //       options: {
  //         sortBy: ["date_start"],
  //       },

  //       date: "",
  //       menu: false,
  //       modal: false,
  //       menu2: false,
  //     };
  //   },

//   computed: {
//     params(nv) {
//       return {
//         ...this.options,
//         query: this.$store.dispatch("jobs/getJobs"),
//       };
//     },
//   },

//   watch: {
//     params: {
//       handler() {
//         this.$store.dispatch("jobs/getJobs");
//       },
//       deep: true,
//     },
//   },

//   mounted() {
//     this.$store.dispatch("jobs/getJobs");
//   },

//   methods: {},
};
</script>

<style>
.filter-item {
  padding: 2px;
}
</style>