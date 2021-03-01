<template>
  <section class="container">
    <b-container class="interventions">
      <b-row>
        <b-col cols="6" offset="3" >
            <div class="text-center mb-3">
              <h1>
                Validation de l'inscription
              </h1>
            </div>
            <user-infos :user="user" :check-legal="true" :submit-txt="'Je valide mon compte'" @submit="confirmRegistration"/>
        </b-col>
      </b-row>
      <modal name="confirmIdentityModal" height="auto" width="900px" :scrollabe="true">
        <connection-form  @submit="confirmIdentity" :hasToConfirmMail="true" information="Cet email est déjà utilisé sur Savoir Rouler, veuillez confirmer votre mot de passe." />
      </modal>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: function() {
    return {
      authId: null
    }
  },
  components: {
    connectionForm: () => import('~/components/connectionForm.vue'),
    userInfos: () => import('~/components/userInfos.vue')
  },
  computed: {
    ...mapState({
      'user': state => state.utilisateurCourant
    }),
  },
  methods: {
    // Validation de l'inscription
    confirmRegistration(){
      const url = process.env.API_URL + '/connexion/verify'
      const body = JSON.parse(JSON.stringify(this.user))
      if (this.user.email) {
        body['mail'] = this.user.email
      }
      return this.$axios.$post(url, body)
        .then(async response => {
          if (response.existingUser) {
            this.authId = response.existingUser.authId
            this.$modal.show('confirmIdentityModal')
            return 
          }

          await this.$store.dispatch('set_utilisateur', response.user);
          this.$router.push('/interventions')
          this.$toast.success('Inscription validée.')
        }).catch(error => {
          console.log(error)
          this.$toast.error(error)
        })
    },
    confirmIdentity(identity) {
      const url = process.env.API_AUTH_URL + '/users/identify'
      const body = identity
      body['authId'] = this.authId
      return this.$axios.$post(url, body)
        .then(async isIdentified => {
          if(isIdentified) {
            return this.updateUserInfos()
          } 
          return this.$toast.error('Mot de passe incorrecte, veuillez le réinitialiser ou contacter l\'assistance.')
        }).catch(error => {
          console.log(error)
          this.$toast.error(error)
        })
    },
    updateUserInfos() {
      const url = process.env.API_URL + '/connexion/auth-identified'
      const user = this.user
      user['authId'] = this.authId
      return this.$axios.$put(url, {user})
        .then(async user => {
          await this.$store.dispatch('set_utilisateur', user)
          this.$router.push('/interventions')
          this.$toast.success(`Bienvenue ${user.prenom}`)
          this.$toast.info(`Vous pouvez maintenant vous connecter via France Connect et via mot de passe!`)
        }).catch(error => {
          console.log(error)
          this.$toast.error(err)
        })
      
    }
  }
};
</script>

<style>

</style>
