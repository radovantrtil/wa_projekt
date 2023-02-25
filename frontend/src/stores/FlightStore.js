import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useFlightStore = defineStore("flight", {
  state: () => ({
    flights: [],
    isLoading: true,
    isDeleting: false,
    error: null,
    afterCreateRoute: null,
    reservationsCounts: [],
  }),

  getters: {
    getById: (state) => (id_flight) =>
      state.flights.find((a) => a.id_flight === id_flight),
    getCount: (state) => (id_flight) =>
      state.reservationsCounts.find((a) => a.id_flight === id_flight),
  },

  actions: {
    async loadAllReservationsCount() {
      try {
        this.isLoading = true;
        const response = await axios.get(config.backendUrl + "/flights/counts");
        this.reservationsCounts = response.data;
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download counts of reservations on flights! " + e;
      }
    },
    async loadAll() {
      try {
        this.isLoading = true;
        const response = await axios.get(config.backendUrl + "/flights");
        this.flights = response.data;
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download flights! " + e;
      }
    },
    async getReservationsCount(id_flight) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          config.backendUrl + "/flights/" + id_flight + "/count"
        );
        this.addOrUpdateReservationsCount(id_flight, response.data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot get reservations count! " + e;
      }
    },
    addOrUpdateReservationsCount(id_flight, resCount) {
      const index = this.reservationsCounts.findIndex(
        (a) => a.id_flight === id_flight
      );
      if (index !== -1) {
        this.reservationsCounts[index] = resCount;
      } else {
        this.reservationsCounts.push(resCount);
      }
    },
    async loadById(id_flight) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          config.backendUrl + "/flights/" + id_flight
        );
        this.addOrUpdateInStore(id_flight, response.data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download flights!" + e;
      }
    },

    async create(title, datetime, capacity, information) {
      try {
        this.isLoading = true;
        const data = {
          title,
          datetime,
          capacity,
          information,
        };
        this.flights.push(data);
        // ... try, start loading
        await axios.post(config.backendUrl + "/flights", data);
        // ... push to this.articles, stop loading, catch error
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot create new flight " + e;
      }
    },
    async updateFlight(title, datetime, capacity, information, id_flight) {
      try {
        this.isLoading = true;
        const data = {
          title,
          datetime,
          capacity,
          information,
        };
        this.addOrUpdateInStore(id_flight, data);
        await axios.put(`${config.backendUrl}/flights/${id_flight}`, data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Could not update flight " + e;
      }
    },

    async delete(id_flight) {
      try {
        this.isDeleting = id_flight;

        // delete on server
        await axios.delete(`${config.backendUrl}/flights/${id_flight}`);

        // delete locally
        const index = this.flights.findIndex((a) => a.id_flight === id_flight);
        this.flights.splice(index, 1);

        this.error = null;
        this.isDeleting = false;
      } catch {
        this.error = "Cannot delete flight!";
      }
    },

    /**
     * If no article with given ID exists, pushes it as a new item to the array.
     * Otherwise, the old article with given ID is replaced by the new one.
     * This method updates only the local state, no request is made to the server.
     * @param id Number
     * @param article Object
     */
    addOrUpdateInStore(id_flight, flight) {
      const index = this.flights.findIndex((a) => a.id_flight === id_flight);
      if (index !== -1) {
        this.flights[index] = flight;
      } else {
        this.flights.push(flight);
      }
    },
    setAfterCreateRoute(route) {
      this.afterCreateRoute = route;
    },

    clearError() {
      this.error = null;
    },
  },
});
