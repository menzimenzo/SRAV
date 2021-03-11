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
            <mon-compte :user="user" :check-legal="false" :submit-txt="'Enregistrer'" @submit="editProfile"/>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import monCompte from '~/components/moncompte.vue'
export default {
  computed: {
    ...mapState({
      'user': state => JSON.parse(JSON.stringify(state.utilisateurCourant))
    }),
  },
  methods: {
    // Validation de l'inscription
    async editProfile(){
        const url = process.env.API_URL + `/connexion/edit-mon-compte/${this.user.id }`
        return this.$axios.$put(url, { profil: this.user })
        .then(async response => {
            await this.$store.dispatch('set_utilisateurCourant', response.user);
            this.$toast.success('Profil enregistré avec succès.')

        }).catch(err => {
            console.log(err)
        })
    },

  },
  components: {monCompte}
};
</script>

<style>

</style>
