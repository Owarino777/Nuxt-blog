<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  await authStore.login(email.value, password.value)
  if (authStore.isAuthenticated) {
    router.push('/') // Redirige vers la page d'accueil après connexion
  }
}
</script>

<template>
  <div class="container mx-auto max-w-md p-6 bg-gray-200 rounded mt-10">
    <h2 class="text-xl font-bold mb-4">Connexion</h2>

    <div v-if="!authStore.isAuthenticated">
      <input v-model="email" placeholder="Email" class="p-2 border rounded w-full mb-2" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="p-2 border rounded w-full mb-2" />
      <button class="p-2 bg-blue-500 text-white rounded w-full" @click="login">Se connecter</button>
    </div>

    <div v-else>
      <p class="text-green-600 font-semibold">Vous êtes déjà connecté.</p>
    </div>
  </div>
</template>
