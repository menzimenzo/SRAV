<template>
  <b-container>
    <b-row class="text-center">
      <b-col cols="3">
        <b-img :src="require('assets/image_gauche.png')" style="width: 100%;  margin:15% 0; "/>
      </b-col>
      <b-col cols="6">
        <p class="srav-welcome-title">Je suis Intervenant Savoir Rouler à Vélo, <br>je m’identifie et renseigne<br>mes interventions</p>
      </b-col>
      <b-col cols="3">
        <b-img :src="require('assets/‎image_droite.png')" style="width: 100%;margin:15% 0;" />
      </b-col>
    </b-row>

    <b-row class="text-center">
      <b-col cols="12">
        <b-img class="fcBtn" @click="connexionutilisateur()"  fluid  :src="require('assets/FCboutons-10.png')" border="0" style="size: 100%;" />
        <br>
        <a
          href="https://franceconnect.gouv.fr/"
          target="_blank"
          style="text-align:center;" 
          >A propos de FranceConnect</a>
      </b-col>
    </b-row>

    <b-row class="text-center">
      <b-col cols="12">
        <span class="otherConnexion">Ou</span>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="8" offset-md="2">
        <connectionForm @submit="login"/>
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
  components: {
    connectionForm: () => import('~/components/connectionForm.vue')
  },
  data() {
    return {
    };
  },
//
//  RECHERCHE DE LA COMMUNE PAR CODE POSTAL
//
  methods: {
    connexionutilisateur: function() {
      console.info("Recherche de l'utilisateur");
      const url = process.env.API_URL + '/connexion/login'
      console.info(url);
      this.$axios.$get(url)
      .then(response => {
        window.location.replace(response.url)
      }).catch(err => {
        console.log(err)
      })
    },
    login: function(e) {
      return this.$store.dispatch('login', e)
        .then(() => {
            console.log('login success!')
            this.formErrors = []
            this.$modal.hide('connexionForm')
            return this.$router.push('/interventions')
        })
        .catch((e) => {
            console.log('Error during login process', e.stack)
        })
        .finally(() => {
            this.loading = false
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
  margin-bottom: 10px;
}
.srav-welcome-title {
  margin-top: 5vw;
  font-size: 150%;
  text-transform: uppercase;
  color: rgb(0,0,128)
}
.link-alignement {
  min-width: 80%;
  min-height: 56px;
}
.otherConnexion {
  font-size: 30px;
  color: #e5425a;
  margin: 20px 0;
}
.otherConnexion:before, .otherConnexion:after {
    display: inline-block;
    margin: 0 0 8px 0;
    height: 3px;
    content: " ";
    text-shadow: none;
    background-color: #e5425a;
    width: 200px;
}
.otherConnexion:before {
  margin-right: 20px;
}
.otherConnexion:after {
  margin-left: 20px;
}
@media screen and (min-width: 2000px) {
  .srav-welcome-title {
    margin-top: 100px;
  }
}
</style>

