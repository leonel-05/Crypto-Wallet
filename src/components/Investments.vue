<template>
  <div class="investment-analysis">
    <h2>📊 Análisis de Inversiones</h2>

    <div v-if="loading" class="loading-message">Cargando datos...</div>

    <div v-else>
      <table class="investment-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad Total</th>
            <th>Valor Actual</th>
            <th>Ganancia/Pérdida</th>
            <th>% Cambio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, cripto) in resumenInversion" :key="cripto">
            <td>{{ cripto.toUpperCase() }}</td>
            <td>{{ data.totalAmount }}</td>
            <td>{{ data.valorActual.toLocaleString() }} ARS</td>
            <td
              :class="{
                profit: data.ganancia > 0,
                loss: data.ganancia < 0,
              }"
            >
              {{ data.ganancia.toLocaleString() }} ARS
            </td>
            <td
              :class="{
                profit: data.porcentajeCambio > 0,
                loss: data.porcentajeCambio < 0,
              }"
            >
              {{ data.porcentajeCambio.toFixed(2) }}%
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td :class="{ profit: totalGanancia > 0, loss: totalGanancia < 0 }">
              <strong>{{ totalGanancia.toLocaleString() }} ARS</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InvestmentAnalysis",
  data() {
    return {
      user: null, // Almacena el usuario autenticado
      transactions: [],
      preciosActuales: {},
      resumenInversion: {},
      totalGanancia: 0,
      loading: true,
    };
  },
  methods: {
    async obtenerDatos() {
      this.obtenerUsuario();
      if (!this.user.username) {
        alert("No hay un usuario autenticado.");
        return;
      }

      try {
        await this.obtenerTransacciones();
        await this.obtenerPreciosBinance();
        this.calcularResultados();
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        this.loading = false;
      }
    },

    // Obtiene el usuario desde localStorage
    obtenerUsuario() {
      const storedUser = localStorage.getItem("user");
      this.user = storedUser ? JSON.parse(storedUser) : { username: "Usuario" };
    },

    // Obtener transacciones del usuario autenticado
    async obtenerTransacciones() {
      const apiClient = axios.create({
        baseURL: "https://laboratorio-ab82.restdb.io/rest",
        headers: { "x-apikey": "650b525568885487530c00bb" },
      });

      const response = await apiClient.get(
        `/transactions?q={"user_id": "${this.user.username}"}`
      );
      this.transactions = response.data;
    },

    // Obtener precios desde Binance
    async obtenerPreciosBinance() {
      try {
        const cryptos = [
          ...new Set(this.transactions.map((t) => t.cripto_code)),
        ];
        const requests = cryptos.map((cripto) =>
          axios.get(
            `https://api.binance.com/api/v3/ticker/price?symbol=${cripto.toUpperCase()}USDT`
          )
        );

        const responses = await Promise.all(requests);
        this.preciosActuales = responses.reduce((acc, res) => {
          const cripto = res.data.symbol.replace("USDT", "").toLowerCase();
          acc[cripto] = parseFloat(res.data.price);
          return acc;
        }, {});
      } catch (error) {
        console.error("Error al obtener precios de Binance:", error);
      }
    },

    // Calcular resultados de inversión
    calcularResultados() {
      const resumen = {};
      let totalGanancia = 0;

      this.transactions.forEach(
        ({ cripto_code, crypto_amount, money, action }) => {
          if (!resumen[cripto_code]) {
            resumen[cripto_code] = {
              totalAmount: 0,
              totalInvertido: 0,
              totalVenta: 0,
            };
          }

          if (action === "purchase") {
            resumen[cripto_code].totalAmount += parseFloat(crypto_amount);
            resumen[cripto_code].totalInvertido += parseFloat(money);
          } else {
            resumen[cripto_code].totalAmount -= parseFloat(crypto_amount);
            resumen[cripto_code].totalVenta += parseFloat(money);
          }
        }
      );

      Object.keys(resumen).forEach((cripto) => {
        const totalAmount = resumen[cripto].totalAmount;
        const totalInvertido = resumen[cripto].totalInvertido;
        const totalVenta = resumen[cripto].totalVenta;
        const currentPrice = this.preciosActuales[cripto] || 0;

        const valorActual = totalAmount * currentPrice;
        const ganancia = totalVenta + valorActual - totalInvertido;
        const porcentajeCambio =
          totalInvertido > 0 ? (ganancia / totalInvertido) * 100 : 0;

        resumen[cripto] = {
          totalAmount,
          valorActual,
          ganancia,
          porcentajeCambio,
        };
        totalGanancia += ganancia;
      });

      this.resumenInversion = resumen;
      this.totalGanancia = totalGanancia;
    },
  },
  mounted() {
    this.obtenerDatos();
  },
};
</script>

<style scoped>
.investment-analysis {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  min-height: 100vh;
  color: #fff;
}

h2 {
  margin-top: 100px;
  font-size: 2.5em;
}

.investment-table {
  width: 100%;
  max-width: 850px;
  background: rgb(155, 154, 154);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.investment-table th {
  background-color: #283c86;
  color: white;
  padding: 10px;
  border: 1.5px solid black;
}

.investment-table td {
  padding: 10px;
  font-size: 1.1em;
  border: 1.5px solid black;
}

.profit {
  color: #28a745;
  font-weight: bold;
}

.loss {
  color: #dc3545;
  font-weight: bold;
}

.loading-message {
  font-size: 1.2em;
  color: white;
}
</style>
