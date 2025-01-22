<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Bienvenidos a Cryptowallet</h1>
      <h2>INICIO DE SESIÓN</h2>
      <form @submit.prevent="login">
        <div class="login-form-box">
          <input
            type="text"
            id="username"
            class="form-control"
            v-model="username"
            placeholder="Ingresa tu ID alfanumérico"
          />
        </div>
        <button type="submit" class="btn btn-login">Entrar</button>
        <p v-if="errorMessage" class="text-danger text-login-error">
          {{ errorMessage }}
        </p>
      </form>
    </div>
    <div class="login-image">
      <img
        src="../assets/image/imageLogin.jpg"
        alt="Cartera de criptomonedas"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      if (this.username.trim() === "") {
        this.errorMessage = "El ID no puede estar vacío.";
        return;
      }

      if (this.username.length < 3 || this.username.length > 15) {
        this.errorMessage = "El ID debe tener entre 3 y 15 caracteres.";
        return;
      }

      const regex = /^(?=.*[a-zA-Z])(?=.*?\d)[a-zA-Z0-9]+$/;
      if (!regex.test(this.username)) {
        this.errorMessage =
          "El ID debe contener al menos una letra y un número.";
        return;
      }

      localStorage.setItem("username", this.username);

      this.$router.replace("/dashboard");
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: #202020;
}

.login-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin: 2rem;
}

h1 {
  font-size: 3rem;
  color: #f3db05;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  color: #f3db05;
  margin-bottom: 2rem;
  text-align: center;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-login {
  width: 100%;
  padding: 10px;
  background-color: #f4f818;
  color: black;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #f3db05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.text-danger {
  color: #ff4d4d;
  font-size: 0.9rem;
}

.login-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-image img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-image img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
}
</style>
