<template>
  <section class="container">
    <b-container class="interventions">
      <b-row>
        <b-col cols="6" offset="3" >
            <div class="text-center mb-3">
              <h1>
                Édition des informations
              </h1>
            </div>
            <user-infos :user="user" :check-legal="false" :submit-txt="'Enregistrer'" @submit="editProfile"/>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import userInfos from '~/components/moncompte.vue'
export default {
  data() {
    return {
      user: JSON.parse(JSON.stringify(this.$store.state.utilisateurCourant))
    };
  },
  methods: {
    // Validation de l'inscription
    async editProfile(){
        console.info('url:' + url)

        const url = process.env.API_URL + '/connexion/verify'
        return this.$axios.$post(url, this.user)
        .then(async response => {
            await this.$store.dispatch('set_utilisateur', response.user);
            this.$toast.success('Profil enregistré avec succès.')

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
