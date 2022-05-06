<template>
  <b-container class="interventionModal">
    <b-row>
      <b-col cols="12" class="text-center">
        <h2 class="mb-3 interventionTitle">
          Edition de l'événement
          <br>
          <b>{{formEvenement.eve_titre}}</b>
        </h2>
      </b-col>
    </b-row>
    <b-row>
        <b-col cols="3">
            <b-form-group
                id="Titre"
                label="Titre:"
                required>
                <br>
                <b-form-input type="text" v-model="formEvenement.eve_titre" />
            </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-form-group
            id="DateDebut"
            label="Date de début de l'événement :"
            required
            label-for="dateDebut"
          >
            <b-form-input
              maxlength="10"
              v-model="formEvenement.eve_date_debut"
              required
              type="date"
              class="text-date input-width"
            />
          </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-form-group
            id="DateFin"
            label="Date de fin de l'événement :"
            required
            label-for="dateFin"
          >
            <b-form-input
              maxlength="10"
              v-model="formEvenement.eve_date_fin"
              required
              type="date"
              class="text-date input-width"
            />
          </b-form-group>
        </b-col>
        <b-col cols="3">
          <br>
          <br>
          <br>
          <b-form-checkbox  switch v-model="formEvenement.eve_toutes_structures" name="check-button" :disabled=true>
            Toutes structures
          </b-form-checkbox>
        </b-col>
      </b-row>    
    <b-row>
      <b-col cols="3" >
          <b-form-checkbox  switch v-model="formEvenement.eve_bloc1" name="check-button">
            Bloc 1 concerné
          </b-form-checkbox>
      </b-col>
      <b-col cols="3" >
          <b-form-checkbox  switch v-model="formEvenement.eve_bloc2" name="check-button">
            Bloc 2 concerné
          </b-form-checkbox>
      </b-col>
      <b-col cols="3" >
          <b-form-checkbox  switch v-model="formEvenement.eve_bloc3" name="check-button">
            Bloc 3 concerné
          </b-form-checkbox>          
      </b-col>
    </b-row>    
    <b-row>
      <b-col cols="12" >
        <div class="mb-3 mt-3" required>
          Cadre d'intervention *
        <b-form-group class="ml-3" >
            <b-form-radio-group
              v-model="formEvenement.eve_cai_id"
              :options="listecadreintervention"

            />
        </b-form-group>
        </div>
      </b-col>
    </b-row>
        <div id="error" v-if="erreurformulaire.length==1">
          Veuillez renseigner le champ :
          <ul>
            <li v-for="erreur in erreurformulaire" :key="erreur">{{ erreur }}</li>
          </ul>
        </div>
        <div id="error" v-if="erreurformulaire.length>1">
          Veuillez renseigner les champs suivants :
          <ul>
            <li v-for="erreur in erreurformulaire" :key="erreur">{{ erreur }}</li>
          </ul>
        </div>    
    <br>
    <br>
    <br>
    <b-row>
      <p class="modal-btns">
        <b-button v-on:click="$modal.hide('editEvenement')">Annuler</b-button>
        <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
        <!--<b-button variant="danger" v-on:click="deleteEvenement">Supprimer</b-button>-->
      </p>
    </b-row>
  </b-container>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";

var loadFormEvenement = function(evenement) {
  let formEvenement = JSON.parse(
    JSON.stringify(
      Object.assign(
        {
          eve_titre: null,
          eve_bloc1: true,
          eve_bloc2: true,
          eve_bloc3: true,
          eve_toutes_structures: true
        },
        evenement
      )
    )
  );
  return formEvenement;
};

export default {
  props: {
    evenementSelectionnee: {
      type: Object,
      default: () => {
        return {};
        //return { nbEnfants: 12 }
      }
    }
  },
  data() {
    return {
      formEvenement: loadFormEvenement(this.$store.state.evenementSelectionnee),
      listecadreintervention: [
        { text: `Tous`, value: "0" },
        { text: `Scolaire`, value: "3" },
        { text: `Péri-scolaire`, value: "1" },
        { text: `Extra-scolaire (clubs, associations ...)`, value: "2" }
      ],
      erreurformulaire: [],
    };
  },
  async mounted() {
    this.loading = true;
  },
  methods: {
    checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      if (! this.formEvenement.eve_titre) {
        this.erreurformulaire.push("Le titre");
        formOK = false;
      } 
      if (! this.formEvenement.eve_date_debut) {
        this.erreurformulaire.push("La date de début");
        formOK = false;
      } 
      if (! this.formEvenement.eve_date_fin) {
        this.erreurformulaire.push("La date de fin");
        formOK = false;
      } 
      if (! this.formEvenement.eve_cai_id) {
        this.erreurformulaire.push("Le cadre d'intervention");
        formOK = false;
      } 

      if (!formOK) {
        console.info('Formulaire invalide', this.erreurformulaire)
        return
      }
      if (this.formEvenement.eve_id == null ) 
      {
        return this.$store.dispatch('post_evenement', this.formEvenement) 
        .then(message => {
          this.$toast.success(`evenement #${this.formEvenement.eve_titre} créée`, [])
          this.$store.dispatch('get_evenements') 
          this.$modal.hide('editEvenement')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la création de l\'événénement', error)
        })
      
      } else {
      return this.$store.dispatch('put_evenement', this.formEvenement) 
        .then(message => {
          console.info(message)
          this.$toast.success(`Evénement #${this.formEvenement.eve_titre} mise à jour`, [])
          this.$store.dispatch('get_evenements')
          this.$modal.hide('editEvenement')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la mise à jour de l\'événement', error)
        })
      }
    },
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
