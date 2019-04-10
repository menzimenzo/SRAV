<template>
  <b-container>
  
    <b-row class="text-center">
      <b-col cols="3">
        
        <b-img :src="require('assets/image_gauche.png')" style="width: 100%;  margin-top:15%; "/>
      </b-col>
      <b-col cols="6">
        
        <p  style=";font-size: 150%;text-transform: uppercase;color: rgb(0,0,128)"><br>Je suis Intervenant<br>Savoir Rouler à Vélo, <br>je m’identifie et renseigne<br>mes interventions</p>
        <b-img class="fcBtn" @click="connexionutilisateur()"  fluid  :src="require('assets/FCboutons-10.png')" border="0" style="size: 100%;padding-top:10px" />
        <br>
        <a
          href="https://franceconnect.gouv.fr/"
          target="_blank"
          class="button--green"
          style="size: 100%;margin-top:10px;margin-bottom:10px" 
          >A propos de FranceConnect</a>
      </b-col>
      <b-col cols="3">
        
        <b-img :src="require('assets/‎image_droite.png')" style="width: 100%;margin-top:15%;" />
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col cols="12" class="text-center" >
        
        <b-img :src="require('assets/infographie.png')" style="width:75%" />
      
      </b-col>
    </b-row>
 
  </b-container>
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
    
  }
};
</script>


<style>

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

