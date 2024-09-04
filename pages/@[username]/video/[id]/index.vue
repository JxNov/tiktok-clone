<template>
  <div
    id="PostPage"
    class="fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto"
  >
    <div
      v-if="$generalStore.selectedPost"
      class="lg:w-[calc(100%-540px)] h-full relative"
    >
      <NuxtLink
        :to="$generalStore.isBackUrl"
        class="absolute flex items-center z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
      >
        <Icon name="material-symbols:close" style="color: #ffffff" size="27" />
      </NuxtLink>

      <div v-if="$generalStore.ids.length > 1">
        <button
          :disabled="!isLoaded"
          @click="($event) => loopThroughPostsUp()"
          class="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <Icon name="mdi:chevron-up" style="color: #ffffff" size="30" />
        </button>

        <button
          :disabled="!isLoaded"
          @click="($event) => loopThroughPostsDown()"
          class="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <Icon name="mdi:chevron-down" style="color: #ffffff" size="30" />
        </button>
      </div>

      <img
        class="absolute top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
        width="45"
        src="~/assets/images/tiktok-logo-small.png"
        alt=""
      />

      <video
        v-if="$generalStore.selectedPost.video"
        class="absolute object-cover w-full my-auto z-[-1] h-screen"
        :src="$generalStore.selectedPost.video"
      />

      <div
        v-if="!isLoaded"
        class="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[480px]"
      >
        <Icon
          class="animate-spin ml-1"
          name="mingcute:loading-line"
          style="color: #ffffff"
          size="40"
        />
      </div>

      <div class="bg-black bg-opacity-70 lg:min-w-[480px]">
        <video
          v-if="$generalStore.selectedPost.video"
          ref="video"
          loop
          muted
          class="h-screen mx-auto"
          :src="$generalStore.selectedPost.video"
        />
      </div>
    </div>

    <div
      id="InfoSection"
      v-if="$generalStore.selectedPost"
      class="lg:max-w-[550px] relative w-full h-full bg-white"
    >
      <div class="py-7" />

      <div class="flex items-center justify-between px-8">
        <div class="flex items-center">
          <NuxtLink :to="`/@${$generalStore.selectedPost.user.username}`">
            <img
              class="rounded-full lg:mx-0 mx-auto"
              width="40"
              :src="$generalStore.selectedPost.user.image"
            />
          </NuxtLink>

          <div class="ml-3 pt-0.5">
            <div class="text-[17px] font-semibold">
              {{ $generalStore.selectedPost.user.username }}
            </div>

            <div class="text-[13px] -mt-5 font-light">
              {{ $generalStore.selectedPost.user.name }}
              <span class="relative -top-[2px] text-[30px] pr-0.5">.</span>
              <span class="font-medium">
                {{ $generalStore.selectedPost.created_at }}
              </span>
            </div>
          </div>
        </div>

        <Icon
          v-if="$userStore.id === $generalStore.selectedPost.user.id"
          @click="($event) => deletePost()"
          class="cursor-pointer"
          name="material-symbols:delete-outline-sharp"
          size="25"
        />
      </div>

      <div class="px-8 mt-4 text-sm">
        {{ $generalStore.selectedPost.text }}
      </div>

      <div class="flex items-center px-8 mt-4 text-sm font-bold">
        <Icon name="mdi:music" size="17" />
        <span class="ml-1">
          original sound - {{ $generalStore.selectedPost.user.username }}
        </span>
      </div>

      <div class="flex items-center px-8 mt-8">
        <div class="pb-4 text-center flex items-center">
          <button
            @click="($event) => (isLiked ? unlikePost() : likePost())"
            class="rounded-full bg-gray-200 p-2 cursor-pointer flex items-center"
          >
            <Icon
              name="mdi:heart"
              size="25"
              :style="isLiked ? 'color: #F02C56' : ''"
            />
          </button>

          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            {{ $generalStore.selectedPost.likes.length }}
          </span>
        </div>

        <div class="pb-4 text-center flex items-center">
          <div
            class="rounded-full bg-gray-200 p-2 cursor-pointer flex items-center"
          >
            <Icon name="bx:bxs-message-rounded-dots" size="25" />
          </div>

          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">123</span>
        </div>
      </div>

      <div
        id="Comments"
        class="bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div class="pt-2" />

        <div
          v-if="$generalStore.selectedPost.comments.length < 1"
          class="text-center mt-6 text-xl text-gray-500"
        >
          No comments...
        </div>

        <div
          v-else
          v-for="comment in $generalStore.selectedPost.comments"
          :key="comment.id"
          class="flex items-center justify-between px-8 mt-4"
        >
          <div class="flex items-center relative w-full">
            <NuxtLink :to="`/@${comment.user.username}`">
              <img
                class="absolute top-0 rounded-full lg:mx-0 mx-auto"
                width="40"
                :src="comment.user.image"
              />
            </NuxtLink>

            <div class="ml-14 pt-0.5 w-full">
              <div
                class="text-[18px] font-semibold flex items-center justify-between"
              >
                {{ comment.user.name }}
                <Icon
                  v-if="$userStore.id === comment.user.id"
                  @click="
                    ($event) =>
                      deleteComment($generalStore.selectedPost, comment.id)
                  "
                  class="cursor-pointer"
                  name="material-symbols:delete-outline-sharp"
                  size="25"
                />
              </div>

              <div class="text-[15px] font-light">
                {{ comment.text }}
              </div>
            </div>
          </div>
        </div>

        <div class="mb-28" />
      </div>

      <div
        id="CreateComment"
        v-if="$userStore.id"
        class="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
      >
        <div
          :class="
            inputFocused
              ? 'border-2 border-gray-400'
              : 'border-2 border-[#F1F1F2]'
          "
          class="bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]"
        >
          <input
            v-model="comment"
            @focus="($event) => (inputFocused = true)"
            @blur="($event) => (inputFocused = false)"
            class="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
            type="text"
            placeholder="Add comment..."
          />
        </div>

        <button
          :disabled="!comment"
          @click="($event) => createComment()"
          :class="comment ? 'text-[#F02C56] cursor-pointer' : 'text-gray-400'"
          class="font-semibold text-sm ml-5 pr-1"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $userStore, $profileStore, $generalStore } = useNuxtApp();

