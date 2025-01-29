<template>
  <div>
    <NavBar />
    <Investments />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Investments from "@/components/Investments.vue";

export default {
  name: "InvestmentView",
  components: {
    Investments,
    NavBar,
  },
};
</script>
