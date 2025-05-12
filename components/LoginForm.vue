<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const login = async () => {
  await authStore.login(email.value, password.value)
}

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="p-4 bg-gray-200 rounded">
    <h2 class="text-lg font-bold mb-2">Connexion</h2>

    <div v-if="!authStore.isAuthenticated">
      <input v-model="email" placeholder="Email" class="p-2 border rounded w-full mb-2" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="p-2 border rounded w-full mb-2" />
      <button class="p-2 bg-blue-500 text-white rounded w-full" @click="login">Se connecter</button>
    </div>

    <button v-else class="p-2 bg-red-500 text-white rounded w-full" @click="logout">
      Se déconnecter
    </button>
  </div>
</template>
