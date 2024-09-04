import { defineStore } from "pinia";
import axios from "~/plugins/axios";

const $axios = axios().provide.axios;

export const useProfileStore = defineStore("profile", {
  state: () => ({
    id: "",
    username: "",
    name: "",
    bio: "",
    image: "",
    post: null,
    posts: null,
    followers: null,
    following: null,
    allLikes: 0,
  }),
  actions: {
    async getProfile(username) {
      this.resetUser();
      const response = await $axios.get(`/api/profiles/${username}`);

      this.$state.id = response.data.user[0].id;
      this.$state.username = response.data.user[0].username;
      this.$state.name = response.data.user[0].name;
      this.$state.bio = response.data.user[0].bio;
      this.$state.image = response.data.user[0].image;

      this.$state.posts = response.data.posts;

      this.$state.followers = response.data.followers;
      this.$state.following = response.data.following;

      this.allLikesCount();
    },

    allLikesCount() {
      this.allLikes = 0;

      for (let i = 0; i < this.posts.length; i++) {
        const post = this.posts[i];

        for (let j = 0; j < post.likes.length; j++) {
          this.allLikes++;
        }
      }
    },

    resetUser() {
      this.$state.id = "";
      this.$state.username = "";
      this.$state.name = "";
      this.$state.bio = "";
      this.$state.image = "";
      this.$state.posts = null;
      this.$state.followers = null;
      this.$state.following = null;
    },
  },
  persist: true,
});
