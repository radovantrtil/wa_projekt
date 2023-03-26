import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import FlightView from "../views/FlightView.vue";
import FlightDetailView from "../views/FlightDetailView.vue";
import AuthSection from "../AuthSection.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import NewFlightView from "../views/NewFlightView.vue";
import EditFlightView from "../views/EditFlightView.vue";
import ReservationsView from "../views/ReservationsView.vue";
import NewReservationView from "../views/NewReservationView.vue";
import NewParticipantView from "../views/NewParticipantView.vue";
import MyReservationsView from "../views/MyReservationsView.vue";
import MyNewReservationView from "../views/MyNewReservationView.vue";
import NotificationsView from "../views/NotificationsView.vue";
import NewNotificationView from "../views/NewNotificationView.vue";
import { useUserStore } from "../stores/UserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },

    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthSection,
      beforeEnter: checkAuthentication,
      children: [
        {
          path: "/flights",
          name: "flights",
          component: FlightView,
        },

        {
          path: "/flights/:id/show",
          name: "flight-detail",
          component: FlightDetailView,
        },
        {
          path: "/flights/:id/edit",
          name: "flight-edit",
          beforeEnter: checkTechnic,
          component: EditFlightView,
        },
        {
          path: "/flights/newFlight",
          name: "newFlight",
          beforeEnter: checkTechnic,
          component: NewFlightView,
        },
        {
          path: "/reservations",
          name: "reservations",
          beforeEnter: checkSecretary,
          component: ReservationsView,
        },
        {
          path: "/reservations/newReservation",
          name: "newReservation",
          beforeEnter: checkSecretary,
          component: NewReservationView,
        },
        {
          path: "/reservations/:id/newParticipant",
          name: "newParticipant",
          component: NewParticipantView,
        },
        {
          path: "/myreservations",
          name: "MyReservations",
          component: MyReservationsView,
        },
        {
          path: "/myreservations/newReservation",
          name: "MyNewReservation",
          component: MyNewReservationView,
        },
        {
          path: "/notifications",
          name: "Notifications",
          beforeEnter: checkTechnicOrSecretary,
          component: NotificationsView,
        },
        {
          path: "/newnotification",
          name: "NewNotification",
          beforeEnter: checkTechnicOrSecretary,
          component: NewNotificationView,
        },
      ],
    },
  ],
});

function checkAuthentication(to, from, next) {
  const store = useUserStore();
  if (store.isAuthenticated) {
    next();
  } else {
    store.setLoginMessage(
      "Please, log in to access the private section of the web."
    );
    store.setAfterLoginRoute(to);
    next({ name: "login" });
  }
}

function checkSecretary(to, from, next) {
  const store = useUserStore();
  if (store.user.role === 2) {
    next();
  } else {
    store.logout();
    store.setLoginMessage(
      "Please, log in as secretary to access the private section of the web."
    );
    store.setAfterLoginRoute(to);
    next({ name: "login" });
  }
}

function checkTechnic(to, from, next) {
  const store = useUserStore();
  if (store.user.role === 3) {
    next();
  } else {
    store.logout();
    store.setLoginMessage(
      "Please, log in as technic to access the private section of the web."
    );
    store.setAfterLoginRoute(to);
    next({ name: "login" });
  }
}

function checkTechnicOrSecretary(to, from, next) {
  const store = useUserStore();
  if (store.user.role === 3 || store.user.role === 2) {
    next();
  } else {
    store.logout();
    store.setLoginMessage(
      "Please, log in as technic or secretary to access the private section of the web."
    );
    store.setAfterLoginRoute(to);
    next({ name: "login" });
  }
}
export default router;
