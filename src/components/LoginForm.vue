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
            class="form control"
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
          "El ID debe contener al menos una letra y un numero.";
        return;
      }

      localStorage.setItem("username", this.username);

      this.$router.replace("/dashboard");
    },
  },
};
</script>
