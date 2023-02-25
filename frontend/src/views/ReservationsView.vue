<template>
  <h1 class="d-flex align-center mb-4">
    Reservations
    <v-spacer />
    <v-btn rounded="pill" :to="{ name: 'newReservation' }" color="#2699FF"
      ><v-icon>mdi-plus</v-icon> Create new reservation</v-btn
    >
  </h1>

  <error
    v-if="reservationStore.error"
    :text="reservationStore.error"
    @hide="reservationStore.clearError()"
  ></error>
  <v-progress-circular
    v-if="reservationStore.isLoading"
    color="primary"
    indeterminate
    size="100"
    width="10"
    class="ma-5"
  />
  <div v-else-if="reservationStore.reservations.length === 0">
    No reservations.
  </div>
  <div v-else>
    <v-row>
      <v-col
        cols="4"
        v-for="reservation in reservationStore.reservations"
        :key="reservation.id_reservation"
      >
        <v-card>
          <v-card-header>
            <v-card-header-text>
              <v-card-title>
                <router-link
                  :to="{
                    name: 'flight-detail',
                    params: { id: reservation.flights_id },
                  }"
                >
                  {{ reservation.title }}</router-link
                >
              </v-card-title>
              <v-card-subtitle
                >departure: {{ reservation.datetime }}</v-card-subtitle
              >
            </v-card-header-text>
          </v-card-header>
          <v-card-text
            ><h3>
              customer: {{ reservation.firstname }} {{ reservation.lastname }}
            </h3></v-card-text
          >
          <v-card-text
            >Participants:
            <div
              v-for="participant in otherPersonStore.otherPersons"
              :key="participant.id_otherPerson"
            >
              <div
                v-if="participant.reservetion_id == reservation.id_reservation"
              >
                 {{ participant.firstname }} {{ participant.lastname }}
              </div>
            </div>
          </v-card-text>
          <v-card-text
            >Description:
            {{
              reservation.description.length > 30
                ? reservation.description.substr(0, 30) + "..."
                : reservation.description
            }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              :to="{
                name: 'newParticipant',
                params: { id: reservation.id_reservation },
              }"
              >Edit participants</v-btn
            >
            <v-btn
              v-if="reservationStore.isDeleting !== reservation.id_reservation"
              color="red"
              @click.prevent="
                reservationStore.delete(reservation.id_reservation)
              "
              ><v-icon> mdi-delete</v-icon>Cancel</v-btn
            >
          </v-card-actions>

          <!--
          <v-card-actions>
            <v-btn
              color="primary"
              :to="{
                name: 'reservation-detail',
                params: { id: reservation.id_reservation },
              }"
              >Show</v-btn
            >
            <v-btn
              color="primary"
              :to="{
                name: 'reservation-edit',
                params: { id: reservation.id_reservation },
              }"
              >Edit</v-btn
            >

            <v-spacer />
            <v-btn
              v-if="reservationStore.isDeleting !== reservation.id_reservation"
              color="grey"
              icon="mdi-delete"
              @click.prevent="
                reservationStore.delete(reservation.id_reservation)
              "
            ></v-btn>
            <v-progress-circular
              v-else
              color="red"
              indeterminate
            ></v-progress-circular>
          </v-card-actions>
-->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useFlightStore } from "../stores/FlightStore";
import { useReservationStore } from "../stores/ReservationStore";
import { useOtherPersonStore } from "../stores/OtherPersonStore";
import { mapStores } from "pinia/dist/pinia";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";

export default {
  name: "Reservations",

  components: {
    Error,
  },

  data() {
    return {};
  },

  created() {
    this.reservationStore.loadAll();
    this.otherPersonStore.loadAll();
  },

  computed: {
    ...mapStores(
      useReservationStore,
      useUserStore,
      useFlightStore,
      useOtherPersonStore
    ),
  },

  methods: {},
};
</script>

<style scoped></style>
