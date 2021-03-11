module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Savoir rouler à vélo',
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
    'bootstrap-vue/nuxt', '@nuxtjs/axios', '@nuxtjs/toast'
  ], toast: {
    duration: 15000,
    iconPack: 'fontawesome',
    action: [
        {
            onClick: (e, toastObject) => {
                toastObject.goAway(0)
            },
            icon: 'check',
            class: 'material-icons'
        }
    ]
  }, axios: {
    credentials: true,
    crossDomain: true,
    proxyHeaders: true
  },
  css: ['~/node_modules/vue-js-modal/dist/styles.css',
        '~/node_modules/glyphicons-only-bootstrap/css/bootstrap.min.css'
  ],
  env: {
    // Utilisé côté client, url publique
    API_URL: process.env.API_URL || 'http://localhost/backend/api',
    // Utilisé par le serveur Nuxt, url locale ou publique
    API_SERVER_URL: process.env.API_SERVER_URL || 'http://localhost/backend/api',
    PROXY_URL: process.env.PROXY_URL || 'http://proxy'

  },
  router: {
    base: process.env.URL_PREFIX || '/',
    middleware: ['check-auth']
  },
  plugins: [
    { mode: 'all', src: '~/plugins/vee-validate' },
    { mode: 'all', src: '~/plugins/vue-js-modal' },
    { mode: 'all', src: '~/plugins/filters' },
  ]
}

