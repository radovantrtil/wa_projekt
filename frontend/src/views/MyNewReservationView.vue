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
  name: "MyNewReservation",

  components: {
    Error,
  },

  data() {
    return {
      description: "",
      formValid: true,
      selectedFlight: null,
      descRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length >= 10) || "Description must be at least 10 characters",
      ],
    };
  },
  created() {
    this.flightStore.loadAll();
  },
  computed: {
    ...mapStores(useReservationStore, useFlightStore, useUserStore),

    flightSelectItems() {
      return this.flightStore.flights.map((flight) => ({
        title: flight.title,
        value: flight.id_flight,
      }));
    },
  },

  methods: {
    async create() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.reservationStore.create(
        this.userStore.user.id_user,
        this.selectedFlight,
        this.description
      );

      if (!this.reservationStore.error) {
        this.$router.push(
          this.reservationStore.afterCreateRoute ?? { name: "MyReservations" }
        );
        this.reservationStore.setAfterCreateRoute(null);
      }
    },
  },
};
</script>

<style scoped></style>
