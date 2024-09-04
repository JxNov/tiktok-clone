<template>
  <div
    class="bg-[#F8F8F8] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-100 h-screen overflow-y-auto"
  >
    <TopNav />

    <div class="flex justify-between mx-auto w-full px-2 max-w-[1140px]">
      <slot />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>
