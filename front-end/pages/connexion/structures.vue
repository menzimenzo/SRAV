<template>
  <section class="container">
    <b-container class="interventions">
      <b-row>
        <b-col cols="12" offset="0" >
            <div class="text-center mb-3">
              <h1>
                Mes structures
              </h1>
            </div>
            <mes-structures :user="user" :check-legal="false" :cancel-txt="'Annuler'" :submit-txt="'Enregistrer'" @submit="editProfile" @cancel="cancelEdit"/>        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import mesStructures from '~/components/messtructures.vue'
export default {
  computed: {
    ...mapState({
      'user': state => JSON.parse(JSON.stringify(state.utilisateurCourant))
    }),
  },
  methods: {
    // Validation de l'inscription
    async editProfile(){
        console.log("XXXXX user:", this.user)
        const url = process.env.API_URL + `/connexion/edit-mon-compte/${this.user.id }`
        return this.$axios.$put(url, { profil: this.user })
        .then(async response => {
            //await this.$store.dispatch('set_utilisateurCourant', response.user);
            await this.$store.dispatch('set_utilisateur', response.user);
            this.$toast.success('Profil enregistré avec succès.')
            // On ferme la fenêtre car on a terminé
            this.$router.push('/')            

        }).catch(err => {
            console.log(err)
        })
    },
    async cancelEdit(){
      // Annulation des modifications.
      this.$router.push('/')
    },
  },
  components: {mesStructures}
};
</script>

<style>

</style>
