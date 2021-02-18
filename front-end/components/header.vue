<template>
  <b-container>
    <b-row class="mt-4 mb-4">
        <b-col cols="12" class="text-center">
          <nuxt-link to="/" title="Afficher la page d'accueil" style="text-decoration: none" >
              <b-img fluid :src="require('assets/Gouvernement_PiloteMS.jpg')" blank-color="rgba(0,0,0,0.5)" />
            <!-- <b-img fluid :src="require('assets/header.png')" /> -->
            <!-- <b-img fluid :src="require('assets/header-20191403.png')" /> -->
            <b-img fluid :src="require('assets/LogoSavoirRoulerAVelo.png')" style="max-width: 8,75rem;" />
            <b-img fluid :src="require('assets/header_alpha.png')" style="border-left: 2px solid #121D45; padding-left: 10px;" />
          </nuxt-link>
        </b-col>
    </b-row>
    <div class="accountMenu" v-if="utilisateurCourant">
      <div >
        <nuxt-link to="/admin" >
          <b-button variant="outline-primary" v-if="utilisateurCourant.profilId == 1" class="settingsBtn"><i class="material-icons" >settings</i> Espace admin</b-button>
        </nuxt-link>
        <nuxt-link to="/partenaire" v-if="utilisateurCourant.profilId == 2">
          <b-button variant="outline-primary" class="settingsBtn"><i class="material-icons" >settings</i> Espace partenaire</b-button>
        </nuxt-link>
      </div>
      <b-dropdown  id="accountBtn"  >
        <template slot="button-content">{{utilisateurCourant && utilisateurCourant.prenom}} {{utilisateurCourant && utilisateurCourant.nom}}</template>
        <b-dropdown-item to="/connexion/profil">
          Mon compte
        </b-dropdown-item>
        <b-dropdown-item href="#" @click="logout()">Se déconnecter</b-dropdown-item>
      </b-dropdown>
    </div>
  </b-container>
  
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['utilisateurCourant']),
  data() {
    return {
      utilisateurinfo: ''
    }
  },
  async mounted() {
    console.info("mounted header", { interventions: this.interventions});

  },
  methods: {
    logout(){
      return this.$axios.$get(process.env.API_URL + '/connexion/logout').then(async response => {
        await this.$store.dispatch('logout')
        response.url ? window.location.replace(response.url) : this.$router.push('/')
      })
    }
  }
};
</script>


<style>
.accountMenu{
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 10;
  display: inline-flex;
}

#accountBtn button{
  background-color: white;
  color: #666;
  border: 0px solid #FFBA35;
  border-bottom: 1px solid #FFBA35;
  border-radius: 0px;
}

.settingsBtn{
  margin-right: 10px;
  background-color: white;
}

.settingsBtn i {
  position: relative;
  top: 4px;
}

</style>
