<template>
  <div>
    <NavBar />
    <HomeDashboard />
  </div>
</template>

<script>
import HomeDashboard from "@/components/HomeDashboard.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "HomeView",
  components: {
    HomeDashboard,
    NavBar,
  },
};
</script>
