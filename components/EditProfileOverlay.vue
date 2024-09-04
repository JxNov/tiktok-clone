<template>
  <div
    id="EditProfileOverlay"
    class="fixed flex justify-center pt-6 md:pt-[45px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto scroll-hidden"
  >
    <div
      class="relative bg-white w-full max-w-[700px] sm:h-[710px] h-[795px] mx-3 p-4 rounded-lg mb-10"
      :class="!uploadedImage ? 'h-[655px]' : 'h-[580px]'"
    >
      <div
        class="absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray-300"
      >
        <div class="text-[22px] font-medium">Edit profile</div>
        <button
          class="flex items-center"
          @click="($event) => ($generalStore.isEditProfileOpen = false)"
        >
          <Icon name="mdi:close" size="25" />
        </button>
      </div>

      <div
        class="h-[calc(500px-200px)]"
        :class="!uploadedImage ? 'mt-16' : 'mt-[58px]'"
      >
        <div v-if="!uploadedImage">
          <div
            id="ProfilePhotoSection"
            class="flex flex-col border-b sm:h-[120px] h-[155px] px-1.5 py-2 w-full"
          >
            <div
              class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center"
            >
              Profile photo
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <label for="image" class="relative cursor-pointer">
                <img class="rounded-full" width="95" :src="userImage" />

                <div
                  class="absolute bottom-0 right-0 rounded-full bg-white shadow-xl border p-1 border-gray-300 inline-block w-[32px]"
                >
                  <Icon
                    name="ph:pencil-simple-line-bold"
                    size="17"
                    class="-mt-1 ml-0.5"
                  />
                </div>
              </label>

              <input
                class="hidden"
                type="file"
                id="image"
                @input="getUploadedImage"
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>

          <div
            id="UsernameSection"
            class="flex flex-col border-b sm:h-[150px] px-1.5 py-2 mt-1.5 w-full"
          >
            <div
              class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center"
            >
              Username
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <TextInput
                  placeholder="Username"
                  v-model="userName"
                  inputType="text"
                  :error="
                    userName.length < 2
                      ? 'Username must be at least 2 characters'
                      : ''
                  "
                />

                <div class="text-[11px] text-gray-500 mt-4">
                  localhost:3000/@{{ userName }}
                </div>

                <div class="text-[11px] text-gray-500 mt-1">
                  Usernames can only contain letters, numbers, underscores, and
                  periods. Changing your username will also change your profile
                  link.
                </div>
              </div>
            </div>
          </div>

          <div
            id="FullNameSection"
            class="flex flex-col border-b sm:h-[100px] px-1.5 py-2 mt-1.5 w-full"
          >
            <div
              class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center"
            >
              Name
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <TextInput
                  placeholder="Name"
                  v-model="fullName"
                  inputType="text"
                  max="30"
                />

                <div class="text-[11px] text-gray-500 mt-4">
                  Your nickname can only be changed once every 7 days.
                </div>
              </div>
            </div>
          </div>

          <div
            id="BioSection"
            class="flex flex-col sm:h-[120px] px-1.5 py-2 mt-2 w-full"
          >
            <div
              class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center"
            >
              Bio
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <textarea
                  cols="30"
                  rows="4"
                  v-model="userBio"
                  maxlength="80"
                  class="resize-none w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
                  placeholder="Bio"
                ></textarea>

                <div class="text-[11px] text-gray-500">
                  {{ userBio ? userBio.length : 0 }}/80
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="w-full h-[430px]">
          <Cropper
            class="h-[430px]"
            ref="cropper"
            :stencil-component="CircleStencil"
            :src="uploadedImage"
          />
        </div>
      </div>

      <div
        id="ButtonSection"
        class="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 w-full"
      >
        <div
          id="UpdateInfoButtons"
          v-if="!uploadedImage"
          class="flex items-center justify-end"
        >
          <button
            @click="($event) => ($generalStore.isEditProfileOpen = false)"
            class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
          >
            <span class="px-2 font-medium text-[15px]">Cancel</span>
          </button>

          <button
            :disabled="!isUpdated || userName.length < 2"
            @click="($event) => updateUserInfo()"
            :class="
              !isUpdated || userName.length < 2 ? 'bg-gray-200' : 'bg-[#F02C56]'
            "
            class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
          >
            <span class="mx-4 font-medium text-[15px]">Apply</span>
          </button>
        </div>

        <div id="CropperButtons" v-else class="flex items-center justify-end">
          <button
            @click="($event) => (uploadedImage = null)"
            class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
          >
            <span class="px-2 font-medium text-[15px]">Cancel</span>
          </button>

          <button
            @click="($event) => cropAndUpdateImage()"
            class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
          >
            <span class="mx-4 font-medium text-[15px]">Apply</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

import { storeToRefs } from "pinia";
const { $userStore, $generalStore, $profileStore } = useNuxtApp();
const { username, name, bio, image } = storeToRefs($userStore);

const route = useRoute();
const router = useRouter();

onMounted(() => {
  userName.value = username.value;
  fullName.value = name.value;
  userBio.value = bio.value;
  userImage.value = image.value;
});

const file = ref(null);
const cropper = ref(null);
const uploadedImage = ref(null);
const userImage = ref(null);
const userName = ref("");
const fullName = ref("");
const userBio = ref("");
const isUpdated = ref(false);

const getUploadedImage = (e) => {
  file.value = e.target.files[0];
  uploadedImage.value = URL.createObjectURL(file.value);
};

const cropAndUpdateImage = async () => {
  const { coordinates } = cropper.value.getResult();

  const data = new FormData();

  data.append("image", file.value || "");
  data.append("height", coordinates.height || "");
  data.append("width", coordinates.width || "");
  data.append("left", coordinates.left || "");
  data.append("top", coordinates.top || "");

  try {
    await $userStore.updateUserImage(data);
    await $userStore.getUser();
    await $profileStore.getProfile(route.params.username);

    $generalStore.updateSideMenuImage($generalStore.suggested, $userStore);
    $generalStore.updateSideMenuImage($generalStore.following, $userStore);

    userImage.value = image.value;
    uploadedImage.value = null;
  } catch (error) {
    console.log(error);
  }
};

const updateUserInfo = async () => {
  try {
    await $userStore.updateUser(userName.value, fullName.value, userBio.value);
    if (userName.value !== username.value) router.push(`/@${userName.value}`);
    await $userStore.getUser();
    await $profileStore.getProfile(route.params.username);

    userName.value = username.value;
    fullName.value = name.value;
    userBio.value = bio.value;

    setTimeout(() => {
      $generalStore.isEditProfileOpen = false;
    }, 100);
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => userName.value,
  () => {
    if (!userName.value || userName.value === username.value) {
      isUpdated.value = false;
    } else {
      isUpdated.value = true;
    }
  }
);

watch(
  () => fullName.value,
  () => {
    if (!fullName.value || fullName.value === name.value) {
      isUpdated.value = false;
    } else {
      isUpdated.value = true;
    }
  }
);

watch(
  () => userBio.value,
  () => {
    if (userBio.value === bio.value) {
      isUpdated.value = false;
    } else {
      isUpdated.value = true;
    }
  }
);
</script>
