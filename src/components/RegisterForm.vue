<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Crear cuenta</h1>
      <h3>Únete a Cryptowallet y empieza a operar con criptomonedas</h3>

      <!--Formulario de Registro-->
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">ID de Usuario</label>
          <input
            type="text"
            id="username"
            class="form-control"
            v-model="username"
            placeholder="Ingresa un ID alfanumérico"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>

        <!--Mensaje de error por si algo falla-->
        <button type="submit" class="btn btn-register">Registrarse</button>
        <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

        <!--Enlace para devolver al usuario al login-->
        <p class="login-link">
          ¿Ya tienes cuenta?
          <RouterLink to="/">Inicia sesión aqui</RouterLink>
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
      email: "",
      errorMessage: "",
    };
  },
  methods: {
    register() {
      //Validaciones de username
      if (!this.username.trim() || !this.email.trim()) {
        this.errorMessage = "Todos los campos son obligatorios.";
        return;
      }

      if (this.username.length < 3 || this.username.length > 15) {
        this.errorMessage = "El ID debe tener entre 3 y 15 Caracteres.";
        return;
      }

      const idRegex = /^(?=.*[a-zA-Z])(?=.*?\d)[a-zA-Z0-9]+$/;
      if (!idRegex.test(this.username)) {
        this.errorMessage =
          "El ID debe contener al menos una letra y un número.";
        return;
      }

      //Validación para un correo electrónico correcto y valido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = "El correo electrónico no es valido";
        return;
      }

      //Guardamos el usuario en localStorage
      const userData = { username: this.username, email: this.email };
      localStorage.setItem("username", JSON.stringify(userData));

      //Envia al usuario al login para que ingrese
      this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #283c86, #45a247);
  color: #fff;
}

.register-box {
  max-width: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #f3db05;
}

h3 {
  font-size: 1rem;
  color: #202020;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #202020;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-register {
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

.btn-register:hover {
  background-color: #f3db05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.text-danger {
  color: #ff4d4d;
  font-size: 0.9rem;
}

.login-link {
  margin-top: 15px;
  font-size: 0.9rem;
  color: black;
}

.login-link a {
  color: #283c86;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
