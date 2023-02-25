<template>
  <error
    v-if="notificationStore.error"
    :text="notificationStore.error"
    @hide="notificationStore.clearError()"
  ></error>

  <div v-if="notificationStore.isLoading">
    Trying to create new reservation...
  </div>
  <div v-else>
    <h1 class="d-flex align-center mb-4">
      Create new notification
      <v-spacer />
    </h1>

    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-container>
        <v-row>
          <v-col>
            Choose type:
            <v-autocomplete
              label="Choose type"
              :items="items"
              v-model="selectedType"
              required
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-textarea
              variant="outlined"
              v-model="description"
              :rules="descRules"
              auto-grow
              filled
              color="deep-purple"
              label="Description"
              rows="1"
            ></v-textarea>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
            <v-btn x-large block color="success" @click="create()"
              >Create</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useNotificationStore } from "../stores/NotificationStore";
import Error from "../components/Error.vue";
export default {
  name: "NewNotification",

  components: {
    Error,
  },

  data() {
    return {
      description: "",
      type: "",
      items: ["success", "info", "warning"],
      formValid: true,
      selectedType: null,
      descRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length >= 10) || "Description must be at least 10 characters",
      ],
      typeRules: [
        (v) => !!v || "Description is required",
        (v) =>
          (v && v.length >= 4) || "Description must be at least 4 characters",
      ],
    };
  },
  computed: {
    ...mapStores(useNotificationStore),
  },

  methods: {
    async create() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.notificationStore.create(this.selectedType, this.description);

      if (!this.notificationStore.error) {
        this.$router.push(
          this.notificationStore.afterCreateRoute ?? { name: "Notifications" }
        );
        this.notificationStore.setAfterCreateRoute(null);
      }
    },
  },
};
</script>

<style scoped></style>
