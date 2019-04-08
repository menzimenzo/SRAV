<template>
    <b-container class="interventionModal">
      <b-row>
        <b-col cols="12" class="text-center">
          <h2 class="mb-3 interventionTitle">Edition de l'utilisateur <br><b>{{formUser.mail}}</b></h2>
        </b-col>
      </b-row>
      <b-row>
          <b-col style="border-right: 1px solid #252195;"> 
            <div class="mb-3 mt-3">
              Nom :

                <b-form-input readonly
                  aria-describedby="inputFormatterHelp"
                  v-model="formUser.nom"
                  type="text"
                  ></b-form-input>
              
            </div>
            <div class="mb-3 mt-3">
              Prénom :

              <b-form-input readonly
                aria-describedby="inputFormatterHelp"
                v-model="formUser.prenom"
                type="text"
                ></b-form-input>
              
            </div>
            <div class="mb-3 mt-3">
              Courriel :

                <b-form-input readonly
                  aria-describedby="inputFormatterHelp"
                  v-model="formUser.mail"
                  type="text"
                  ></b-form-input>
              
            </div>
            <div class="mb-3 mt-3">
              Statut utilisateur : <b-form-select v-model="formUser.statut" :options="liststatus"/>
            </div>
            <div class="mb-3 mt-3">
              <b-form-checkbox switch v-model="formUser.validated" name="check-button">
                Utilisateur validé <b></b>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col>
              
            <div class="mb-3 mt-3">
              Profil : <b-form-select v-model="formUser.profil" :options="listeprofil"/>
            </div>
            <div class="mb-3 mt-3">
              Structure : 
              <b-form-select v-model="formUser.structure">
                <option v-for="structure in structures" :key="structure.str_id" :value="structure.str_id">{{ structure.str_libelle}}</option>
              </b-form-select>
            </div>
            <div class="mb-3 mt-3" v-if="isFederation(formUser.structure)">
              Structure locale : 
              <b-form-input
                  id="structLocaleInput"
                  type="text" v-model="formUser.structureLocale"
                  required
                  placeholder="Nom de la structure" />
            </div>
          </b-col>

      </b-row> 
      
      <p class="modal-btns">
        <b-button v-on:click="$modal.hide('editUser')">Annuler</b-button>
        <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
      </p>
    </b-container>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import { mapState } from 'vuex'

var loadFormUser = function(utilisateur){
  let formUser = JSON.parse(JSON.stringify(Object.assign({
    nom: '',
    prenom:'',
    mail:'',
    naissance:'',
    profil: '',
    structure: '',
    structureLocale: '',
    statut: '',
    validated: ''
    }, utilisateur)))
    return formUser
}

export default {
  props: {
    utilisateurSelectionne: {
      type: Object,
      default: () => {
        return {}
        //return { id: 5 }
      }
    }
  },
  data() {
    return {
       formUser: loadFormUser(this.$store.state.utilisateurSelectionne),
       listeprofil: [
         { text: 'Administrateur', value: '1' },
         { text: 'Partenaire', value: '2' },
         { text: 'Intervenant', value: '3' }
       ],
       liststatus: [
         { text: 'Actif', value: '1' },
         { text: 'Bloqué', value: '2' }
       ]

    };
  },
  methods: {
  checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      if (! this.formUser.nom) {
        this.erreurformulaire.push("Le nom");
        formOK = false;
      } 
      if (! this.formUser.prenom) {
        this.erreurformulaire.push("Le prénom");
        formOK = false;
      }      
      if (! this.formUser.mail) {
        this.erreurformulaire.push("Le mail");
        formOK = false;
      }
   
      if (!formOK) {
        console.info('Formulaire invalide', this.erreurformulaire)
        return
      }
      
      return this.$store.dispatch('put_user', this.formUser) 
        .then(message => {
          console.info(message)
          this.$toast.success(`Utilisateur #${this.formUser.mail} mis à jour`, [])
          this.$store.dispatch('get_users') 
          this.$modal.hide('editUser')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la mise à jour de l\'utilisateur', error)
        })
    },
    // true si la structure sélectionnée est une fédération
    isFederation(id){
       var structure = this.structures.find(str => {
         return str.str_id == id
       })
       if(!structure){return false}
       return structure.str_federation
      
    }
  },
  computed: {...mapState(['structures'])},
  async mounted() {
    await this.$store.dispatch('get_structures')
    this.loading = false
  }


};
</script>

<style>
.interventionModal{
  padding: 30px;
}
.modal-btns{
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.interventionTitle{
  color: #252195;
}
</style>
