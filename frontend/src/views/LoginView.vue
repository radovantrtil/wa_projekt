<template>
  <error
    v-if="userStore.error"
    :text="userStore.error"
    @hide="userStore.clearError()"
  ></error>
  <v-alert type="warning" v-else-if="userStore.loginMessage" class="mb-7">{{
    userStore.loginMessage
  }}</v-alert>

  <div v-if="userStore.isLoggingIn">Logging in ...</div>
  <div v-else>
    <h1 class="d-flex align-center mb-4">
      Sign in
      <v-spacer /><v-btn
        rounded="pill"
        :to="{ name: 'register' }"
        color="#2699FF"
      >
        <v-icon>mdi-account-plus </v-icon> Create account</v-btn
      >
    </h1>
    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="9" sm="6">
            <v-text-field
              variant="outlined"
              v-model="username"
              label="Username"
              type="text"
              :rules="usernameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="9" sm="6">
            <v-text-field
              variant="outlined"
              v-model="password"
              label="Password"
              :rules="passwordRules"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn rounded="pill" color="#52CF53" @click="login()">
          <v-icon>mdi-login</v-icon> Login
        </v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useUserStore } from "../stores/UserStore";
import Error from "../components/Error.vue";

export default {
  name: "Login",

  components: {
    Error,
  },

  data() {
    return {
      show1: false,
      formValid: true,
      username: "",
      password: "",
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => (v && v.length >= 3) || "Username must be at least 3 characters",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      ],
    };
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {
    async login() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.userStore.login(this.username, this.password);
      if (!this.userStore.error) {
        this.$router.push(
          this.userStore.afterLoginRoute ?? { name: "flights" }
        );
        this.userStore.setAfterLoginRoute(null);
      }
    },
  },
};
</script>

<style scoped></style>
