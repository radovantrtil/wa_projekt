import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    isLoading: true,
    isDeleting: false,
    error: null,
    afterCreateRoute: null,
  }),
  actions: {
    async loadAll() {
      try {
        this.isLoading = true;
        const response = await axios.get(config.backendUrl + "/notifications");
        this.notifications = response.data;
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download notofications! " + e;
      }
    },
    async loadById(id_notification) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          config.backendUrl + "/notifications/" + id_notification
        );
        this.addOrUpdateInStore(id_notification, response.data);
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot download notifications!" + e;
      }
    },

    async create(type, description) {
      try {
        this.isLoading = true;
        const data = {
          description,
          type,
        };
        this.notifications.push(data);
        // ... try, start loading
        await axios.post(config.backendUrl + "/notifications", data);
        // ... push to this.articles, stop loading, catch error
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Cannot create new notification " + e;
      }
    },
    async updateNotification(type, description, id_notification) {
      try {
        this.isLoading = true;
        const data = {
          type,
          description,
        };
        this.addOrUpdateInStore(id_notification, data);
        await axios.put(
          `${config.backendUrl}/notifications/${id_notification}`,
          data
        );
        this.error = null;
        this.isLoading = false;
      } catch (e) {
        this.error = "Could not update notification " + e;
      }
    },

    async delete(id_notification) {
      try {
        this.isDeleting = id_notification;

        // delete on server
        await axios.delete(
          `${config.backendUrl}/notifications/${id_notification}`
        );

        // delete locally
        const index = this.notifications.findIndex(
          (a) => a.id_notification === id_notification
        );
        this.notifications.splice(index, 1);

        this.error = null;
        this.isDeleting = false;
      } catch {
        this.error = "Cannot delete notification!";
      }
    },

    addOrUpdateInStore(id_notification, notification) {
      const index = this.notifications.findIndex(
        (a) => a.id_notification === id_notification
      );
      if (index !== -1) {
        this.notifications[index] = notification;
      } else {
        this.notifications.push(notification);
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
