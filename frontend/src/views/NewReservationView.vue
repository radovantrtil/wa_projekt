<template>
  <error
    v-if="reservationStore.error"
    :text="reservationStore.error"
    @hide="reservationStore.clearError()"
  ></error>

  <div v-if="reservationStore.isLoading">
    Trying to create new reservation...
  </div>
  <div v-else>
    <h1 class="d-flex align-center mb-4">
      Create new reservation
      <v-spacer />
    </h1>

    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-container>
        <v-row>
          <v-col>
            Choose customer:
            <v-autocomplete
              label="Choose user"
              :items="userSelectItems"
              v-model="selectedUser"
              required
            ></v-autocomplete>
          </v-col>

          <v-col>
            Choose flight:
            <v-autocomplete
              label="Choose flight"
              :items="flightSelectItems"
              v-model="selectedFlight"
              required
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-textarea
              variant="outlined"
              v-model="description"
              :rules="descRules"
              auto-grow
              filled
              color="deep-purple"
              label="Description"
              rows="1"
            ></v-textarea>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
            <v-btn x-large block color="success" @click="create()"
              >Create</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useReservationStore } from "../stores/ReservationStore";
import { useFlightStore } from "../stores/FlightStore";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";
export default {
  name: "NewReservation",

  components: {
    Error,
  },

  data() {
    return {
      description: "",
      formValid: true,
      selectedFlight: null,
      selectedUser: null,
      descRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length >= 10) || "Description must be at least 10 characters",
      ],
    };
  },
  created() {
    this.flightStore.loadAll();
    this.userStore.loadAll();
  },
  computed: {
    ...mapStores(useReservationStore, useFlightStore, useUserStore),

    flightSelectItems() {
      return this.flightStore.flights.map((flight) => ({
        title: flight.title,
        value: flight.id_flight,
      }));
    },
    userSelectItems() {
      return this.userStore.users.map((user) => ({
        title: user.firstname + " " + user.lastname,
        value: user.id_user,
      }));
    },
  },

  methods: {
    async create() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.reservationStore.create(
        this.selectedUser,
        this.selectedFlight,
        this.description
      );

      if (!this.reservationStore.error) {
        this.$router.push(
          this.reservationStore.afterCreateRoute ?? { name: "reservations" }
        );
        this.reservationStore.setAfterCreateRoute(null);
      }
    },
  },
};
</script>

<style scoped></style>
