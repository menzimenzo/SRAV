<template>
    <b-container class="interventionModal">
      <b-row>
        <!-- PREMIER BLOC DE SAISIE INTERVENTION -->
        <b-col cols="6" style="border-right: 1px solid #252195;">
              Libellé * :
              
              <span class="text-cinq-car">
                <b-form-input v-model="formStructure.libelle" type="texte" ></b-form-input>
              </span>
              
        </b-col>
      </b-row>
    </b-container>


</template>
<script>
import Vue from 'vue'
import moment from 'moment'

var loadFormStructure = function(structure){
  let formStructure = JSON.parse(JSON.stringify(Object.assign({
       libelle: null,
       libellecourt: '',
       actif: '',
       federation: ''
    }, structure)))
  return formStructure
}

export default {
  props: {
    structure: {
      type: Object,
      default: () => {
        return {}
        //return { nbEnfants: 12 }
      }
    }
  },
  data() {
    return {
      erreurformulaire:[],
  

     formIntervention: loadFormIntervention(this.structure),
      //<aria-label="texte de l'infobulle">
      // v-b-popover.hover="'I am popover content!'"
       };
  },
  methods: {
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
