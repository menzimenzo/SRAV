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
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import userInfos from '~/components/userInfos.vue'
export default {
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
          await this.$store.dispatch('set_utilisateur', response.user);
          this.$router.push('/interventions')
          this.$toast.success('Inscription validée.')
        }).catch(err => {
          console.log(err)
        })
    },

  },
  components: {userInfos}
};
</script>

<style>

</style>
