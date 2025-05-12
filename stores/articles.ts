import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { ParsedContent } from '@nuxt/content'

interface Article {
    title: string
    description: string
    image: string
    alt: string
    ogImage: string
    path: string
    date: string
    tags: string[]
    published: boolean
}

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    recentArticles: [] as Article[],
    visitedArticles: [] as Article[],
  }),

  actions: {
    async fetchRecentArticles() {
        try {
          const data: ParsedContent[] = await queryContent('/blogs')
            .sort({ date: -1 })
            .limit(3)
            .find();
      
          console.log("🟢 Données brutes récupérées :", data);
      
          if (!data || data.length === 0) {
            console.error("❌ Aucun article trouvé !");
            return;
          }
      
          this.recentArticles = data.map((article) => ({
            title: article.title || 'Titre indisponible',
            description: article.description || 'Aucune description',
            image: article.image || '/default-image.jpg',
            alt: article.alt || 'Image sans description',
            ogImage: article.ogImage || article.image || '/default-image.jpg',
            path: article._path || '/', // Assurez-vous que chaque article a un `path` valide
            date: article.date || 'Date inconnue',
            tags: article.tags || [],
            published: article.published ?? true,
          }));
      
          console.log("✅ Données transformées :", this.recentArticles);
        } catch (error) {
          console.error('❌ Erreur lors de la récupération des articles récents:', error);
        }
      },

      addVisitedArticle(article: Article) {
        if (import.meta.client) {
          console.log("🔍 Vérification avant ajout :", article);
      
          if (!article.title || !article.path || !article.image || article.title === 'Titre indisponible') {
            console.error("❌ Article incomplet, stockage annulé :", article);
            return;
          }
      
          const visited: Article[] = JSON.parse(localStorage.getItem('visitedArticles') || '[]');
      
          if (!visited.find((a) => a.path === article.path)) {
            visited.unshift(article);
            if (visited.length > 3) visited.pop(); // Limite à 3 articles
            localStorage.setItem('visitedArticles', JSON.stringify(visited));
      
            console.log("✅ Article ajouté à `visitedArticles` :", visited);
          }
      
          this.visitedArticles = [...visited]; // Met à jour le store
        }
      },

      loadVisitedArticles() {
        if (import.meta.client) {
          try {
            console.log("📤 Tentative de chargement des articles visités depuis `localStorage`...");
      
            const visited = JSON.parse(localStorage.getItem('visitedArticles') || '[]');
      
            if (!Array.isArray(visited)) {
              console.error("❌ Données corrompues dans `localStorage` :", visited);
              this.visitedArticles = [];
              return;
            }
      
            console.log("📥 Articles visités chargés :", visited);
      
            this.visitedArticles = visited.filter((a) => a.title && a.path && a.image);
      
          } catch (error) {
            console.error('❌ Erreur lors du chargement des articles visités:', error);
            this.visitedArticles = [];
          }
        }
      },
      
      getDisplayedArticles() {
        const authStore = useAuthStore();
      
        let displayed = [];
      
        if (authStore.isAuthenticated && this.visitedArticles.length > 0) {
          displayed = [...this.visitedArticles];
      
          let index = 0;
          while (displayed.length < 3 && index < this.recentArticles.length) {
            if (!displayed.find((a) => a.path === this.recentArticles[index].path)) {
              displayed.push(this.recentArticles[index]);
            }
            index++;
          }
        } else {
          displayed = this.recentArticles;
        }
      
        console.log("📌 Articles affichés dans la page :", displayed);
        return displayed;
      },
  },
})