<template>
  <div class="navbar">
    <!--Enlaces de navegación-->
    <ul class="navbar-links">
      <li>
        <RouterLink to="/dashboard" class="nav-link logo">
          <img
            src="../assets/image/LogoCrypto.png"
            alt="Logo de Cryptowallet"
            class="logo-image"
          />
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/marketNav" class="nav-link">🛒 Market</RouterLink>
      </li>
      <li>
        <RouterLink to="/history" class="nav-link">
          🗃️ Tus Movimientos
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/Current-State" class="nav-link">
          💰 Estado de Cuenta
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/Investment" class="nav-link">
          📊 Tus Inversiones
        </RouterLink>
      </li>
    </ul>
    <!--Sección de autenticación(usuario y logout)-->
    <div class="navbar-auth">
      <span class="username">🔑 {{ username }}</span>
      <button @click="logout" class="logout-btn">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "", // Almacenará el username del usuario
    };
  },
  created() {
    // Obtenemos el username de localStorage al cargar el componente
    this.username = localStorage.getItem("username") || "Usuario";
  },
  methods: {
    //Cierra sesión eliminando el username de localStorage y redirige al login
    logout() {
      localStorage.removeItem("username");
      this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.navbar-links {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 15px;
  align-items: center;
}

.navbar-links li {
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #444;
  transform: scale(1.1);
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-right: 10px;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 20px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.logout-btn:hover {
  background-color: #c0392b;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 15px;
  }

  .navbar-links {
    justify-content: flex-start;
    gap: 10px;
    flex-wrap: wrap;
  }

  .navbar-auth {
    width: 100%;
    margin-top: 10px;
    justify-content: space-between;
  }

  .logout-btn {
    padding: 8px 12px;
    font-size: 14px;
  }
}
.logo-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 50%;
}
</style>
