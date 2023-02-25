<template>
  <h1 class="d-flex align-center mb-4">
    Notifications
    <v-spacer />
    <v-btn rounded="pill" :to="{ name: 'NewNotification' }" color="#2699FF"
      ><v-icon>mdi-plus</v-icon> Create new notification</v-btn
    >
  </h1>

  <error
    v-if="notificationStore.error"
    :text="notificationStore.error"
    @hide="notificationStore.clearError()"
  ></error>
  <v-progress-circular
    v-if="notificationStore.isLoading"
    color="primary"
    indeterminate
    size="100"
    width="10"
    class="ma-5"
  />
  <div v-else-if="notificationStore.notifications.length === 0">
    No notifications.
  </div>
  <div v-else>
    <v-row>
      <v-col
        cols="4"
        v-for="notifi in notificationStore.notifications"
        :key="notifi.id_notification"
      >
        <v-card>
          <v-card-header>
            <v-card-header-text>
              <v-card-title>
                {{ notifi.type }}
              </v-card-title>
              <v-card-subtitle>type: {{ notifi.type }}</v-card-subtitle>
            </v-card-header-text>
          </v-card-header>

          <v-card-text
            >Description:
            {{
              notifi.description.length > 30
                ? notifi.description.substr(0, 30) + "..."
                : notifi.description
            }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="notificationStore.isDeleting !== notifi.id_notification"
              color="red"
              @click.prevent="notificationStore.delete(notifi.id_notification)"
              ><v-icon> mdi-delete</v-icon>Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNotificationStore } from "../stores/NotificationStore";
import { mapStores } from "pinia/dist/pinia";
import Error from "../components/Error.vue";

export default {
  name: "Notifications",

  components: {
    Error,
  },

  data() {
    return {};
  },

  created() {
    this.notificationStore.loadAll();
  },

  computed: {
    ...mapStores(useNotificationStore),
  },

  methods: {},
};
</script>

<style scoped></style>
