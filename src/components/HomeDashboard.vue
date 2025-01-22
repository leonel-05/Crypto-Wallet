<template>
  <div class="dashboard-container">
    <div class="message-welcome">
      <h1>Bienvenido {{ usuario }}👋</h1>
      <h3>
        Esto es Cryptowallet tu Billetera Virtual que facilita la gestion de tus
        Criptomonedas.
      </h3>
    </div>

    <div class="crypto-select">
      <p>¡Seleccione su Criptomoneda preferida y comience a generar!</p>
      <div class="crypto-item">
        <h3>Bitcoin (BTC)</h3>
        <img src="" alt="Logo de Bitcoin" />
      </div>

      <div class="crypto-item">
        <h3>Ethereum (ETH)</h3>
        <img src="" alt="Logo de Ethereum" />
      </div>

      <div class="crypto-item">
        <h3>Litcoin (LTC)</h3>
        <img src="" alt="Logo de Litecoin" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: localStorage.getItem("username"),
    };
  },
};
</script>
