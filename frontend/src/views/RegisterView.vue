<template>
  <error
    v-if="userStore.error"
    :text="userStore.error"
    @hide="userStore.clearError()"
  ></error>
  <v-alert type="warning" v-else-if="userStore.loginMessage" class="mb-7">{{
    userStore.loginMessage
  }}</v-alert>
  <div v-if="userStore.isLoggingIn">Trying to create new account...</div>
  <div v-else>
    <h1 class="d-flex align-center mb-4">
      Create new account
      <v-spacer />
    </h1>

    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="6" sm="3" md="3">
            <v-text-field
              variant="outlined"
              v-model="firstName"
              label="First Name"
              required
              :rules="nameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="3" md="3">
            <v-text-field
              variant="outlined"
              v-model="lastName"
              label="Last Name"
              required
              :rules="nameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              v-model="username"
              :rules="usernameRules"
              label="Username"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              v-model="password"
              label="Password"
              :rules="passwordRules"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              block
              v-model="verify"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[passwordRules, passwordMatch]"
              :type="show2 ? 'text' : 'password'"
              name="input-10-1"
              label="Confirm Password"
              counter
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
            <v-btn x-large block color="success" @click="register()"
              >Register</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useUserStore } from "../stores/UserStore";
import Error from "../components/Error.vue";

export default {
  name: "Register",

  components: {
    Error,
  },

  data() {
    return {
      show1: false,
      show2: false,
      formValid: true,
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      verify: "",
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => (v && v.length >= 3) || "Username must be at least 3 characters",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      ],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 3) || "Name must be at least 3 characters",
      ],
    };
  },

  computed: {
    ...mapStores(useUserStore),
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },

  methods: {
    async register() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.userStore.register(
        this.firstName,
        this.lastName,
        this.username,
        this.password,
        1
      );

      if (!this.userStore.error) {
        this.$router.push(this.userStore.afterLoginRoute ?? { name: "login" });
        this.userStore.setAfterLoginRoute(null);
      }
    },
  },
};
</script>

<style scoped></style>
