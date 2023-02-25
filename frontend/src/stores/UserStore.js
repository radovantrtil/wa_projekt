import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore("user", {
  state() {
    const oldToken = localStorage.getItem("token");

    if (oldToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + oldToken;
    }

    return {
      users: [],
      token: oldToken,
      error: null,
      isLoggingIn: false,
      loginMessage: null,
      afterLoginRoute: null,
    };
  },

  getters: {
    isAuthenticated: (state) => state.token !== null,
    user: (state) => jwtDecode(state.token),
  },

  actions: {
    async loadAll() {
      try {
        this.isLoggingIn = true;
        const response = await axios.get(config.backendUrl + "/user");
        this.users = response.data;
        this.error = null;
        this.isLoggingIn = false;
      } catch (e) {
        this.error = "Cannot load users " + e;
      }
    },
    async register(firstname, lastname, login, password, user_type_id) {
      try {
        this.isLoggingIn = true;

        const data = { firstname, lastname, login, password, user_type_id };
        await axios.post(config.backendUrl + "/user", data);

        this.error = null;
        this.loginMessage = null;
        this.isLoggingIn = false;
      } catch (e) {
        this.error = "Cannot register new account! " + e;
      }
    },

    async login(login, password) {
      try {
        this.isLoggingIn = true;

        const data = { login, password };
        const response = await axios.post(
          config.backendUrl + "/user/login",
          data
        );

        this.token = response.data.token;
        axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
        localStorage.setItem("token", this.token);

        this.error = null;
        this.loginMessage = null;
        this.isLoggingIn = false;
      } catch (e) {
        this.error = "Cannot log in! " + e;
      }
    },
    setLoginMessage(message) {
      this.loginMessage = message;
    },

    setAfterLoginRoute(route) {
      this.afterLoginRoute = route;
    },

    logout() {
      this.token = null;
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    },

    clearError() {
      this.error = null;
    },
  },
});
