<template>
  <b-container class="interventionModal">
    <b-col cols="12" class="text-center">
      <h2 class="mb-3 interventionTitle">
        Edition de la structure
        <br>
        <b>{{formStruct.str_libellecourt}}</b>
      </h2>
    </b-col>

    <div class="mb-3 mt-3">
      Libelle :
      <b-form-input
        aria-describedby="inputFormatterHelp"
        v-model="formStruct.str_libelle"
        type="text"
      ></b-form-input>
    </div>

    <div class="mb-3 mt-3">
      Libelle Court :
      <b-form-input
        aria-describedby="inputFormatterHelp"
        v-model="formStruct.str_libellecourt"
        type="text"
      ></b-form-input>
    </div>
    <b-row>
      <b-col>
        <div class="mb-3 mt-3">
          <b-form-checkbox switch v-model="formStruct.str_actif" name="check-button">
            structure active
            <b></b>
          </b-form-checkbox>
        </div>
      </b-col>
      <b-col>
        <div class="mb-3 mt-3">
          <b-form-checkbox switch v-model="formStruct.str_federation" name="check-button">
            fédération
            <b></b>
          </b-form-checkbox>
        </div>
      </b-col>
    </b-row>
     &nbsp;
    <b-row>
    </b-row>
    <b-row>
          <p class="modal-btns">
        <b-button v-on:click="$modal.hide('editStruct')">Annuler</b-button>
        <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
      </p>
    </b-row>
  </b-container>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";

var loadFormStruct = function(structure) {
  let formStruct = JSON.parse(
    JSON.stringify(
      Object.assign(
        {
          str_libelle: null,
          str_libellecourt: null,
          str_actif: "",
          str_federation: ""
        },
        structure
      )
    )
  );
  return formStruct;
};

export default {
  props: {
    structureSelectionnee: {
      type: Object,
      default: () => {
        return {};
        //return { nbEnfants: 12 }
      }
    }
  },
  data() {
    return {
      formStruct: loadFormStruct(this.$store.state.structureSelectionnee),

    };
  },
  methods: {
    checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      if (! this.formStruct.str_libelle) {
        this.erreurformulaire.push("Le libellé");
        formOK = false;
      } 
      if (! this.formStruct.str_libellecourt) {
        this.erreurformulaire.push("Le libellé court");
        formOK = false;
      }      
   
      if (!formOK) {
        console.info('Formulaire invalide', this.erreurformulaire)
        return
      }
      
      if (this.formStruct.str_id == null ) 
      {
        return this.$store.dispatch('post_structure', this.formStruct) 
        .then(message => {
          console.info(message)
          this.$toast.success(`structure #${this.formStruct.str_libelle} créée`, [])
          this.$store.dispatch('get_structures') 
          this.$modal.hide('editStruct')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la création de la structure', error)
        })
      
      } else {
      return this.$store.dispatch('put_structure', this.formStruct) 
        .then(message => {
          console.info(message)
          this.$toast.success(`structure #${this.formStruct.str_libelle} mise à jour`, [])
          this.$store.dispatch('get_structures')
          this.$modal.hide('editStruct')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la mise à jour de la structure', error)
        })
      }
    }
  }
};
</script>

<style>
.interventionModal {
  padding: 30px;
}
.modal-btns {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.interventionTitle {
  color: #252195;
}
</style>
