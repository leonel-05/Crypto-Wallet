<template>
  <div class="edit-transaction">
    <h2>Editar Transacción</h2>
    <div v-if="isLoading" class="loading-spinner">Cargando...</div>

    <form @submit.prevent="actualizarTransaccion" class="form">
      <div class="form-group">
        <label for="crypto_code">Criptomoneda:</label>
        <select v-model="transaction.cripto_code" id="crypto_code" required>
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="ltc">Litecoin</option>
        </select>
      </div>

      <div class="form-group">
        <label for="crypto_amount">Cantidad</label>
        <input
          type="number"
          v-model="transaction.crypto_amount"
          @input="actualizarMonto"
          step="any"
          required
        />
      </div>

      <div class="form-group">
        <label for="action">Acción</label>
        <select v-model="transaction.action" id="action" required>
          <option value="purchase">Comprar</option>
          <option value="sale">Vender</option>
        </select>
      </div>

      <div class="form-group">
        <label>Dinero Calculado:</label>
        <p class="calculated-money">{{ transaction.money || "0" }} ARS</p>
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn btn-primary">
          Actualizar Transacción
        </button>
        <button type="button" @click="cancelarEdit" class="btn btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

// Configuración del cliente API
const apiClient = axios.create({
  baseURL: "https://laboratorio-ab82.restdb.io/rest",
  headers: { "x-apikey": "650b525568885487530c00bb" },
});

export default {
  name: "EditTransaction",
  props: ["id"], // Obtiene el ID de la transacción desde la ruta
  data() {
    return {
      user: null, // Almacenará los datos del usuario
      transaction: {
        user_id: "",
        action: "purchase",
        cripto_code: "",
        crypto_amount: 0,
        money: "",
        datetime: "",
      },
      isLoading: false,
    };
  },
  methods: {
    // Obtiene el usuario desde localStorage
    obtenerUsuario() {
      const storedUser = localStorage.getItem("user");
      this.user = storedUser ? JSON.parse(storedUser) : { username: "Usuario" };
    },

    // Obtiene la transacción desde la API
    async obtenerTransaccion() {
      this.obtenerUsuario(); // Asegura que `user` esté disponible antes de asignar datos
      try {
        const response = await apiClient.get(`/transactions/${this.id}`);
        this.transaction = response.data;

        // Asegura que el `user_id` coincida con el usuario autenticado
        if (this.transaction.user_id !== this.user.username) {
          alert("No tienes permiso para editar esta transacción.");
          this.$router.push("/history");
        }
      } catch (error) {
        alert("Error al obtener la transacción.");
      }
    },

    // Calcula el valor de la transacción en ARS usando la API de precios
    async actualizarMonto() {
      try {
        const response = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.transaction.cripto_code}/ars`
        );

        const currentPrice = response.data.ask;
        this.transaction.money = parseFloat(
          (this.transaction.crypto_amount * currentPrice).toFixed(2)
        );
      } catch (error) {
        alert("Error al obtener el valor de la Criptomoneda.");
      }
    },

    // Actualiza la transacción en la base de datos
    async actualizarTransaccion() {
      this.isLoading = true;

      if (
        !this.transaction.cripto_code ||
        !this.transaction.crypto_amount ||
        !this.transaction.action
      ) {
        alert("Todos los campos son obligatorios.");
        this.isLoading = false;
        return;
      }

      if (this.transaction.crypto_amount <= 0) {
        alert("La cantidad debe ser mayor a 0.");
        this.isLoading = false;
        return;
      }

      try {
        const { action, cripto_code, crypto_amount, money } = this.transaction;
        const updatedTransaction = {
          action,
          cripto_code,
          crypto_amount,
          money,
        };

        await apiClient.patch(`/transactions/${this.id}`, updatedTransaction);
        alert("Transacción actualizada con éxito.");
        this.$router.push("/history");
      } catch (error) {
        alert("Error al actualizar la transacción.");
      } finally {
        this.isLoading = false;
      }
    },

    cancelarEdit() {
      this.$router.push("/history");
    },
  },
  mounted() {
    this.obtenerTransaccion();
  },
};
</script>

<style scoped>
.edit-transaction {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  min-height: 100vh;
  color: #fff;
}

.edit-transaction h2 {
  margin-top: 60px;
  font-size: 2.5em;
  font-weight: bold;
}

.form {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #283c86;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1em;
  color: #333;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #45a247;
  box-shadow: 0 0 8px rgba(69, 162, 71, 0.5);
  outline: none;
}

.calculated-money {
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: #2e7d32;
  text-align: center;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary {
  background-color: #45a247;
  color: #fff;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #399f38;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #bdbdbd;
  transform: scale(1.05);
}
</style>
