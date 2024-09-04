<template>
  <div
    id="AuthOverlay"
    class="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-y-auto scroll-hidden"
  >
    <div
      class="bg-white w-full max-w-[480px] h-[640px] p-4 rounded-lg"
      :class="windowHeight < 640 ? 'absolute top-0' : 'relative top-0'"
    >
      <div class="w-full flex justify-end">
        <button
          @click="($event) => ($generalStore.isLoginOpen = false)"
          class="flex items-center p-1.5 rounded-full bg-gray-100"
        >
          <Icon name="mdi:close" size="26" />
        </button>
      </div>

      <Login v-if="isRegister" />
      <Register v-else />

      <div
        class="absolute bottom-0 left-0 w-full flex justify-center items-center p-4 border-t"
      >
        <span class="text-[14px] text-gray-600">
          {{
            isRegister ? "Don't have an account?" : "Already have an account?"
          }}
        </span>

        <button
          @click="($event) => (isRegister = !isRegister)"
          class="text-[14px] text-[#F02C56] font-semibold pl-1"
        >
          <span v-if="isRegister">Sign up</span>
          <span v-else>Log in</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $generalStore } = useNuxtApp();
const isRegister = ref(true);
const windowHeight = ref(0);

const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight;
};

onBeforeMount(() => {
  updateWindowHeight();
});

onMounted(() => {
  updateWindowHeight();
  window.addEventListener("resize", updateWindowHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowHeight);
});
</script>
