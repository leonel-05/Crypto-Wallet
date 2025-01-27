<template>
  <div class="crypto-market">
    <h1>Compra y Venta de Criptomonedas</h1>
    <!--botones para seleccionar tipo de transacción. Se inicializa en compra-->
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
    <!--Form para la transacción, la crypto se inicializa con la elegida en el HomeDashboard-->
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
          {{ transaction.money ? transaction.money.toLocaleString() : 0 }} ARS
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

      <button type="submit" class="btn-submit">
        {{
          transaction.action === "purchase"
            ? "Registrar Compra"
            : "Registrar Venta"
        }}
      </button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      transaction: {
        user_id: "",
        action: "purchase",
        cripto_code: "",
        crypto_amount: 0,
        money: "",
        datetime: "",
      },
      precioActual: 0,
      message: "",
    };
  },
  mounted() {
    this.comprobarUsuario();
    this.inicializarCriptoDesdeRuta();
  },
  methods: {
    establecerTipoTransaccion(tipo) {
      this.transaction.action = tipo;
    },
    comprobarUsuario() {
      const userId = localStorage.getItem("username");
      this.transaction.user_id = userId;
    },
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

        const priceData = response.data;
        if (priceData && priceData.totalBid) {
          this.precioActual = priceData.totalBid;
        } else if (priceData && priceData.ask) {
          this.precioActual = priceData.totalask;
        } else {
          this.precioActual = 0;
        }

        this.actualizarMonto();
      } catch (error) {
        this.message =
          "No se pudo obtener el precio actual. Intenta nuevamente.";
      }
    },
    actualizarMonto() {
      const cantidad = parseFloat(this.transaction.crypto_amount) || 0;
      if (cantidad > 0 && this.precioActual > 0) {
        this.transaction.money = parseFloat(
          (this.transaction.crypto_amount * this.precioActual).toFixed(2)
        );
      } else {
        this.transaction.money = 0;
      }
    },
    async enviarTransaccion() {
      const { cripto_code, crypto_amount, money, datetime } = this.transaction;

      if (
        !cripto_code ||
        parseFloat(crypto_amount) <= 0 ||
        !money ||
        parseFloat(money) <= 0 ||
        !datetime ||
        new Date(datetime) > new Date()
      ) {
        this.message = "Por favor, completa todos los campos correctamente.";
        return;
      }

      const fecha = new Date(this.transaction.datetime);
      this.transaction.datetime = fecha.toISOString();

      try {
        const clienteApi = axios.create({
          baseURL: "https://laboratorio-ab82.restdb.io/rest",
          headers: { "x-apikey": "650b525568885487530c00bb" },
        });

        await clienteApi.post("/transactions", this.transaction);
        this.message = "Transacción guardada exitosamente";

        setTimeout(() => {
          this.resetearFormulario();
        }, 3500);
      } catch (error) {
        this.message =
          error.response?.data?.message ||
          "Ocurrió un error al registrar la operación.";
      }
    },
    obtenerLogoCripto(criptoCode) {
      const logos = {
        btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        ltc: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      };
      return logos[criptoCode] || "";
    },
    resetearFormulario() {
      this.transaction.crypto_amount = "";
      this.transaction.money = "";
      this.transaction.datetime = "";
      this.message = "";
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
  margin-top: 140px;
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
