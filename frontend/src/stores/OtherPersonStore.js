import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useOtherPersonStore = defineStore("otherPerson", {
  state: () => ({
    otherPersons: [],
    isLoading: true,
    isDeleting: false,
    error: null,
    afterCreateRoute: null,
  }),

  getters: {
    getById: (state) => (id_otherPerson) =>
      state.otherPersons.find((a) => a.id_otherPerson === id_otherPerson),
  },

  actions: {
    async loadAll() {
      try {
        this.isLoading = true;
        const response = await axios.get(config.backendUrl + "/otherpersons");
        this.otherPersons = response.data;
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download other persons!";
      }
    },

    async loadById(id_otherPerson) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          config.backendUrl + "/otherpersons/" + id_otherPerson
        );
        this.addOrUpdateInStore(id_otherPerson, response.data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download other person!" + e;
      }
    },

    async create(firstname, lastname, reservetion_id) {
      try {
        this.isLoading = true;
        const data = {
          firstname,
          lastname,
          reservetion_id,
        };
        this.otherPersons.push(data);
        // ... try, start loading
        await axios.post(config.backendUrl + "/otherpersons", data);
        // ... push to this.articles, stop loading, catch error
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot create new participant " + e;
      }
    },
    async updateReservation(firstname, lastname, reservetion_id) {
      try {
        this.isLoading = true;
        const data = {
          firstname,
          lastname,
          reservetion_id,
        };
        this.addOrUpdateInStore(id_otherPerson, data);
        await axios.put(
          `${config.backendUrl}/otherpersons/${id_otherPerson}`,
          data
        );
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Could not update participant " + e;
      }
    },

    async delete(id_otherPerson) {
      try {
        this.isDeleting = id_otherPerson;

        // delete on server
        await axios.delete(
          `${config.backendUrl}/otherpersons/${id_otherPerson}`
        );

        // delete locally
        const index = this.otherPersons.findIndex(
          (a) => a.id_otherPerson === id_otherPerson
        );
        this.otherPersons.splice(index, 1);

        this.error = null;
        this.isDeleting = false;
      } catch (e) {
        this.error = "Cannot delete participant! " + e;
      }
    },

    /**
     * If no article with given ID exists, pushes it as a new item to the array.
     * Otherwise, the old article with given ID is replaced by the new one.
     * This method updates only the local state, no request is made to the server.
     * @param id Number
     * @param article Object
     */
    addOrUpdateInStore(id_otherPerson, participant) {
      const index = this.otherPersons.findIndex(
        (a) => a.id_otherPerson === id_otherPerson
      );
      if (index !== -1) {
        this.otherPersons[index] = participant;
      } else {
        this.otherPersons.push(participant);
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
