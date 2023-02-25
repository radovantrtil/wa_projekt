import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    reservations: [],
    isLoading: true,
    isDeleting: false,
    error: null,
    afterCreateRoute: null,
  }),

  getters: {
    getById: (state) => (id_reservation) =>
      state.reservations.find((a) => a.id_reservation === id_reservation),
  },

  actions: {
    async loadAll() {
      try {
        this.isLoading = true;
        const response = await axios.get(config.backendUrl + "/reservations");
        this.reservations = response.data;
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download reservations!";
      }
    },

    async loadById(id_reservation) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          config.backendUrl + "/reservations/" + id_reservation
        );
        this.addOrUpdateInStore(id_reservation, response.data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download reservation!" + e;
      }
    },

    async create(users_id, flights_id, description) {
      try {
        this.isLoading = true;
        const data = {
          users_id,
          flights_id,
          description,
        };
        this.reservations.push(data);
        // ... try, start loading
        await axios.post(config.backendUrl + "/reservations", data);
        // ... push to this.articles, stop loading, catch error
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot create new reservation " + e;
      }
    },
    async updateReservation(description, users_id, flights_id) {
      try {
        this.isLoading = true;
        const data = {
          description,
          users_id,
          flights_id,
        };
        this.addOrUpdateInStore(id_reservation, data);
        await axios.put(
          `${config.backendUrl}/reservations/${id_reservation}`,
          data
        );
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Could not update reservation " + e;
      }
    },

    async delete(id_reservation) {
      try {
        this.isDeleting = id_reservation;

        // delete on server
        await axios.delete(
          `${config.backendUrl}/reservations/${id_reservation}`
        );

        // delete locally
        const index = this.reservations.findIndex(
          (a) => a.id_reservation === id_reservation
        );
        this.reservations.splice(index, 1);

        this.error = null;
        this.isDeleting = false;
      } catch {
        this.error = "Cannot delete reservation!";
      }
    },

    /**
     * If no article with given ID exists, pushes it as a new item to the array.
     * Otherwise, the old article with given ID is replaced by the new one.
     * This method updates only the local state, no request is made to the server.
     * @param id Number
     * @param article Object
     */
    addOrUpdateInStore(id_reservation, reservation) {
      const index = this.reservations.findIndex(
        (a) => a.id_reservation === id_reservation
      );
      if (index !== -1) {
        this.reservations[index] = reservation;
      } else {
        this.reservations.push(reservation);
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
