// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["vuetify/styles", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: "Glamour Palace Dashboard",
      meta: [
        { name: "description", content: "Glamour Palace E-commerce Dashboard" },
        { name: "theme-color", content: "#1976D2" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "Glamour Palace Dashboard",
    },
  },
});
