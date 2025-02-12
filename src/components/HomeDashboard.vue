<template>
  <div class="dashboard-container">
    <div class="message-welcome-container">
      <!-- Sección de Mensaje de Bienvenida -->
      <div class="message-welcome">
        <h1>LA ÚNICA BILLETERA QUE NECESITÁS</h1>
        <h3>
          Cambiá pesos por Bitcoin, Ethereum y otras criptomonedas al instante.
          Generá rendimientos en pesos todos los días.
        </h3>
      </div>
    </div>

    <!-- Sección para seleccionar una Cripto y enviarnos al Market -->
    <div class="crypto-select">
      <h1>Market</h1>
      <p>¡Seleccione su criptomoneda preferida y comience a generar dinero!</p>
      <div class="crypto-list">
        <div
          class="crypto-item"
          v-for="crypto in cryptos"
          :key="crypto.short"
          @click="goToMarket(crypto.short)"
        >
          <h3>{{ crypto.name }} ({{ crypto.short.toUpperCase() }})</h3>
          <img
            class="crypto-image"
            :src="require(`@/assets/image/${crypto.image}`)"
            :alt="'Logo de ' + crypto.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null, // Almacenará el usuario autenticado
      cryptos: [
        { name: "Bitcoin", short: "btc", image: "LogoBitcoin.jpg" },
        { name: "Ethereum", short: "eth", image: "LogoEthereum.png" },
        { name: "Litecoin", short: "ltc", image: "LogoLitecoin.jpg" },
      ],
    };
  },
  created() {
    // Obtener usuario desde localStorage y parsear los datos
    const storedUser = localStorage.getItem("user");
    this.user = storedUser ? JSON.parse(storedUser) : { username: "Usuario" };
  },
  methods: {
    // Método para dirigir al MarketBuySell con una cripto seleccionada
    goToMarket(crypto) {
      this.$router.push({ name: "MarketBuySell", params: { crypto } });
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  color: #fff;
  background: linear-gradient(to bottom right, #283c86, #45a247);
}

.message-welcome-container {
  width: 100%;
  height: 100%;
  background: url("../assets/image/gif-Dahs.gif") no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.message-welcome {
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.message-welcome h1 {
  font-size: 3.9em;
  margin-top: 140px;
  margin-bottom: 20px;
  color: #fff;
}

.message-welcome h3 {
  font-size: 1.8em;
  color: #dcdcdc;
}

.crypto-select {
  margin-top: 50px;
  width: 100%;
  padding: 20px;
}

.crypto-select h1 {
  font-size: 3.5em;
  margin-bottom: 10px;
  margin-top: 30px;
  color: white;
  max-width: 400px;
  width: 100%;
  text-align: center;
  margin: 30px auto;
}

.crypto-select p {
  font-size: 1.5em;
  margin-bottom: 40px;
  color: white;
  max-width: 400px;
  width: 100%;
  text-align: center;
  margin: 30px auto;
}

.crypto-list {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.crypto-item {
  cursor: pointer;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
}

.crypto-item:hover {
  transform: scale(1.1);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
}

.crypto-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin: 10px auto;
  display: block;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.crypto-item h3 {
  margin-top: 10px;
  font-size: 1.2em;
  color: black;
}
</style>
