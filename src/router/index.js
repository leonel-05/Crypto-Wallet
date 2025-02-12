import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import HistoryActionsView from "@/views/HistoryActionsView.vue";
import MarketBuySell from "@/components/MarketBuySell.vue";
import MarketBuySellView from "@/views/MarketBuySellView.vue";
import EditTransaction from "@/components/EditTransaction.vue";
import CurrentStatusView from "@/views/CurrentStatusView.vue";
import InvestmentView from "@/views/InvestmentView.vue";
import RegisterForm from "@/components/RegisterForm.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "RegisterForm",
    component: RegisterForm,
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
  {
    path: "/editar/:id",
    name: "EditarTransaccion",
    component: EditTransaction,
    props: true,
  },
  {
    path: "/Current-State",
    name: "CurrentState",
    component: CurrentStatusView,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("username")) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/Investment",
    name: "Investments",
    component: InvestmentView,
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
