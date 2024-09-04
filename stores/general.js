import { defineStore } from "pinia";
import { useUserStore } from "./user";
import axios from "~/plugins/axios";

const $axios = axios().provide.axios;

export const useGeneralStore = defineStore("general", {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: "/",
    posts: null,
    suggested: null,
    following: null,
  }),
  actions: {
    bodySwitch(val) {
      document.body.style.overflow = val ? "hidden" : "visible";
    },

    allLowerCaseNoCaps(str) {
      return str.split(" ").join("").toLowerCase();
    },

    setBackUrl(url) {
      this.isBackUrl = url;
    },

    async hasSessionExpired() {
      await $axios.interceptors.response.use(
        (response) => {
          // Call was successful, continue.
          return response;
        },
        (error) => {
          switch (error.response.status) {
            case 401: // Unauthorized
            case 419: // Session expired
            case 503: // Service unavailable
              // Bounce the user to the login screen with a redirect back.
              useUserStore().resetUser();
              window.location.href = "/";
              break;
            case 500: // Internal server error
              alert("Oops, something went wrong! The team has been notified.");
              break;
            default:
              // Allow individual requests to handle other errors.
              return Promise.reject(error);
          }
        }
      );
    },

    async getPostById(id) {
      const response = await $axios.get(`/api/posts/${id}`);

      this.$state.selectedPost = response.data.post[0];
      this.$state.ids = response.data.ids;
    },

    async getRandomUsers(type) {
      const response = await $axios.get(`/api/get-random-users`);

      if (type === "suggested") {
        this.suggested = response.data.suggested;
      }

      if (type === "following") {
        this.following = response.data.following;
      }
    },

    updateSideMenuImage(array, user) {
      for (const res of array) {
        if (res.username == user.username) {
          res.image = user.image;
        }
      }
    },

    async getAllUsersAndPosts() {
      const response = await $axios.get(`/api/home`);
      this.posts = response.data;
    },
  },
  persist: true,
});
