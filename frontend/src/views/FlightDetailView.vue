<template>
  <error
    v-if="flightStore.error"
    :text="flightStore.error"
    @hide="flightStore.clearError()"
  ></error>

  <div v-if="flightStore.isLoading">Loading...</div>
  <div v-else>
    <v-card>
      <v-card-title>
        <strong>{{ flight.title }}</strong></v-card-title
      >
      <v-card-subtitle
        >Departure: &nbsp;
        <strong>
          {{ flight.datetime }}
        </strong></v-card-subtitle
      >
      <v-card-text>
        Capacity:
        <strong>{{ reservationCount.pocet }}/{{ flight.capacity }}</strong
        ><br />
        Information: <strong>{{ flight.information }}</strong></v-card-text
      >
      <v-card-actions
        ><v-btn color="secondary" :to="{ name: 'flights' }"
          ><v-icon>mdi-arrow-left</v-icon> Back to flights</v-btn
        >

        <v-btn
          v-if="userStore.user.role === 3"
          color="warning"
          :to="{
            name: 'flight-edit',
            params: { id: flight.id_flight },
          }"
          >Edit</v-btn
        >

        <v-spacer />
        <v-btn
          v-if="
            userStore.user.role === 3 &&
            flightStore.isDeleting !== flight.id_flight
          "
          color="error"
          icon="mdi-delete"
          @click.prevent="flightStore.delete(flight.id_flight)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useFlightStore } from "../stores/FlightStore";
import { useUserStore } from "../stores/UserStore";
import Error from "../components/Error.vue";

export default {
  name: "FlightDetail",

  components: {
    Error,
  },

  created() {
    this.flightStore.loadById(this.id);
    this.flightStore.getReservationsCount(this.id);
  },

  computed: {
    ...mapStores(useFlightStore, useUserStore),

    id() {
      return parseInt(this.$route.params.id);
    },

    flight() {
      return this.flightStore.getById(this.id);
    },
    reservationCount() {
      return this.flightStore.getCount(this.id);
    },
  },
};
</script>

<style></style>
