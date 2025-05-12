<script lang="ts" setup>
import { navbarData } from '~/data'
import { useAuthStore } from '~/stores/auth'
import { useArticlesStore } from '~/stores/articles'
import { onMounted, watch, ref } from 'vue'

const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const displayedArticles = ref<{ title: string; description: string; image: string; alt: string; ogImage: string; path: string; date: string; tags: string[]; published: boolean; }[]>([])

// Charger les articles récents et les articles visités
onMounted(async () => {
  await articlesStore.fetchRecentArticles()
  articlesStore.loadVisitedArticles()
  authStore.loadUserFromStorage()

  displayedArticles.value = articlesStore.getDisplayedArticles()
})

// 🔄 Observer les changements dans visitedArticles et recentArticles
watch(
  () => [articlesStore.visitedArticles, articlesStore.recentArticles],
  () => {
    displayedArticles.value = articlesStore.getDisplayedArticles()
  },
  { deep: true }
)

watchEffect(() => {
  displayedArticles.value = articlesStore.getDisplayedArticles()
})

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content:
        'Welcome To My Blog Site. Get Web Development, Javascript, Typescript, NodeJs, Vue, and Nuxt, Related Articles, Tips, Learning resources and more.',
    },
  ],
})

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Greetings 👋',
  title: navbarData.homeTitle,
  description: 'Dive into web development with me and learn Js, Ts, Vue, Nuxt, Docker, k8s',
  link: '/Owa.jpg',
})
</script>

<template>
  <main class="container max-w-5xl mx-auto text-zinc-600">
    <h2 class="text-xl font-bold mb-4">Articles recommandés</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="article in displayedArticles" :key="article.title" class="p-4 border rounded-lg shadow">
        <img :src="article.image" :alt="article.alt" class="w-full h-48 object-cover rounded-md">
        <h3 class="text-lg font-semibold mt-2">{{ article.title }}</h3>
        <p class="text-sm text-gray-600">{{ article.date }}</p>
        <p class="text-sm mt-2">{{ article.description }}</p>
        <NuxtLink :to="article.path" class="text-blue-500 mt-2 block">Lire la suite</NuxtLink>
      </div>
    </div>

    <MainHero />
    <MainRecent />
    <MainTrending />
  </main>
</template>