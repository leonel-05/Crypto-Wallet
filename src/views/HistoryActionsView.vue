<template>
  <div>
    <NavBar />
    <HistoryActions />
  </div>
</template>

<script>
import HistoryActions from "@/components/HistoryActions.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "HistoryActionsView",
  components: {
    NavBar,
    HistoryActions,
  },
};
</script>
