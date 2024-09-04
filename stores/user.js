import { defineStore } from "pinia";
import axios from "~/plugins/axios";
import { useGeneralStore } from "./general";
import { useProfileStore } from "./profile";

const $axios = axios().provide.axios;

export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    username: "",
    name: "",
    bio: "",
    image: "",
  }),
  actions: {
    async getTokens() {
      await $axios.get("/sanctum/csrf-cookie");
    },

    async login(email, password) {
      await $axios.post("/login", {
        email,
        password,
      });
    },

    async register(name, email, password, confirmPassword) {
      await $axios.post("/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
    },

    async getUser() {
      const response = await $axios.get("/api/logged-in-user");

      this.$state.id = response.data[0].id;
      this.$state.username = response.data[0].username;
      this.$state.name = response.data[0].name;
      this.$state.bio = response.data[0].bio;
      this.$state.image = response.data[0].image;
    },

    async updateUserImage(data) {
      return await $axios.post("/api/update-user-image", data);
    },

    async updateUser(username, name, bio) {
      return await $axios.patch("/api/update-user", {
        username,
        name,
        bio,
      });
    },

    async createPost(data) {
      return await $axios.post("/api/posts", data);
    },

    async deletePost(post) {
      return await $axios.delete(`/api/posts/${post.id}`);
    },

    async createComment(post, comment) {
      const response = await $axios.post("/api/comments", {
        post_id: post.id,
        comment,
      });

      if (response.status === 200) {
        await this.updateComments(post);
      }
    },

    async deleteComment(post, commentId) {
      const response = await $axios.delete(`/api/comments/${commentId}`, {
        post_id: post.id,
      });

      if (response.status === 200) {
        await this.updateComments(post);
      }
    },

    async updateComments(post) {
      const response = await $axios.get(`/api/profiles/${post.user.username}`);

      for (const updatePost of response.data.posts) {
        if (post.id === updatePost.id) {
          useGeneralStore().selectedPost.comments = updatePost.comments;
        }
      }
    },

    async likePost(post, isPostPage) {
      const response = await $axios.post("/api/likes", {
        post_id: post.id,
      });

      let singlePost = null;

      singlePost = isPostPage
        ? post
        : useGeneralStore().posts.find((p) => p.id === post.id);
      singlePost.likes.push(response.data.like);
    },

    async unlikePost(post, isPostPage) {
      let deleteLike = null;
      let singlePost = null;

      singlePost = isPostPage
        ? post
        : useGeneralStore().posts.find((p) => p.id === post.id);

      singlePost.likes.forEach((like) => {
        if (like.user_id === this.$state.id) {
          deleteLike = like;
        }
      });

      const response = await $axios.delete(`/api/likes/${deleteLike.id}`);

      for (let i = 0; i < singlePost.likes.length; i++) {
        const like = singlePost.likes[i];
        if (like.id === response.data.like.id) {
          singlePost.likes.splice(i, 1);
        }
      }
    },

    async followUser(username) {
      const response = await $axios.post("/api/follows", {
        username,
      });

      useProfileStore().followers.push(response.data.follow.followers);
    },

    async unfollowUser(username) {
      let deleteFollow = null;

      useProfileStore().followers.forEach((follow) => {
        if (follow.id === this.$state.id) {
          deleteFollow = follow;
        }
      });

      await $axios.delete(`/api/follows`, {
        data: {
          user_followed: deleteFollow.username,
          user_following: username,
        },
      });

      useProfileStore().followers.splice(
        useProfileStore().followers.indexOf(deleteFollow),
        1
      );
    },

    async logout() {
      await $axios.post("/logout");
      this.resetUser();
    },

    resetUser() {
      this.$state.id = "";
      this.$state.username = "";
      this.$state.name = "";
      this.$state.bio = "";
      this.$state.image = "";
    },
  },
  persist: true,
});