const route = useRoute();
const router = useRouter();

definePageMeta({ middleware: "auth" });

const video = ref(null);
const isLoaded = ref(false);
const comment = ref(null);
const inputFocused = ref(false);

onMounted(async () => {
  $generalStore.selectedPost = null;

  try {
    await $generalStore.getPostById(route.params.id);
    video.value.play();
  } catch (error) {
    if (error && error.response.status === 400) {
      router.push("/");
    }
  }

  video.value.addEventListener("loadeddata", (e) => {
    if (e.target) {
      setTimeout(() => {
        isLoaded.value = true;
      }, 500);
    }
  });
});

onBeforeUnmount(() => {
  video.value.pause();
  video.value.currentTime = 0;
  video.value.src = "";
});

watch(
  () => isLoaded.value,
  () => {
    if (isLoaded.value) {
      setTimeout(() => video.value.play(), 500);
    }
  }
);

const loopThroughPostsDown = () => {
  setTimeout(() => {
    let idArrayReversed = $generalStore.ids.reverse();
    let isBreak = false;

    for (let i = 0; i < idArrayReversed.length; i++) {
      const id = idArrayReversed[i];

      if (id < route.params.id) {
        router.push(
          `/@${$generalStore.selectedPost.user.username}/video/${id}`
        );
        isBreak = true;
        return;
      }
    }

    if (!isBreak) {
      router.push(
        `/@${$generalStore.selectedPost.user.username}/video/${idArrayReversed[0]}`
      );
    }
  }, 300);
};

const loopThroughPostsUp = () => {
  setTimeout(() => {
    let isBreak = false;

    for (let i = 0; i < $generalStore.ids.length; i++) {
      const id = $generalStore.ids[i];

      if (id > route.params.id) {
        router.push(
          `/@${$generalStore.selectedPost.user.username}/video/${id}`
        );
        isBreak = true;
        return;
      }
    }

    if (!isBreak) {
      router.push(
        `/@${$generalStore.selectedPost.user.username}/video/${$generalStore.ids[0]}`
      );
    }
  }, 300);
};

const isLiked = computed(() => {
  const response = $generalStore.selectedPost.likes.find(
    (like) => like.user_id === $userStore.id
  );

  return response ? true : false;
});

const likePost = async () => {
  try {
    await $userStore.likePost($generalStore.selectedPost, true);
  } catch (error) {
    console.error(error);
  }
};

const unlikePost = async () => {
  try {
    await $userStore.unlikePost($generalStore.selectedPost, true);
  } catch (error) {
    console.error(error);
  }
};

const deletePost = async () => {
  const response = confirm("Are you sure you want to delete this post?");

  try {
    if (response) {
      await $userStore.deletePost($generalStore.selectedPost);
      await $profileStore.getProfile($userStore.username);
      router.push(`/@${$userStore.username}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const createComment = async () => {
  try {
    await $userStore.createComment($generalStore.selectedPost, comment.value);
    comment.value = null;
    document.getElementById("Comments").scroll({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteComment = async (post, commentId) => {
  const response = confirm("Are you sure you want to delete this comment?");

  try {
    if (response) {
      await $userStore.deleteComment(post, commentId);
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
