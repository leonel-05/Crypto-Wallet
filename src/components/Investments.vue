<template>
  <div class="investment-analysis">
    <h2>Análisis de Inversiones</h2>
    <div v-if="loading" class="loading">Cargando información...</div>
    <div v-else>
      <table class="crypto-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Ganancia/Pérdida</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(result, cripto_code) in resultadosInversion"
            :key="cripto_code"
          >
            <td>{{ cripto_code.toUpperCase() }}</td>
            <td
              :class="{
                'positive-result': result > 0,
                'negative-result': result < 0,
                'neutral-result': result === 0,
              }"
            >
              {{ result.toLocaleString() }} ARS
              <span v-if="result > 0" class="icon-positive">📈</span>
              <span v-else-if="result < 0" class="icon-negative">📉</span>
              <span v-else class="icon-neutral">⚖️</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total</strong></td>
            <td
              :class="{
                'positive-result': totalInversion > 0,
                'negative-result': totalInversion < 0,
              }"
            >
              <strong>{{ totalInversion.toLocaleString() }} ARS</strong>
            </td>
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
      transactions: [],
      resultadosInversion: {},
      totalInversion: 0,
      precios: {},
      loading: true,
    };
  },
  methods: {
    // Obtener todas las transacciones del usuario
    async obtenerTransacciones() {
      const userId = localStorage.getItem("username");
      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        const response = await apiClient.get(
          `/transactions?q={"user_id": "${userId}"}`
        );
        this.transactions = response.data;
        await this.calcularResultados();
      } catch (error) {
        alert("Error al obtener las transacciones del usuario.");
      } finally {
        this.loading = false;
      }
    },

    // Obtener precios actuales de las criptomonedas
    async obtenerPrecios() {
      try {
        // Usamos SatoshiTango porque aquí necesitamos datos más generales, como el precio bid,
        // para calcular resultados globales sin tanto detalle por moneda.
        const response = await axios.get(
          "https://criptoya.com/api/satoshitango"
        );
        this.precios = response.data;
      } catch (error) {
        alert("Error al obtener los precios actuales.");
        this.precios = {};
      }
    },

    // Calcular las ganancias/pérdidas por criptomoneda
    async calcularResultados() {
      const saldos = this.obtenerSaldosPorCripto();
      await this.obtenerPrecios();

      const resultados = {};
      let total = 0;

      Object.entries(saldos).forEach(([cripto_code, saldo]) => {
        const currentPrice = this.precios[cripto_code]?.bid || 0;
        const { purchaseTotal, purchaseAmount, saleTotal } = saldo;

        let resultado = 0;
        if (saleTotal > 0) {
          const averagePurchasePrice =
            purchaseAmount > 0 ? purchaseTotal / purchaseAmount : 0;
          resultado = saleTotal - averagePurchasePrice * purchaseAmount;
        } else {
          resultado = currentPrice * purchaseAmount - purchaseTotal;
        }

        resultados[cripto_code] = parseFloat(resultado.toFixed(2));
        total += resultado;
      });

      this.resultadosInversion = resultados;
      this.totalInversion = parseFloat(total.toFixed(2));
    },

    // Obtener saldos por criptomoneda
    obtenerSaldosPorCripto() {
      const saldos = {};

      this.transactions.forEach(
        ({ cripto_code, crypto_amount, money, action }) => {
          const amount = parseFloat(crypto_amount);
          const totalMoney = parseFloat(money);

          if (!saldos[cripto_code]) {
            saldos[cripto_code] = {
              purchaseAmount: 0,
              purchaseTotal: 0,
              saleTotal: 0,
            };
          }

          if (action === "purchase") {
            saldos[cripto_code].purchaseAmount += amount;
            saldos[cripto_code].purchaseTotal += totalMoney;
          } else if (action === "sale") {
            saldos[cripto_code].saleTotal += totalMoney;
          }
        }
      );

      return saldos;
    },
  },
  mounted() {
    this.obtenerTransacciones();
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

.crypto-table {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.crypto-table th,
.crypto-table td {
  padding: 15px;
  text-align: center;
}

.crypto-table th {
  background-color: #283c86;
  color: white;
}

.crypto-table td {
  font-size: 1.2em;
  background-color: #a0a9ac;
}

.crypto-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.crypto-table tr:hover {
  background-color: #d9edf7;
}

.positive-result {
  color: #28a745;
  font-weight: bold;
}

.negative-result {
  color: #dc3545;
  font-weight: bold;
}

.neutral-result {
  color: #ffc107;
  font-weight: bold;
}

.icon-positive,
.icon-negative,
.icon-neutral {
  margin-left: 10px;
}
</style>
