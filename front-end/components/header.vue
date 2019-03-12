<template>
  <b-container class="mb-3 mt-3">
    <b-row>
        <b-col cols="12">

            <b-img fluid :src="require('assets/Gouvernement_PiloteMS.jpg')" blank-color="rgba(0,0,0,0.5)" />
            <b-img fluid :src="require('assets/header.png')" />
          
        </b-col>

    </b-row>
    <div class="accountMenu">

      <b-dropdown v-if="utilisateurCourant" id="accountBtn" >
        <template slot="button-content">{{utilisateurCourant && utilisateurCourant.prenom}} {{utilisateurCourant && utilisateurCourant.nom}}</template>
        <b-dropdown-item href="#">Mon compte</b-dropdown-item>
        <b-dropdown-item href="#" @click="logout()">Se déconnecter</b-dropdown-item>
        <b-dropdown-item href="#" v-if="utilisateurCourant.profilId==1">Menu Admin</b-dropdown-item>
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
        window.location.replace(response.url)
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
}

#accountBtn button{
  background-color: white;
  color: #666;
  border: 0px solid #FFBA35;
  border-bottom: 1px solid #FFBA35;
  border-radius: 0px;
}

</style>
