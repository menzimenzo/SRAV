<template>
  <section class="container">
    <div class="mb-5 mt-5 text-center">
      <h1>
        Connexion en cours...
      </h1>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
    };
  },
//
//  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
//
  async mounted() {

    const url = process.env.API_URL + '/connexion/callback?code=' + this.$route.query.code + '&state=' + this.$route.query.state
    this.$axios.$get(url)
    .then(async response => {
      await this.$store.dispatch('set_utilisateur', response.user);
    
      this.$router.push(response.url)
    }).catch(err => {
      console.log(err)
    })
  }
};
</script>

<style>

</style>

