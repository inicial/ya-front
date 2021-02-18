import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,

  head: {
    titleTemplate: 'VAT %s',
    title: 'VAT',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [{
      src: '/gsap.min.js'
    }]
  },

  env: {
    HOST_URL: process.env.HOST_URL || 'http://127.0.0.1:5000'
  },

  loading: {
    color: 'blue',
    width: '500px'
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
  ],

  axios: {
    // headers: { crossDomain: true, 'Content-Type': 'application/json'},
    proxy: true
  },
  proxy: {
    // 'http://127.0.0.1:5000/login': { target: 'http://127.0.0.1:5000/login', pathRewrite: {'^/login': '/'} },
    // '/api/auth/user': { target: 'http://127.0.0.1:3000/api/auth/user' },
    '/api/auth/user': {
      target: 'http://127.0.0.1:3000/api',
      pathRewrite: {
        '^/api/auth/user': '/'
      }
    },
    '/api': {
      target: 'http://127.0.0.1:5000/api',
      pathRewrite: {
        '^/api/': '/'
      }
    },
  },

  // auth: {},
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'http://127.0.0.1:5000/login_jwt',
            method: 'post',
            propertyName: 'token',
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          },
          // logout: {url: 'http://127.0.0.1:5000/logout'},
          logout: false,
        },
        tokenRequired: true,
        tokenType: 'Basic',
        globalToken: true,
        watchLoggedIn: true,
        rewriteRedirects: true
      }
    },
    redirect: {
      login: '/auth',
      logout: '/',
      callback: '/auth',
      home: '/'
    },
  },

  router: {
    // middleware: ['authenticated', 'notAuthenticated']
    middleware: ['auth']
  },



  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.blue.accent3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {}
}
