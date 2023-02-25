<template>
  <error
    v-if="flightStore.error"
    :text="flightStore.error"
    @hide="flightStore.clearError()"
  ></error>

  <div v-if="flightStore.isLoading">Trying to edit flight...</div>
  <div v-else>
    <h1 class="d-flex align-center mb-4">
      Edit flight
      <v-spacer />
    </h1>

    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="title"
              label="Title"
              required
              color="deep-purple"
              :rules="titleRules"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="datetime"
              :rules="dateRules"
              label="Date and time"
              type="datetime-local"
              suffix="CET"
              required
              color="deep-purple"
              :min="nowDate"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model.number="capacity"
              label="Capacity"
              :rules="capacityRules"
              type="number"
              color="deep-purple"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              v-model="information"
              auto-grow
              filled
              color="deep-purple"
              label="Information"
              rows="1"
              required
              :rules="infoRules"
            ></v-textarea>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
            <v-btn x-large block color="success" @click="updateFlight()"
              >Edit</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useFlightStore } from "../stores/FlightStore";
import Error from "../components/Error.vue";

export default {
  name: "EditFlight",

  components: {
    Error,
  },

  data() {
    return {
      nowDate: new Date().toISOString().slice(0, 10),
      datetime: new Date(),
      formValid: true,
      title: "",
      information: "",
      capacity: 0,
      titleRules: [
        (v) => !!v || "Username is required",
        (v) => (v && v.length >= 3) || "Title must be at least 3 characters",
      ],
      infoRules: [
        (v) => !!v || "Information is required",
        (v) =>
          (v && v.length >= 10) || "Information must be at least 10 characters",
      ],
      dateRules: [
        (v) => !!v || "Date is required",
        (v) => (v && v > this.nowDate) || "Date and time must be in the future",
      ],
      capacityRules: [
        (v) => !!v || "Capacity is required",
        (v) => (v && v >= 0) || "Capacity must be larger or equal to 0",
        (v) => (v && v <= 200) || "Capacity must be equal or less than 200",
      ],
    };
  },

  computed: {
    ...mapStores(useFlightStore),
    id() {
      return parseInt(this.$route.params.id);
    },
    flight() {
      return this.flightStore.getById(this.id);
    },
  },
  methods: {
    async updateFlight() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.flightStore.updateFlight(
        this.title,
        this.datetime,
        this.capacity,
        this.information,
        this.id
      );

      if (!this.flightStore.error) {
        this.$router.push(
          this.flightStore.afterCreateRoute ?? { name: "flights" }
        );
        this.userStore.setAfterCreateRoute(null);
      }
    },
  },
  created() {
    this.title = this.flight.title;
    this.information = this.flight.information;
    this.capacity = parseInt(this.flight.capacity);
    this.datetime = this.flight.datetime;
  },
};
</script>

<style scoped></style>
