<script setup lang="ts">
import { useArticlesStore } from '~/stores/articles'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'


const articlesStore = useArticlesStore()
const route = useRoute()

// Trouver l'article correspondant dans `recentArticles`
const article = computed(() => articlesStore.recentArticles.find(a => a.path === route.path));

// ✅ Attendre que l'article soit bien chargé avant de l'ajouter
watch(article, (newArticle) => {
  if (newArticle && newArticle.title !== 'Titre indisponible') {
    console.log("🟢 Article prêt à être ajouté :", newArticle);
    articlesStore.addVisitedArticle(newArticle);
  } else {
    console.log("⏳ Article en cours de chargement...");
  }
}, { immediate: true });

useHead({
  title: '404',
  meta: [
    {
      name: 'description',
      content: 'Page not found',
    },
  ],
})

defineOgImageComponent('About', {
  headline: 'Wrong Path',
  title: '404',
  description: 'Page Not Found',
})
</script>

<template>
  <div class="py-5">
    <div class="container max-w-xl mx-auto">
      <Logo404 />
    </div>
  </div>
</template>
