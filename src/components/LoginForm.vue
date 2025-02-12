<template>
  <div class="login-container">
    <div class="login-box">
      <h1>CRYPTOWALLET</h1>
      <h3>Tu billetera virtual segura para gestionar criptomonedas</h3>

      <h2>INICIO DE SESIÓN</h2>
      <form @submit.prevent="login">
        <div class="login-form-box">
          <input
            type="text"
            id="username"
            class="form-control"
            v-model="username"
            placeholder="Ingresa tu ID alfanumérico"
          />
        </div>
        <button type="submit" class="btn btn-login">Entrar</button>
        <p v-if="errorMessage" class="text-danger text-login-error">
          {{ errorMessage }}
        </p>
      </form>

      <p class="register-link">
        ¿No tienes cuenta?
        <RouterLink to="/register">Regístrate aquí</RouterLink>
      </p>
    </div>

    <div class="crypto-chart">
      <h2>Precios en tiempo real</h2>
      <p v-if="loading" class="loading-message">Cargando precios...</p>
      <canvas id="priceChart" v-show="!loading"></canvas>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registro de módulos de Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default {
  data() {
    return {
      username: "",
      errorMessage: "",
      chart: null,
      intervalId: null,
      cryptoPrices: [],
      loading: true,
    };
  },
  methods: {
    login() {
      if (!this.validarUsuario()) return;

      // Recuperar datos de usuario desde localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser || storedUser.username !== this.username) {
        this.errorMessage =
          "El usuario no está registrado. Regístrate primero.";
        setTimeout(() => this.$router.push("/register"), 2000);
        return;
      }

      localStorage.setItem("username", storedUser.username);
      this.$router.replace("/dashboard");
    },

    validarUsuario() {
      if (this.username.trim() === "") {
        this.errorMessage = "El ID no puede estar vacío.";
        return false;
      }
      if (this.username.length < 3 || this.username.length > 15) {
        this.errorMessage = "El ID debe tener entre 3 y 15 caracteres.";
        return false;
      }
      if (!/^(?=.*[a-zA-Z])(?=.*?\d)[a-zA-Z0-9]+$/.test(this.username)) {
        this.errorMessage =
          "El ID debe contener al menos una letra y un número.";
        return false;
      }
      return true;
    },

    async fetchCryptoPrices() {
      if (!this.loading) return;
      this.loading = true;

      try {
        const cryptos = ["BTCUSDT", "ETHUSDT", "LTCUSDT"];
        const requests = cryptos.map((crypto) =>
          fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${crypto}`
          ).then((res) => res.json())
        );
        const responses = await Promise.all(requests);

        if (!responses || responses.length === 0) {
          throw new Error("No se recibieron datos de Binance.");
        }

        this.cryptoPrices = responses.map((data) => ({
          name: data.symbol.replace("USDT", ""),
          price: parseFloat(data.lastPrice),
        }));

        this.updateChart();
      } catch (error) {
        console.error("Error al obtener los precios de Binance:", error);
      } finally {
        this.loading = false;
      }
    },

    renderChart() {
      const ctx = document.getElementById("priceChart").getContext("2d");

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.cryptoPrices.map((crypto) => crypto.name),
          datasets: [
            {
              label: "Precio en USD",
              data: this.cryptoPrices.map((crypto) => crypto.price),
              borderColor: "#f3db05",
              backgroundColor: "rgba(243, 219, 5, 0.2)",
              borderWidth: 2,
              pointRadius: 5,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#f3db05",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    },

    updateChart() {
      if (this.chart) {
        this.chart.data.labels = this.cryptoPrices.map((crypto) => crypto.name);
        this.chart.data.datasets[0].data = this.cryptoPrices.map(
          (crypto) => crypto.price
        );
        this.chart.update();
      } else {
        this.renderChart();
      }
    },
  },

  mounted() {
    this.fetchCryptoPrices();
    this.intervalId = setInterval(this.fetchCryptoPrices, 120000);
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  color: #fff;
}

.login-box {
  flex: 1;
  max-width: 50%;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #f3db05;
  margin-bottom: 10px;
}

h3 {
  font-size: 1rem;
  color: #202020;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.2rem;
  color: #f3db05;
  margin-bottom: 1.5rem;
}

.form-control {
  width: 50%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-login {
  width: 50%;
  padding: 10px;
  background-color: #f4f818;
  color: black;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crypto-chart {
  flex: 1;
  max-width: 40%;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.loading-message {
  color: #202020;
  font-weight: bold;
}

canvas {
  width: 100% !important;
  height: 250px !important;
}

.register-link {
  color: black;
}
</style>
