<template>
  <v-banner sticky
    ><v-icon slot="icon" size="36"> {{ $store.state.iconHeader }} </v-icon>
    <h2>{{ $store.state.titleHeader }}</h2>
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
