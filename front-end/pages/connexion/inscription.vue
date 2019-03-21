<template>
  <section class="container">
    <b-container class="interventions">
      <b-row>
        <b-col cols="6" offset="3" >
            <div class="text-center mb-3">
              <h1>
                Validation de l'inscription
              </h1>
            </div>
            <b-card class="mb-3">
              <b-form-group
                label="Prénom:">

                <b-form-input type="text" v-model="user.prenom" disabled />
              </b-form-group>
              <b-form-group
                label="Nom:">

                <b-form-input type="text" v-model="user.nom" disabled />
              </b-form-group>

              <b-form-group
                label="Date de naissance:">

                <b-form-input type="text" v-model="user.dateNaissance" disabled />
              </b-form-group>
            </b-card>
            <b-card class="mb-3">
              <b-form-group
                id="emailInputGroup"
                label="Email:"
                label-for="emailInput" required>

                <b-form-input
                  id="emailInput"
                  type="email" v-model="user.mail"
                  required
                  placeholder="Email" />
              </b-form-group>


              <b-form-group required id="structNationaleGroup" label="Structure nationale:" label-for="structNatSelect">
                <b-form-select id="structNatSelect"  v-model="formUser.structureId">
                  <option v-for="structure in structures" :key="structure.str_id" :value="structure.str_id">{{ structure.str_libelle}}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group id="structLocaleGroup" label="Structure Locale:" required v-if="isFederation(user.structureId)" label-for="structLocaleInput">
                <b-form-input
                  id="structLocaleInput"
                  type="text" v-model="user.structureLocale"
                  required
                  placeholder="Nom de la structure" />
              </b-form-group>

              <b-form-group id="legalCheckGroup">
                <b-form-checkbox-group v-model="isLegalChecked" id="legalCheck">
                  <b-form-checkbox value="true">« Intervenant du <b>Savoir Rouler à Vélo</b>, je m’engage à construire et réaliser mes sessions d’apprentissage sur la base du socle commun <b>Savoir Rouler à Vélo</b> et à vérifier l’acquisition de l’ensemble des compétences attendues du bloc 1, 2 et 3 pour délivrer l’attestation <b>Savoir Rouler à Vélo</b>». 
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-card>
            <div class="mb-3 text-right">
              <b-button variant="success" @click="confirmRegistration()" :disabled="isFormDisabled" >
                Je valide mon compte
              </b-button>
            </div>
            

        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      structures: [
        { value: 1, text: 'Structure DEMO : DS' }
      ],
      user: JSON.parse(JSON.stringify(this.$store.state.utilisateurCourant)),
      isLegalChecked: "false"
    };
  },
  methods: {
    // Validation de l'inscription
    confirmRegistration(){
      const url = process.env.API_URL + '/connexion/verify'

      return this.$axios.$post(url, this.user)
      .then(async response => {
        await this.$store.dispatch('set_utilisateur', response.user);
        this.$router.push('/interventions')
      }).catch(err => {
        console.log(err)
      })
    },
    // true si la structure sélectionnée est une fédération
    isFederation(id){

       var structure = this.structures.find(str => {
         return str.str_id == id
       })
       if(!structure){return false}
       return structure.federation
      
    }
  },
  mounted(){
    const url = process.env.API_URL + '/structures'
    this.$axios.get(url).then(response => {
      this.structures = response.data.map(struct => {
        return {
          value: struct.str_id,
          text: struct.str_libellecourt,
          federation : struct.str_federation,
          str_id: struct.str_id
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  computed:{
    ...mapState(['structures']),
    // Valide les champs requis
    isFormDisabled(){
      var isDisabled = false
      isDisabled = isDisabled || this.isLegalChecked == 'false' || !this.isLegalChecked
      isDisabled = isDisabled || this.user.structureLocale == '' || !this.user.structureLocale
      isDisabled = isDisabled || this.user.mail == '' || !this.user.mail
      return isDisabled
      
    }
  }

};
</script>

<style>

</style>
