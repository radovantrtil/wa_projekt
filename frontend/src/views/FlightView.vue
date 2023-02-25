<template>
  <h1 class="d-flex align-center mb-4">
    Flights
    <v-spacer />
    <div v-if="userStore.user.role === 3">
      <v-btn rounded="pill" :to="{ name: 'newFlight' }" color="#2699FF"
        ><v-icon>mdi-plus</v-icon> Create new flight</v-btn
      >
    </div>
  </h1>

  <error
    v-if="flightStore.error"
    :text="flightStore.error"
    @hide="flightStore.clearError()"
  ></error>
  <v-progress-circular
    v-if="flightStore.isLoading"
    color="primary"
    indeterminate
    size="100"
    width="10"
    class="ma-5"
  />
  <div v-else-if="flightStore.flights.length === 0">No flights.</div>
  <div v-else>
    <v-row>
      <v-col
        cols="4"
        v-for="flight in flightStore.flights"
        :key="flight.id_flight"
      >
        <v-card>
          <router-link
            :to="{
              name: 'flight-detail',
              params: { id: flight.id_flight },
            }"
          >
            <v-img
              src="https://static.scientificamerican.com/sciam/assets/Image/INLINE%20IMAGE%204%20-%2048954138962_9813a1461d_o.jpg"
            ></v-img>
          </router-link>

          <v-card-header>
            <v-card-header-text>
              <v-card-title>
                {{ flight.title }}
                <v-chip v-if="Math.random() > 0.5" color="green" class="ml-2"
                  >New</v-chip
                >
                <v-chip v-if="Math.random() > 0.5" color="orange" class="ml-2"
                  >Top 5</v-chip
                >
              </v-card-title>
            </v-card-header-text>
          </v-card-header>

          <v-card-text>
            {{
              flight.information.length > 30
                ? flight.information.substr(0, 30) + "..."
                : flight.information
            }}
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              :to="{
                name: 'flight-detail',
                params: { id: flight.id_flight },
              }"
              >Show</v-btn
            >

            <v-btn
              v-if="userStore.user.role === 3"
              color="primary"
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
              color="grey"
              icon="mdi-delete"
              @click.prevent="flightStore.delete(flight.id_flight)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useFlightStore } from "../stores/FlightStore";
import { mapStores } from "pinia/dist/pinia";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";

export default {
  name: "Flights",

  components: {
    Error,
  },

  data() {
    return {};
  },

  created() {
    this.flightStore.loadAll();
    this.flightStore.loadAllReservationsCount();
  },

  computed: {
    ...mapStores(useFlightStore, useUserStore),
  },

  methods: {},
};
</script>

<style scoped></style>
