<template>
  <div>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <div class="px-6 pb-1.5 text-[15px]">Email address</div>

    <div class="px-6 pb-2">
      <TextInput
        placeholder="Email address"
        v-model="email"
        inputType="email"
        :autoFocus="true"
        :error="errors && errors.email ? errors.email[0] : ''"
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        placeholder="Password"
        v-model="password"
        inputType="password"
        :error="errors && errors.password ? errors.password[0] : ''"
      />
    </div>

    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <div class="px-6 pb-2 mt-6">
      <button
        @click="($event) => login()"
        :disabled="!email || !password || status === 'pending'"
        :class="!email || !password ? 'bg-gray-200' : 'bg-[#F02C56]'"
        class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
      >
        <span
          class="flex justify-center items-center h-[26px]"
          v-if="status === 'pending'"
        >
          <Icon
            class="animate-spin ml-1"
            size="26"
            name="mingcute:loading-line"
            style="color: #ffffff"
          />
        </span>

        <span v-else>Log in</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp();

const email = ref(null);
const password = ref(null);
const errors = ref(null);
const status = ref("idle");

const login = async () => {
  errors.value = null;

  try {
    status.value = "pending";

    await $userStore.getTokens();
    await $userStore.login(email.value, password.value);
    await $userStore.getUser();
    await $generalStore.getRandomUsers("suggested");
    await $generalStore.getRandomUsers("following");

    status.value = "idle";

    $generalStore.isLoginOpen = false;
  } catch (error) {
    status.value = "idle";
    errors.value = error.response.data.errors;
  }
};
</script>
