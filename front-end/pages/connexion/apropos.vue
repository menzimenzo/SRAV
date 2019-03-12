<template>
  <section class="container">
    <div>
      <!--<app-logo/>-->
      
// CECI N'EST QU'UNE PAGE DE TEST
// CECI N'EST QU'UNE PAGE DE TEST
// CECI N'EST QU'UNE PAGE DE TEST


      <h1>CECI N'EST QU'UNE PAGE DE TEST</h1>
      <img  border="0" alt="Connexion France Connect" src="~assets/savoirrouleravelo_p.png">
      <a href="/interventions"><br>
        <img border="0" alt="Connexion France Connect" src="~assets/FCboutons-10.png">
      </a>
      <div class="links">
        
        <a
          href="https://franceconnect.gouv.fr/"
          target="_blank"
          class="button--green">A propos de France Connect</a>
          alt="Lien vers le site France Connect"
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
    recherchecommune: function () {
      console.info("Recherche de la commune");
      
    },
  
  },

//
//  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
//
  async mounted() {
    console.info("mounted");
    
  }
};
</script>

<style>
.container {
  min-height: 75vh;
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
</style>

