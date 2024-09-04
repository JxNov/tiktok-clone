<template>
  <MainLayout>
    <div
      v-if="$profileStore.name"
      class="pt-[90px] 2xl:pl-[225px] lg:pl-[200px] lg:pr-0 pr-2 w-[calc(100%-90px)] max-w-[1800px] 2xl:mx-auto"
    >
      <div class="flex w-[calc(100vw-340px)]">
        <img
          class="max-w-[120px] rounded-full"
          :src="$profileStore.image"
          alt=""
        />

        <div class="ml-5 w-full">
          <div class="text-[30px] font-bold truncate">
            {{ $profileStore.username }}
          </div>
          <div class="text-[18px] truncate">
            {{ $profileStore.name }}
          </div>

          <button
            v-if="$profileStore.username === $userStore.username"
            @click="($event) => ($generalStore.isEditProfileOpen = true)"
            class="flex items-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
          >
            <Icon class="mt-0.5 mr-1" size="18" name="mdi:pencil" />
            <span>Edit Profile</span>
          </button>

          <button
            v-else
            @click="
              ($event) =>
                isFollowing
                  ? unfollowUser($profileStore.username)
                  : followUser($profileStore.username)
            "
            class="flex items-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]"
          >
            {{ isFollowing ? "Unfollow" : "Follow" }}
          </button>
        </div>
      </div>

      <div class="flex items-center pt-4">
        <div class="mr-4">
          <span class="font-bold">
            {{
              $profileStore.following?.length > 0
                ? $profileStore.following.length
                : 0
            }}
          </span>
          <span class="text-gray-500 font-light text-[15px] pl-1.5">
            Following
          </span>
        </div>

        <div class="mr-4">
          <span class="font-bold">
            {{
              $profileStore.followers?.length > 0
                ? $profileStore.followers.length
                : 0
            }}
          </span>
          <span class="text-gray-500 font-light text-[15px] pl-1.5">
            Followers
          </span>
        </div>

        <div class="mr-4">
          <span class="font-bold">
            {{ allLikes }}
          </span>
          <span class="text-gray-500 font-light text-[15px] pl-1.5">
            Likes
          </span>
        </div>
      </div>

      <div
        class="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]"
      >
        {{ $profileStore.bio?.length > 0 ? $profileStore.bio : "No bio yet." }}
      </div>

      <div class="w-full flex items-center pt-4 border-b">
        <div
          class="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black"
        >
          Videos
        </div>

        <div
          class="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold flex items-center"
        >
          <Icon class="mb-0" name="material-symbols:lock-open" />
          <span class="pl-1">Liked</span>
        </div>
      </div>

      <div
        v-if="show"
        class="mt-4 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3"
      >
        <PostUser
          v-for="post in $profileStore.posts"
          :key="post.id"
          :post="post"
        />
      </div>

      <div v-if="$profileStore.posts.length === 0" class="w-full text-center">
        <span class="text-[17px] text-gray-500">No posts yet.</span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/MainLayout.vue";
import { storeToRefs } from "pinia";
const { $userStore, $profileStore, $generalStore } = useNuxtApp();
const { posts, allLikes } = storeToRefs($profileStore);

const route = useRoute();

const show = ref(false);

onMounted(async () => {
  try {
    await $profileStore.getProfile(route.params.username);
  } catch (error) {
    console.log(error);
  }
});

const isFollowing = computed(() => {
  const response = $profileStore.followers.find((follower) => {
    return follower.username === $userStore.username;
  });

  return response ? true : false;
});

const followUser = async (username) => {
  try {
    await $userStore.followUser(username);
  } catch (error) {
    console.log(error);
  }
};

const unfollowUser = async (username) => {
  try {
    await $userStore.unfollowUser(username);
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => posts.value,
  () => {
    setTimeout(() => {
      show.value = true;
    }, 300);
  }
);
</script>
