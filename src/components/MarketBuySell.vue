<template>
  <div class="crypto-market">
    <h1>Compra y Venta de Criptomonedas</h1>

    <!-- Botones para seleccionar tipo de transacción -->
    <div class="market-type">
      <button
        @click="establecerTipoTransaccion('purchase')"
        :class="{ active: transaction.action === 'purchase' }"
      >
        Comprar
      </button>
      <button
        @click="establecerTipoTransaccion('sale')"
        :class="{ active: transaction.action === 'sale' }"
      >
        Vender
      </button>
    </div>

    <!-- Formulario de transacción -->
    <form @submit.prevent="enviarTransaccion" class="transaction-form">
      <div class="form-group">
        <label for="crypto">Criptomoneda:</label>
        <div class="crypto-selector">
          <select
            id="crypto"
            v-model="transaction.cripto_code"
            @change="obtenerPrecioActual"
            required
          >
            <option disabled value="">Selecciona una opción</option>
            <option value="btc">Bitcoin (BTC)</option>
            <option value="eth">Ethereum (ETH)</option>
            <option value="ltc">Litecoin (LTC)</option>
          </select>
          <img
            :src="obtenerLogoCripto(transaction.cripto_code)"
            v-if="transaction.cripto_code"
            alt="Logo de la criptomoneda"
            class="crypto-logo"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="crypto-amount">Cantidad:</label>
        <input
          id="crypto-amount"
          type="number"
          step="0.00001"
          v-model="transaction.crypto_amount"
          @input="actualizarMonto"
          placeholder="Cantidad de criptomonedas"
        />
      </div>

      <p v-if="precioActual" class="price-info">
        Precio actual:
        <strong>{{ precioActual.toLocaleString() }} ARS</strong>
        por {{ transaction.cripto_code.toUpperCase() }}
      </p>

      <p class="total-info">
        Total {{ transaction.action === "purchase" ? "a Pagar" : "a Recibir" }}:
        <strong>
          {{ transaction.money ? transaction.money.toLocaleString() : 0 }}ARS
        </strong>
      </p>

      <div class="form-group">
        <label for="datetime">Fecha y Hora:</label>
        <input
          id="datetime"
          type="datetime-local"
          v-model="transaction.datetime"
        />
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn-submit">
          {{
            transaction.action === "purchase"
              ? "Registrar Compra"
              : "Registrar Venta"
          }}
        </button>
        <button type="button" @click="cancelar" class="btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
      saldoCriptos: {}, // Almacena el saldo disponible por criptomoneda
      precioActual: 0,
      message: "",
    };
  },
  mounted() {
    this.obtenerUsuario();
    this.inicializarCriptoDesdeRuta();
    this.obtenerSaldoDisponible();
  },
  methods: {
    // Obtiene el usuario desde localStorage
    obtenerUsuario() {
      const storedUser = localStorage.getItem("user");
      this.user = storedUser ? JSON.parse(storedUser) : { username: "Usuario" };
      this.transaction.user_id = this.user.username;
    },

    // Obtiene el saldo disponible de criptomonedas del usuario
    async obtenerSaldoDisponible() {
      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        const response = await apiClient.get(
          `/transactions?q={"user_id": "${this.user.username}"}`
        );

        // Calculamos el saldo disponible de cada criptomoneda
        const saldo = {};
        response.data.forEach(({ cripto_code, crypto_amount, action }) => {
          if (!saldo[cripto_code]) saldo[cripto_code] = 0;
          saldo[cripto_code] +=
            action === "purchase"
              ? parseFloat(crypto_amount)
              : -parseFloat(crypto_amount);
        });

        this.saldoCriptos = saldo;
      } catch (error) {
        console.error("Error al obtener saldo disponible:", error);
      }
    },

    // Establece el tipo de transacción
    establecerTipoTransaccion(tipo) {
      this.transaction.action = tipo;
    },

    // Inicializa la criptomoneda si se seleccionó desde Dashboard
    inicializarCriptoDesdeRuta() {
      const cripto = this.$route.params.crypto;
      if (cripto) {
        this.transaction.cripto_code = cripto;
        this.obtenerPrecioActual();
      }
    },

    async obtenerPrecioActual() {
      if (!this.transaction.cripto_code) return;
      try {
        const response = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.transaction.cripto_code}/ars`
        );

        this.precioActual = response.data.totalBid || response.data.ask || 0;
        this.actualizarMonto();
      } catch (error) {
        this.message =
          "No se pudo obtener el precio actual. Intenta nuevamente.";
      }
    },

    // Calcula el monto total en ARS
    actualizarMonto() {
      const cantidad = parseFloat(this.transaction.crypto_amount) || 0;
      this.transaction.money =
        cantidad > 0 && this.precioActual > 0
          ? parseFloat((cantidad * this.precioActual).toFixed(2))
          : 0;
    },

    // Verifica si el usuario tiene saldo suficiente antes de vender
    validarVenta() {
      const { cripto_code, crypto_amount } = this.transaction;
      const saldoDisponible = this.saldoCriptos[cripto_code] || 0;

      if (
        this.transaction.action === "sale" &&
        parseFloat(crypto_amount) > saldoDisponible
      ) {
        alert("No tienes suficiente saldo para vender esta cantidad.");
        return false;
      }
      return true;
    },

    // Registra la transacción
    async enviarTransaccion() {
      if (!this.validarVenta()) return;

      const { cripto_code, crypto_amount, money, datetime } = this.transaction;

      if (
        !cripto_code ||
        parseFloat(crypto_amount) <= 0 ||
        !money ||
        !datetime
      ) {
        this.message = "Por favor, completa todos los campos correctamente.";
        return;
      }

      this.transaction.datetime = new Date(datetime).toISOString();

      try {
        const apiClient = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        await apiClient.post("/transactions", this.transaction);
        this.message = "Transacción guardada exitosamente";

        setTimeout(() => {
          this.resetearFormulario();
          this.$router.push("/history");
        }, 3500);
      } catch (error) {
        this.message =
          error.response?.data?.message ||
          "Ocurrió un error al registrar la operación.";
      }
    },

    cancelar() {
      this.$router.push("/dashboard");
    },

    obtenerLogoCripto(criptoCode) {
      const logos = {
        btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        ltc: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      };
      return logos[criptoCode] || "";
    },
  },
};
</script>

<style scoped>
.crypto-market {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  min-height: 100vh;
  color: #fff;
}
.crypto-market h1 {
  margin-top: 130px;
}
.market-type {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.crypto-logo {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  vertical-align: middle;
}
.message {
  color: red;
  margin-top: 20px;
}
.market-type button {
  padding: 10px 20px;
  border: none;
  background-color: #eee;
  color: #333;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.market-type button.active {
  background-color: #45a247;
  color: #fff;
  font-weight: bold;
}
.transaction-form {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.form-group {
  margin-bottom: 15px;
  color: #333;
}
.price-info,
.total-info {
  margin: 10px 0;
  font-size: 1.1em;
  color: #333;
}
.form-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.btn-cancel {
  background-color: #e74c3c;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}
.btn-cancel:hover {
  background-color: #c0392b;
}
.btn-submit {
  background-color: #45a247;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}
.btn-submit:hover {
  background-color: #399f38;
}
</style>
