<template>
  <div class="dashboard-container">
    <div class="message-welcome">
      <h1>Bienvenido {{ usuario }} 👋</h1>
      <h3>
        Esto es Cryptowallet, tu billetera virtual que facilita la gestión de
        tus criptomonedas.
      </h3>
    </div>

    <div class="crypto-select">
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
      usuario: localStorage.getItem("username") || "Usuario",
      cryptos: [
        { name: "Bitcoin", short: "btc", image: "LogoBitcoin.jpg" },
        { name: "Ethereum", short: "eth", image: "LogoEthereum.png" },
        { name: "Litecoin", short: "ltc", image: "LogoLitecoin.jpg" },
      ],
    };
  },
  methods: {
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
  padding: 20px;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  min-height: 100vh;
  color: #fff;
}

.message-welcome h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #fff;
}

.message-welcome h3 {
  font-size: 1.2em;
  color: #dcdcdc;
}

.crypto-select {
  margin-top: 30px;
  width: 100%;
}

.crypto-select p {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #eee;
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
  border-radius: 15px;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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
