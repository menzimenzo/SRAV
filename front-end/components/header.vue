<template>
  <b-container fluid>
    <b-row class="main-header">
      <b-col cols="12" class="text-center">
        <nuxt-link to="/" title="Afficher la page d'accueil" style="text-decoration: none" >
            <!--<b-img fluid :src="require('assets/Gouvernement_PiloteMS.jpg')" blank-color="rgba(0,0,0,0.5)" />-->
          <!-- <b-img fluid :src="require('assets/header.png')" /> -->
          <!-- <b-img fluid :src="require('assets/header-20191403.png')" /> -->
          <b-img fluid :src="require('assets/SRAV_Label_RF.png')" style="max-width: 8,75rem;" />
          <!--<b-img fluid :src="require('assets/header_alpha.png')" style="border-left: 2px solid #121D45; padding-left: 10px;" />-->
          <b-img fluid :src="require('assets/header_alpha.png')" style="padding-left: 10px;" />
        </nuxt-link>
      </b-col>
      <div class="navbar" v-if="utilisateurCourant">
        <nav class="main-navigation">
            <div class="nav-menu">
                <ul>
                    <!-- TOUS LES PROFILS -->
                    <li>
                      <!--<a href="/modeemploi"><b-img fluid :src="require('assets/ico_mode_emploi_48x48.png')" blank-color="rgba(0,0,0,0.5)" img-alt="Interventions" width="50%"/>Mode d'emploi</a>-->
                      <nuxt-link to="/interventions"  class="menuLink">
                        <b-img fluid :src="require('assets/menu-interventions.png')" blank-color="rgba(0,0,0,0.5)" img-alt="Interventions" />
                        Interventions
                      </nuxt-link>
                    </li>
                    <!-- PROFIL ADMIN -->
                    <li v-if="utilisateurCourant.profilId == 1">
                      <nuxt-link to="/admin"   class="menuLink">
                        <b-img fluid :src="require('assets/menu-partenaire.png')" blank-color="rgba(0,0,0,0.5)"  img-alt="Espace Admin" />
                        Espace Admin
                      </nuxt-link>
                    </li>
                    <!-- PROFIL PARTENAIRE -->
                    <li v-if="utilisateurCourant.profilId == 2">
                      <nuxt-link to="/partenaire"  class="menuLink">
                        <b-img fluid :src="require('assets/menu-partenaire.png')" blank-color="rgba(0,0,0,0.5)" img-alt="Espace partenaire" />
                        Espace Partenaire
                      </nuxt-link>
                    </li>
                    <!-- PROFIL REFERENTS -->
                    <li v-if="utilisateurCourant.profilId == 4">
                      <nuxt-link to="/admin"   class="menuLink">
                        <b-img fluid :src="require('assets/menu-referent.png')" blank-color="rgba(0,0,0,0.5)"  img-alt="Espace Référent" />
                        Espace Référent
                      </nuxt-link>
                    </li>

                </ul>
            </div>
        </nav>
    </div>    
  </b-row>
  <div class="accountMenu" v-if="utilisateurCourant">
    <!--
      <div class="nav-menu">
        <nuxt-link to="/admin" >
          <b-button variant="outline-primary" v-if="utilisateurCourant.profilId == 1" class="settingsBtn"><i class="material-icons" >settings</i> Espace admin</b-button>
        </nuxt-link>
        <nuxt-link to="/admin" >
          <b-button variant="outline-primary" v-if="utilisateurCourant.profilId == 4" class="settingsBtn"><i class="material-icons" >badge</i> Espace référent</b-button>
        </nuxt-link>
        <nuxt-link to="/partenaire" v-if="utilisateurCourant.profilId == 2">
          <b-button variant="outline-primary" class="settingsBtn"><i class="material-icons" >settings</i> Espace partenaire</b-button>
        </nuxt-link>
      </div>
      -->
      <b-dropdown  id="accountBtn"  >
        <template slot="button-content">{{utilisateurCourant && utilisateurCourant.prenom}} {{utilisateurCourant && utilisateurCourant.nom}}</template>
        <b-dropdown-item to="/connexion/profil">
          Mon compte
        </b-dropdown-item>
        <b-dropdown-item to="/connexion/structures" v-if="utilisateurCourant.profilId == 3">
          Mes structures
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
    },
    messtructures(){
      return this.$axios.$get(process.env.API_URL + '/connexion/structures').then(async response => {
        await this.$store.dispatch('structures')
        response.url ? window.location.replace(response.url) : this.$router.push('/')
      })
    }
  }
};
</script>


<style>
.main-header {
  margin-bottom: 20px;
}
.accountMenu {
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 10;
  display: inline-flex;
}
.accountMenu .menuLink img {
  margin-right: 10px;
}
.accountMenu .menuLink {
  position: relative;
  text-decoration: none;
  margin-right: 10px;
  padding-right: 5px;
  transition: all ease-in-out 0.3s;
}
.accountMenu .menuLink:hover {
  color: #FFBA35;
}
.accountMenu .menuLink:hover::after {
  content: "";
  position: absolute;
  left:0;
  width: 100%;
  bottom: 0;
  border: 1px solid #FFBA35;
}
#accountBtn button{
  background-color: white;
  color: #666;
  border: 0px solid #FFBA35;
  border-bottom: 1px solid #FFBA35;
  border-radius: 0px;
}
.settingsBtn {
  margin-right: 10px;
  background-color: white; 
}
.settingsBtn i {
  position: relative;
  top: 4px;
}

.navbar {
    background-color: #f7f5e7;
    margin: 0 auto;
    max-width: 1600px;
    width: 100%;
}
 
.main-navigation {
    clear: both;
    margin: 0 auto;
    max-width: 1080px;
    min-height: 45px;
    position: relative;
}
 
ul.nav-menu,
div.nav-menu > ul {
    margin: 0;
    padding: 0 40px 0 0;
}
 
.nav-menu li {
    display: inline-block;
    position: relative;
    display:inline-block;
  
}
 
.nav-menu li a {
    color: #141412;
    display: block;
    font-size: 15px;
    line-height: 1;
    padding: 1px 1px;
    text-decoration: none;


}
 
.nav-menu li:hover > a,
.nav-menu li a:hover,
.nav-menu li:focus > a,
.nav-menu li a:focus {
    background-color: #220e10;
    color: #fff;

}
 
.nav-menu .children {
    background-color: #220e10;
    border: 2px solid #f7f5e7;
    border-top: 0;
    padding: 0;
    position: absolute;
    left: -2px;
    z-index: 99999;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
}
 
ul.nav-menu ul a,
.nav-menu ul ul a {
    color: #fff;
    margin: 0;
    width: 200px;
}
 
ul.nav-menu ul a:hover,
.nav-menu ul ul a:hover,
ul.nav-menu ul a:focus,
.nav-menu ul ul a:focus {
    background-color: #db572f;
}
 
ul.nav-menu li:hover > ul,
.nav-menu ul li:hover > ul,
ul.nav-menu .focus > ul,
.nav-menu .focus > ul {
    clip: inherit;
    overflow: inherit;
    height: inherit;
    width: inherit;
}
</style>
