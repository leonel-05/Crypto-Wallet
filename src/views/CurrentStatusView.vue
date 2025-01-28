<template>
  <div>
    <NavBar />
    <CurrentStatus />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import CurrentStatus from "@/components/CurrentStatus.vue";

export default {
  name: "CurrentStatusView",
  components: {
    CurrentStatus,
    NavBar,
  },
};
</script>
