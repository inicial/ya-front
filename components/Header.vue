<template>
  <v-banner sticky
    ><v-icon slot="icon" size="36"> {{ iconHeader }} </v-icon>
    <h2>{{ titleHeader }}</h2>
    <h6 v-if="$store.state.selectedRows.length != 0">
      <span v-if="$store.state.selectedRows.length <= 1"
        >{{ $store.state.selectedRows.length }} row selected</span
      >
      <span v-else-if="$store.state.selectedRows.length >= 2"
        >+ {{ $store.state.selectedRows.length }} rows selected</span
      >
    </h6>
  </v-banner>
</template>

<script>
export default {
  props: {
    titleHeader: {
      type: String,
      required: true,
    },
    iconHeader: {
      type: String,
      required: true,
    },
  },
};
</script>