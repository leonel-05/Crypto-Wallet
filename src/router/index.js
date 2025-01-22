import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import MarketBuySell from "@/components/MarketBuySell.vue";

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
        next("/"); // Redirige al login si no hay usuario autenticado
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
