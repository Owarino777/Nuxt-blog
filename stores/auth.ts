export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { email: string; token: string } | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) throw new Error('Invalid credentials')

        const data = await response.json()
        this.user = { email, token: data.access_token }

        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Login failed:', error)
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
    },

    loadUserFromStorage() {
      if (import.meta.client) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) this.user = JSON.parse(savedUser)
      }
    },
  },
})
