<template>
  <v-app>
    <v-app-bar color="#ECBFA3">
      <v-app-bar-title>
        <v-icon>mdi-rocket-launch</v-icon>
        Flight Management
      </v-app-bar-title>
      <v-btn :to="{ name: 'home' }"
        ><v-icon>mdi-home-circle-outline</v-icon> Homepage</v-btn
      >
      <div v-if="userStore.isAuthenticated">
        <v-btn :to="{ name: 'flights' }">
          <v-icon>mdi-rocket-launch-outline</v-icon> Flights</v-btn
        >
      </div>
      <div v-if="userStore.isAuthenticated">
        <div v-if="userStore.user.role === 2">
          <v-btn :to="{ name: 'reservations' }">
            <v-icon>mdi-clipboard-clock-outline</v-icon> Reservations</v-btn
          >
        </div>
      </div>
      <div v-if="userStore.isAuthenticated">
        <v-btn :to="{ name: 'MyReservations' }">
          <v-icon>mdi-clipboard-clock-outline</v-icon> My reservations</v-btn
        >
      </div>
      <div v-if="userStore.isAuthenticated">
        <div v-if="userStore.user.role === 2 || userStore.user.role === 3">
          <v-btn :to="{ name: 'Notifications' }">
            <v-icon>mdi-bell-outline</v-icon> Notifications</v-btn
          >
        </div>
      </div>
      <v-btn :to="{ name: 'about' }"
        ><v-icon>mdi-information-outline</v-icon>About</v-btn
      >

      <v-menu anchor="bottom end" v-model="userMenuShown">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-account-outline">
            Activator slot
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item v-if="!userStore.isAuthenticated" @click="login()">
            <v-list-item-title>
              <v-icon>mdi-login</v-icon> Log in</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-else>
            <v-list-item>
              <v-icon>mdi-account-circle-outline </v-icon>&nbsp;
              <v-list-item-title
                v-text="
                  userStore.user.firstname + ' ' + userStore.user.lastname
                "
              >
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-icon>mdi-identifier </v-icon>&nbsp;
              <v-list-item-title v-text="userStore.user.login">
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-icon>mdi-account-key </v-icon>&nbsp;
              <v-list-item-title>
                <div v-if="userStore.user.role === 1">customer</div>
                <div v-else-if="userStore.user.role === 2">secretary</div>
                <div v-else-if="userStore.user.role === 3">technic</div>
                <div v-else>unknown</div>
              </v-list-item-title>
            </v-list-item>

            <v-btn @click="logout()" color="error" prepend-icon="mdi-logout"
              >Log out
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "./stores/UserStore";
import { mapStores } from "pinia/dist/pinia";

export default {
  name: "App",
  data() {
    return {
      userMenuShown: false,
    };
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {
    login() {
      this.$router.push({ name: "login" });
      this.userMenuShown = false;
    },
    logout() {
      this.userStore.logout();
      this.$router.push({ name: "home" });
      this.userMenuShown = false;
    },
  },
};
</script>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>
