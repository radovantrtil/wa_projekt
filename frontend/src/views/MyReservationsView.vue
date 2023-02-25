<template>
  <h1 class="d-flex align-center mb-4">
    My reservations
    <v-spacer />
    <v-btn rounded="pill" :to="{ name: 'MyNewReservation' }" color="#2699FF"
      ><v-icon>mdi-plus</v-icon> Create new reservation</v-btn
    >
  </h1>

  <error
    v-if="reservationStore.error"
    :text="reservationStore.error"
    @hide="reservationStore.clearError()"
  ></error>
  <div v-else-if="reservationStore.reservations.length === 0">
    No reservations.
  </div>
  <div v-else>
    <v-row>
      <div
        v-for="reservation in reservationStore.reservations"
        :key="reservation.id_reservation"
      >
        <v-col v-if="reservation.login === userStore.user.login">
          <v-card>
            <v-card-header>
              <v-card-header-text>
                <v-spacer></v-spacer>

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
                customer: {{ reservation.firstname }}
                {{ reservation.lastname }}
              </h3></v-card-text
            >
            <v-card-text
              >Participants:
              <div
                v-for="participant in otherPersonStore.otherPersons"
                :key="participant.id_otherPerson"
              >
                <div
                  v-if="
                    participant.reservetion_id == reservation.id_reservation
                  "
                >
                  <strong
                    >{{ participant.firstname }}
                    {{ participant.lastname }}</strong
                  >
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
                v-if="
                  reservationStore.isDeleting !== reservation.id_reservation
                "
                color="red"
                @click.prevent="
                  reservationStore.delete(reservation.id_reservation)
                "
                ><v-icon> mdi-delete</v-icon>Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </div>
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
  name: "MyReservations",

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
