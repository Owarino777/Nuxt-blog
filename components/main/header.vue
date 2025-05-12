<script setup lang="ts">
import { navbarData } from '../../data'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const colorMode = useColorMode()
function onClick(val: string) {
  colorMode.preference = val
}

const route = useRoute()
function isActive(path: string) {
  return route.path.startsWith(path)
}

// ✅ Rediriger correctement avec `navigateTo` pour Nuxt 3
const goToLogin = () => {
  navigateTo('/login')
}

// ✅ Déconnexion + Redirection
const logout = () => {
  authStore.logout()
  navigateTo('/')
}
</script>

<template>
  <div class="py-5 border-b dark:border-gray-800 font-semibold">
    <div class="flex px-6 container max-w-5xl justify-between mx-auto items-baseline">
      <ul class="flex items-baseline space-x-5">
        <li class="text-base sm:text-2xl font-bold">
          <NuxtLink to="/" :class="{ underline: $route.path === '/' }">
            {{ navbarData.homeTitle }}
          </NuxtLink>
        </li>
      </ul>
      <ul class="flex items-center space-x-3 sm:space-x-6 text-sm sm:text-lg">
        <li>
          <NuxtLink to="/blogs" :class="{ underline: isActive('/blogs') }"> Blogs </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/categories" :class="{ underline: isActive('/categories') }">
            Categories
          </NuxtLink>
        </li>
        <li title="About Me">
          <NuxtLink
            to="/about"
            aria-label="About me"
            :class="{ underline: $route.path === '/about' }"
          >
            About
          </NuxtLink>
        </li>

        <!-- ✅ Bouton Connexion / Déconnexion -->
        <li>
          <button
            v-if="!authStore.isAuthenticated"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            @click="goToLogin"
          >
            Se connecter
          </button>

          <button
            v-else
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            @click="logout"
          >
            Se déconnecter
          </button>
        </li>

        <!-- Mode Sombre / Clair -->
        <li>
          <ClientOnly>
            <button
              v-if="colorMode.value === 'light'"
              name="light-mode"
              title="Light"
              class="hover:scale-110 transition-all ease-out hover:cursor-pointer"
              @click="onClick('dark')"
            >
              <Icon name="icon-park:moon" size="20" />
            </button>
            <button
              v-if="colorMode.value === 'dark'"
              name="dark-mode"
              title="Dark"
              class="hover:scale-110 transition-all ease-out hover:cursor-pointer"
              @click="onClick('light')"
            >
              <Icon name="noto:sun" size="20" />
            </button>
            <template #fallback>
              <Icon name="svg-spinners:180-ring" size="20" />
            </template>
          </ClientOnly>
        </li>
      </ul>
    </div>
  </div>
</template>
