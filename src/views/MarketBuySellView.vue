<template>
  <div>
    <NavBar />
    <MarketBuySell />
  </div>
</template>

<script>
import MarketBuySell from "@/components/MarketBuySell.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "MarketNavBar",
  components: {
    NavBar,
    MarketBuySell,
  },
};
</script>
