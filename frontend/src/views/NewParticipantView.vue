<template>
  <error
    v-if="otherPersonStore.error"
    :text="otherPersonStore.error"
    @hide="otherPersonStore.clearError()"
  ></error>

  <div v-if="otherPersonStore.isLoading">Trying to add new participant...</div>
  <div v-else>
    <v-btn
      v-if="userStore.user.role === 2"
      color="secondary"
      :to="{ name: 'reservations' }"
      ><v-icon>mdi-arrow-left</v-icon> Back to reservations</v-btn
    >
    <v-btn v-else color="secondary" :to="{ name: 'MyReservations' }"
      ><v-icon>mdi-arrow-left</v-icon> Back to reservations</v-btn
    >
  </div>

  <h1 class="d-flex align-center mb-4">
    Add new participant
    <v-spacer />
  </h1>

  <v-form ref="form" v-model="formValid" lazy-validation>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            variant="outlined"
            v-model="firstname"
            label="Firstname"
            required
            color="deep-purple"
            :rules="name"
          ></v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            variant="outlined"
            v-model="lastname"
            label="Lastname"
            required
            color="deep-purple"
            :rules="name"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn x-large block color="success" @click="create()"
            >Add participant</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <v-card v-for="partic in participantSelectItems" :key="partic.value">
    <v-card-title>{{ partic.title }}</v-card-title>
    <v-card-actions>
      <v-btn
        v-if="otherPersonStore.isDeleting !== partic.value"
        color="red"
        @click.prevent="otherPersonStore.delete(partic.value)"
        ><v-icon> mdi-delete</v-icon>Delete</v-btn
      >
    </v-card-actions>
  </v-card>

  <!--
    <v-card max-width="300">
      <v-list :items="participantSelectItems"></v-list>
    </v-card>-->
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useOtherPersonStore } from "../stores/OtherPersonStore";
import { useUserStore } from "../stores/UserStore";
import Error from "../components/Error.vue";
export default {
  name: "NewParticipant",

  components: {
    Error,
  },

  data() {
    return {
      formValid: true,
      firstname: "",
      lastname: "",
      name: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 3) || "Name must be at least 3 characters",
      ],
    };
  },
  created() {
    this.otherPersonStore.loadAll();
  },

  computed: {
    ...mapStores(useOtherPersonStore, useUserStore),
    id() {
      return parseInt(this.$route.params.id);
    },
    participantSelectItems() {
      return this.otherPersonStore.otherPersons
        .filter((participant) => participant.reservetion_id === this.id)
        .map((participant) => ({
          title: participant.firstname + " " + participant.lastname,
          value: participant.id_otherPerson,
        }));
    },
  },

  methods: {
    resetInput() {
      this.firstname = "";
      this.lastname = "";
    },
    async create() {
      await this.$refs.form.validate();
      if (!this.formValid) return;

      await this.otherPersonStore.create(
        this.firstname,
        this.lastname,
        this.id
      );

      if (!this.otherPersonStore.error) {
        this.$router.push(
          this.otherPersonStore.afterCreateRoute ?? { name: "newParticipant" }
        );
        this.otherPersonStore.setAfterCreateRoute(null);
      }
      this.resetInput();
    },
  },
};
</script>

<style scoped></style>
