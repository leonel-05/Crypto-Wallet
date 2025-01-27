<template>
  <div class="transaction-history">
    <h2>Historial de Movimientos</h2>

    <div v-if="loading" class="loading">
      Cargando información de su cuenta...
    </div>

    <p v-else-if="transactions.length === 0" class="no-transactions">
      No hay transacciones registradas.
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Fecha y hora</th>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero</th>
          <th>Acción</th>
          <th>ID Usuario</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction._id">
          <td>{{ formatearFecha(transaction.datetime) }}</td>
          <td>{{ transaction.cripto_code.toUpperCase() }}</td>
          <td>{{ transaction.crypto_amount }}</td>
          <td>{{ transaction.money.toLocaleString() }} ARS</td>
          <td>{{ transaction.action === "purchase" ? "Compra" : "Venta" }}</td>
          <td>{{ transaction.user_id }}</td>
          <td>
            <button class="btn-edit" @click="editarTransaccion(transaction)">
              Editar
            </button>
            <button
              class="btn-delete"
              @click="eliminarTransaccion(transaction._id)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ActionsBuySell",
  data() {
    return {
      transactions: [],
      loading: true,
    };
  },
  methods: {
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
      } catch (error) {
        alert("Error al obtener el historial de movimientos.");
      } finally {
        this.loading = false;
      }
    },
    formatearFecha(datetime) {
      const date = new Date(datetime);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    async eliminarTransaccion(transactionId) {
      const confirmDelete = confirm("¿Quiere eliminar esta transacción?");
      if (!confirmDelete) return;

      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        await apiClient.delete(`/transactions/${transactionId}`);
        this.transactions = this.transactions.filter(
          (transaction) => transaction._id !== transactionId
        );
        alert("Transacción eliminada con éxito.");
      } catch (error) {
        alert("Error al eliminar la transacción.");
      }
    },
    editarTransaccion(transaction) {
      this.$router.push({
        name: "EditarTransaccion",
        params: { id: transaction._id },
      });
    },
  },
  mounted() {
    this.obtenerTransacciones();
  },
};
</script>

<style scoped>
.transaction-history {
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  color: #fff;
  min-height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 140px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
}

.no-transactions {
  text-align: center;
  font-size: 1.1em;
  color: #f5f5f5;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background-color: #121316;
  color: #fff;
}

th,
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.btn-edit {
  background-color: #45a247;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-delete {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #399f38;
}

.btn-delete:hover {
  background-color: #c9302c;
}
</style>
