import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import HistoryActionsView from "@/views/HistoryActionsView.vue";
import MarketBuySell from "@/components/MarketBuySell.vue";
import MarketBuySellView from "@/views/MarketBuySellView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "home",
    component: HomeView,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("username")) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/market/:crypto",
    name: "MarketBuySell",
    component: MarketBuySell,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("username")) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/marketNav",
    name: "MarketNavBar",
    component: MarketBuySellView,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("username")) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/history",
    name: "HistoryActions",
    component: HistoryActionsView,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("username")) {
        next("/");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
