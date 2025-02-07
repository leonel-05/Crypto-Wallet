<template>
  <div class="transaction-history">
    <h2>Historial de Movimientos</h2>

    <!--Filtro de fecha para ver transacciónes de un dia especifico-->
    <div class="filter">
      <input type="date" v-model="filterDate" />
      <button @click="filtrarPorFecha" class="btn-filter">Filtrar</button>
      <button @click="borrarFiltro" class="btn-filter">Mostrar todas</button>
    </div>

    <div v-if="loading" class="loading">
      Cargando información de su cuenta...
    </div>

    <!--Mensaje por si no hay transacciónes registradas-->
    <p v-else-if="transactions.length === 0" class="no-transactions">
      No hay transacciones registradas.
    </p>

    <!--Tabla de transacciónes-->
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
        <!--Muestra cada transacción en una fila-->
        <tr v-for="transaction in filteredTransactions" :key="transaction._id">
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
      transactions: [], //Lista de transacciónes obtenidas de la API
      loading: true,
      filterDate: "", //Fecha selecciónada para filtrar
    };
  },
  computed: {
    filteredTransactions() {
      if (!this.filterDate) return this.transactions; // Si no hay fecha filtrada, devuelve todas las transacciones
      return this.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.datetime)
          .toISOString()
          .split("T")[0]; //Convertimos la fecha a formato YYYY-MM-DD
        return transactionDate === this.filterDate;
      });
    },
  },
  methods: {
    //Obtenemos las transacciónes del usuario desde la API
    async obtenerTransacciones() {
      const userId = localStorage.getItem("username"); //Obtenemos el usuario guardado
      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        //Filtramos la consulta por el usuario
        const response = await apiClient.get(
          `/transactions?q={"user_id": "${userId}"}`
        );
        this.transactions = response.data;
      } catch (error) {
        alert("Error al obtener el historial de movimientos.");
      } finally {
        this.loading = false; //Cierra y desaparece el msj de espera
      }
    },
    //Formateamos la fecha para mostrar en la tabla
    formatearFecha(datetime) {
      const date = new Date(datetime);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    //Eliminamos una transacción de la base de datos
    async eliminarTransaccion(transactionId) {
      const confirmDelete = confirm("¿Quiere eliminar esta transacción?");
      if (!confirmDelete) return;

      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        await apiClient.delete(`/transactions/${transactionId}`);
        //Actualiza la lista eliminando la transacción
        this.transactions = this.transactions.filter(
          (transaction) => transaction._id !== transactionId
        );
        alert("Transacción eliminada con éxito.");
      } catch (error) {
        alert("Error al eliminar la transacción.");
      }
    },
    //Redirige a la vista de EditTrasaction con la información de la transacción
    editarTransaccion(transaction) {
      this.$router.push({
        name: "EditarTransaccion",
        params: { id: transaction._id },
      });
    },
    //Restablece el filtro por fecha y muestra todas las trasacciónes disponibles
    borrarFiltro() {
      this.filterDate = "";
    },
  },
  mounted() {
    this.obtenerTransacciones(); //Obtiene las transacciónes al cargar la vista
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
  border-radius: 5px 10px;
  cursor: pointer;
}

.btn-delete {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px 10px;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #399f38;
}

.btn-delete:hover {
  background-color: #c9302c;
}

.btn-filter {
  background-color: #00ffff;
  color: rgb(0, 0, 0);
  border: none;
  padding: 5px 10px;
  border-radius: 5px 20px;
  cursor: pointer;
}
</style>
