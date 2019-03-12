<template>
  <section class="container">
    <div>
      <!--<app-logo/>-->
      
      <img  
        border="0" 
        alt="Connexion France Connect" 
        src="~assets/savoirrouleravelo_p.png"
        v-on:click="connexionutilisateur">
      <div class="mb-3 mt-1">
      <a @click="connexionutilisateur()" class="fcBtn"><br>
        <img border="0" alt="Connexion France Connect" src="~assets/FCboutons-10.png">
      </a>
      </div>

      <div class="links">
        
        <a
          href="https://franceconnect.gouv.fr/"
          target="_blank"
          class="button--green"
          >A propos de FranceConnect</a>

      </div>
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
//  RECHERCHE DE LA COMMUNE PAR CODE POSTAL
//
  methods: {
    connexionutilisateur: function () {
      console.info("Recherche de l'utilisateur");
      const url = process.env.API_URL + '/connexion/login'
      console.info(url);
      this.$axios.$get(url)
      .then(response => {
        window.location.replace(response.url)
      }).catch(err => {
        console.log(err)
      })

    } 
  },

//
//  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
//
  async mounted() {
    console.info("mounted home");
    await this.$store.dispatch('get_interventions');
  }
};
</script>


<style>
.container {

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.fcBtn{
  cursor: pointer;
}
</style>

