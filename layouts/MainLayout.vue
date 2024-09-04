<template>
  <div
    class="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-100 h-screen overflow-y-auto"
  >
    <TopNav />

    <div
      :class="route.fullPath === '/' ? 'max-w-[1140px]' : ''"
      class="flex justify-between mx-auto w-full lg:px-2.5 px-0"
    >
      <div>
        <SideNavMain />
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>
