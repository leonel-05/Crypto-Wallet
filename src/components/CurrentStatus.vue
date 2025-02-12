<template>
  <div class="account-analysis">
    <h2>Análisis de tu cuenta</h2>
    <!-- Mensaje de carga mientras se obtienen los datos -->
    <div v-if="loading" class="loading-spinner">Cargando información...</div>

    <!-- Tabla con los datos cuando la carga finaliza -->
    <div v-else>
      <table class="crypto-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in agregarCryptos"
            :key="transaction.cripto_code"
          >
            <td>{{ transaction.cripto_code.toUpperCase() }}</td>
            <td>{{ transaction.total_amount }}</td>
            <td>{{ transaction.total_value.toLocaleString() }} ARS</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"><strong>Total</strong></td>
            <td class="total-value">
              <strong>{{ valorTotal.toLocaleString() }} ARS</strong>
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
  name: "CurrentState",
  data() {
    return {
      user: null, // Almacena los datos del usuario autenticado
      transactions: [], // Almacena las transacciones del usuario
      agregarCryptos: [], // Criptomonedas con su cantidad y valor en ARS
      valorTotal: 0, // Valor total en ARS
      loading: true,
    };
  },
  methods: {
    // Obtiene el usuario desde localStorage
    obtenerUsuario() {
      const storedUser = localStorage.getItem("user");
      this.user = storedUser ? JSON.parse(storedUser) : { username: "Usuario" };
    },

    // Obtiene las transacciones del usuario autenticado
    async obtenerTransacciones() {
      this.obtenerUsuario();
      if (!this.user.username) {
        alert("No hay un usuario autenticado.");
        return;
      }

      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        // Filtramos por el usuario autenticado
        const response = await apiClient.get(
          `/transactions?q={"user_id": "${this.user.username}"}`
        );
        this.transactions = response.data;
        this.calcularInversiones();
      } catch (error) {
        alert("Error al obtener el historial de movimientos.");
        this.loading = false;
      }
    },

    // Calcula la cantidad total de cada cripto y su valor en ARS
    async calcularInversiones() {
      const saldos = {}; // Objeto para almacenar el saldo de cada criptomoneda

      // Calcula el saldo total por criptomoneda
      this.transactions.forEach(({ cripto_code, crypto_amount, action }) => {
        const amount = parseFloat(crypto_amount);
        if (!saldos[cripto_code]) saldos[cripto_code] = 0;
        saldos[cripto_code] += action === "purchase" ? amount : -amount;
      });

      try {
        // Obtiene el precio de cada criptomoneda
        const cryptoPromises = Object.keys(saldos).map(async (cripto_code) => {
          if (saldos[cripto_code] <= 0) return null; // Ignorar si no hay saldo positivo

          // API de Binance para obtener el precio actual
          const response = await axios.get(
            `https://criptoya.com/api/binance/${cripto_code}`
          );
          const currentPrice = response.data?.bid || 0;

          return {
            cripto_code,
            total_amount: saldos[cripto_code],
            total_value: parseFloat(
              (saldos[cripto_code] * currentPrice).toFixed(2)
            ),
          };
        });

        // Procesar todas las promesas
        const resultados = await Promise.all(cryptoPromises);

        // Filtrar criptos sin saldo y calcular el total
        this.agregarCryptos = resultados.filter((crypto) => crypto !== null);
        this.valorTotal = this.agregarCryptos.reduce(
          (sum, { total_value }) => sum + total_value,
          0
        );

        console.log("Criptomonedas procesadas:", this.agregarCryptos);
        console.log("Valor total calculado:", this.valorTotal);
      } catch (error) {
        alert("Error al obtener los precios de las criptomonedas.");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.obtenerTransacciones();
  },
};
</script>

<style scoped>
.account-analysis {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  color: black;
  min-height: 100vh;
}

h2 {
  margin-top: 120px;
  color: #fff;
  font-size: 3rem;
}

.crypto-table {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.crypto-table th,
.crypto-table td {
  padding: 15px;
  text-align: left;
}

.crypto-table th {
  background-color: #283c86;
  color: white;
  font-weight: bold;
}

.crypto-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.crypto-table tr:hover {
  background-color: #d9edf7;
}

.total-value {
  color: #45a247;
  font-weight: bold;
}

.loading-spinner {
  margin-top: 50px;
  font-size: 1.2em;
  color: white;
}
</style>
