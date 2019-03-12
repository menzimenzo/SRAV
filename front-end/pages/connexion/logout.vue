<template>
  <section class="container">
    <div class="mb-5 mt-5 text-center">
      <h1>
        Déconnexion en cours...
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
    const url = process.env.API_URL + '/connexion/logged-out'
    this.$axios.$get(url)
    .then(async response => {
      this.$router.push('/')
    }).catch(err => {
      console.log(err)
    })
  }
};
</script>

<style>

</style>

