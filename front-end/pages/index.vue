<template>
  <section class="container">
    <div>
      <b-row>
        <b-col>
          <b-img :src="require('assets/image_gauche.png')" style="width: 100%;  padding-right: 30%;margin-top:15%; "/>
        </b-col>
        <b-col>
          <p  style=";font-size: 150%;text-transform: uppercase;color: rgb(0,0,128)"><br>Je suis Intervenant<br>Savoir Rouler à Vélo, <br>je m’identifie et renseigne<br>mes interventions</p>
          <b-img class="fcBtn" @click="connexionutilisateur()"  fluid  :src="require('assets/FCboutons-10.png')" border="0" style="size: 100%;padding-top:10px" />
          <a
            href="https://franceconnect.gouv.fr/"
            target="_blank"
            class="button--green"
            style="size: 100%;margin-top:10px;margin-bottom:10px" 
            >A propos de FranceConnect</a>
        </b-col>
        <b-col>
          <b-img :src="require('assets/‎image_droite.png')" style="width: 100%;padding-left: 30%;;margin-top:15%;" />
        </b-col>
      </b-row>

      <div class="mb-3 mt-1">
        <b-img :src="require('assets/infographie.png')" style=";width:75%" />
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

