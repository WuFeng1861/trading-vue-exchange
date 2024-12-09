<script setup>
const navigation = [
  { name: '交易', href: '#', current: true },
];
</script>

<template>
  <header class="bg-trading-dark border-b border-gray-700">
    <nav class="px-4 sm:px-6" aria-label="Top">
      <div class="w-full py-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-2xl font-bold text-white">MERC</span>
          <div class="hidden md:flex ml-10 space-x-8">
            <a v-for="link in navigation"
               :key="link.name"
               :href="link.href"
               :class="[link.current ? 'text-white' : 'text-gray-400 hover:text-white']"
               class="text-base font-medium">
              {{ link.name }}
            </a>
          </div>
        </div>
        <div class="flex items-center">
          <!-- 移动端菜单按钮 -->
          <button class="md:hidden mr-4 text-gray-400 hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端导航菜单 -->
      <div class="md:hidden py-2 border-t border-gray-700 hidden">
        <a v-for="link in navigation"
           :key="link.name"
           :href="link.href"
           :class="[link.current ? 'text-white' : 'text-gray-400']"
           class="block py-2 text-base font-medium">
          {{ link.name }}
        </a>
      </div>
    </nav>
  </header>
</template>
<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>