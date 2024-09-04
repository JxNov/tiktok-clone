<template>
  <div
    id="SideNavMain"
    :class="route.fullPath === '/' ? 'lg:w-[310px]' : 'lg:w-[220px]'"
    class="fixed z-20 bg-white mt-[60px] py-[20px] lg:border-r-0 border-r w-[75px] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-100 h-screen overflow-y-auto scroll-hidden hover-scroll-auto"
  >
    <div class="lg:w-full w-[55px] mx-auto">
      <NuxtLink to="/">
        <MenuItem iconString="For You" colorString="#F02C56" sizeString="30" />
      </NuxtLink>

      <MenuItem iconString="Following" colorString="#000000" sizeString="27" />
      <MenuItem iconString="LIVE" colorString="#000000" sizeString="27" />

      <div class="border-b lg:ml-2 mt-2" />

      <div
        class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2"
      >
        Suggested accounts
      </div>

      <div class="lg:hidden block pt-3" />

      <div v-if="$generalStore.suggested">
        <div v-for="sug in $generalStore.suggested" :key="sug.id">
          <div @click="($event) => isLoggedIn(sug)" class="cursor-pointer">
            <MenuItemFollow :user="sug" />
          </div>
        </div>
      </div>

      <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-13px">
        See all
      </button>

      <div class="border-b lg:ml-2 mt-2" />

      <div
        class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2"
      >
        Following accounts
      </div>

      <div class="lg:hidden block pt-3" />

      <div v-if="$generalStore.following">
        <div v-for="fol in $generalStore.following" :key="fol.id">
          <div @click="($event) => isLoggedIn(fol)" class="cursor-pointer">
            <MenuItemFollow :user="fol" />
          </div>
        </div>
      </div>

      <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-13px">
        See more
      </button>

      <div class="lg:block hidden border-b lg:ml-2 mt-2" />

      <div class="lg:block hidden text-[12px] font-bold text-[#16182380]">
        <div class="pt-4 px-2 text-[15px]">Company</div>
        <div class="pt-4 px-2 text-[15px]">Program</div>
        <div class="pt-4 px-2 text-[15px]">Terms & Policies</div>

        <div class="pt-2 px-2 font-semibold">
          &copy; {{ new Date().getFullYear() }} TikTok
        </div>
      </div>

      <div class="pb-14"></div>
    </div>
  </div>
</template>

<script setup>
const { $generalStore, $userStore } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const isLoggedIn = (fol) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true;
    return;
  }

  setTimeout(() => router.push(`/@${fol.username}`), 200);
};
</script>
