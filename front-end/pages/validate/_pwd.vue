<template>
  <main role="main" class="main validate-pwd">
    <div class="container" role="grid">
      <div
        v-if="!error"
        class="alert alert-info"
        role="alert"
        data-test-alert="validation">
        Validation en cours, vous allez être redirigé automatiquement ...
      </div>
      <div
        v-else
        class="alert alert-warning"
        role="alert"
        data-test-alert="sent">
        Une erreur est survenue. Veuillez réessayer ultérieurement.
      </div>
      <clip-loader :loading="loading" :color="primaryColor" />
    </div>
  </main>
</template>

<script>
import logger from '~/plugins/logger'
const log = logger('lca:pages:validate:_pwd')
import { mapGetters } from 'vuex'
import ClipLoader from '~/node_modules/vue-spinner/src/ClipLoader.vue'

export default {
    layout: '',
    components: {
        ClipLoader
    },
    data() {
        return {
            loading: false,
            error: null
        }
    },
    computed: mapGetters(['primaryColor']),
    mounted() {
        if (this.$Countly && this.$Countly.track_pageview) {
            this.$Countly.track_pageview('/validate/_pwd')
        }
        const pwd = this.$route.params.pwd
        const id = this.$route.query.id
        const url = `${process.env.API_URL}/connexion/enable-mail/${pwd}/user/${id}`
        log.i('mounted - In', { url, pwd, id})
        this.loading = true
        return this.$axios.$get(url)
            .then(res => {
                log.d('mounted - Email validé', res)
                this.$toast.success('Votre mot de passe a été validé.')            
                this.$store.dispatch('set_utilisateur', res.user);
                log.i('mounted - Done')
                return this.$router.push('/interventions')
                
            })
            .catch(e => {
                const message = e.response && e.response.data && e.response.data.message || e.message
                log.w('mounted - validation', message)
                this.$toast.error(message)
                this.error = message
            })
            .finally(() => {
                this.loading = false
            })
    }
}
</script>

<style scoped>
.validate-pwd .container {
    margin-top: 20px;
}
</style>
