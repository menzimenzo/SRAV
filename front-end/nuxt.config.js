module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Savoir Rouler',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Front end pour savoir rouler' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {href:"https://fonts.googleapis.com/icon?family=Material+Icons", rel:"stylesheet"}
    ]
  },
  router: {
    middleware: ['check-auth']
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  watchers: {
    webpack: {
      poll: true
    }
  },
  modules: [
    'bootstrap-vue/nuxt', '@nuxtjs/axios'
  ],
  axios: {
    // proxyHeaders: false
  },
  env: {
    // Utilisé côté client, url publique
    API_URL: process.env.API_URL || 'http://localhost/backend',
    // Utilisé par le serveur Nuxt, url locale ou publique
    API_SERVER_URL: process.env.API_SERVER_URL || 'http://proxy/backend'

  },
  plugins: [
    { mode: 'all', src: '~/plugins/vee-validate' }
  ]
}

