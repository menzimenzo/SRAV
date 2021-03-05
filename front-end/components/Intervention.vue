<template>
  <b-container class="interventionModal">
    <b-row>
      <b-col cols="12" v-if="intervention && intervention.id" class="text-center">
        <h2
          class="mb-3 interventionTitle"
        >Intervention n°{{intervention.id}} du {{intervention.dateIntervention | date}} à {{intervention.commune.com_libellemaj}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <!-- PREMIER BLOC DE SAISIE INTERVENTION -->
      <b-col cols="6" style="border-right: 1px solid #252195;">
        <div class="bv-example-row">
          <p class="text-danger">
            Renseigner les informations relatives à la mise en oeuvre de chacun des 3 blocs du socle commun.<br>
            Seule la réalisation du bloc 3 permet l'impression de l'attestation.
          </p>
        </div>
        <div class="input-group-display">
          <span>Type de bloc * :</span>
          <b-form-select 
            class="liste-deroulante"
            v-model="formIntervention.blocId" 
            :options="listebloc"/>
        </div>
        <br>
        <div>
          Lieu d'intervention :
          <ul>
            <li class="input-group-display">
              <span>Code Postal * :</span>
              <b-form-input
                class="text-cinq-car"
                aria-describedby="inputFormatterHelp"
                maxlength="5"
                v-model="formIntervention.cp"
                type="number"
                placeholder
              ></b-form-input>
            </li>
            <li class="input-group-display">
              <span>Commune * :</span>
                <b-form-select 
                  class="liste-deroulante"
                  v-model="selectedCommune">
                  <option :value="null">-- Choix de la commune --</option>
                  <option
                    v-for="commune in listecommune"
                    :key="commune.cpi_codeinsee"
                    :value="commune.cpi_codeinsee"
                  >{{ commune.com_libellemaj}}</option>
                </b-form-select>
            </li>
          </ul>
        </div>
        <div class="input-group-display">
          <span>Nombre d'enfants * :</span>
            <b-form-input 
              v-model="formIntervention.nbEnfants" 
              type="number" 
              min="0"
              class="text-cinq-car"></b-form-input>
        </div>
        <div class="ageList">
          <ul>
            <li>
              Dont
              <b-form-input 
                v-model="formIntervention.nbGarcons" 
                type="number" 
                min="0"
                class="text-cinq-car"
                ></b-form-input>
              garçons et
              <b-form-input 
                v-model="formIntervention.nbFilles" 
                type="number" 
                min="0"
                class="text-cinq-car"></b-form-input>
              filles
            </li>
            <li>
              Classe d'âge :
              <ul>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input v-model="formIntervention.nbmoinssix" type="number" min="0"></b-form-input>
                  </span>
                  moins de 6 ans
                </li>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input v-model="formIntervention.nbsixhuit" type="number" min="0"></b-form-input>
                  </span>
                  6-7-8 ans
                </li>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input v-model="formIntervention.nbneufdix" type="number" min="0"></b-form-input>
                  </span>
                  9-10 ans
                </li>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input v-model="formIntervention.nbplusdix" type="number" min="0"></b-form-input>
                  </span>
                  plus de 10 ans
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </b-col>

      <!-- SECONDE BLOC DE SAISIE INTERVENTION -->
      <b-col cols="6">
        <div class="input-group-display">
          <span>Date d'intervention * :</span>
          <b-form-input 
            maxlength="10" 
            v-model="formIntervention.dateIntervention" 
            type="date"
            class="text-date date-input-width"></b-form-input>
        </div>
        <div class="mb-3 mt-3">
          Cadre d'intervention *
          <i class="material-icons" :id="randomId" style="cursor: pointer;">info</i> :
          <b-popover :target="randomId" triggers="hover focus">
            <b>Péri-scolaire</b> : concerne les activités organisées durant les jours d’école ainsi que le mercredi, qu’il y ait ou non école le matin.
            <br>
            <b>Extra-scolaire</b> : concerne les accueils organisés les samedis sans école, les dimanches et pendant les congés scolaires.
          </b-popover>
          <b-form-group class="ml-3">
            <b-form-radio-group
              v-model="formIntervention.cai"
              :options="listecadreintervention"
              plain
              stacked
              name="plainStacked"
            />
          </b-form-group>
        </div>
        <div class="input-group-display">
            <span>Site d'intervention :</span>
            <b-form-input 
              v-model="formIntervention.siteintervention" 
              type="text"
              class="text"></b-form-input>
        </div>

        <div class="mb-3 mt-3">
          <span>Commentaires libres :</span>
          <b-form-textarea
            id="textarea1" 
            v-model="formIntervention.commentaire"
            placeholder
            :rows="3"
          ></b-form-textarea>
        </div>
        <div class="mb-3 mt-3"  v-if="! formIntervention.dateMaj">
          <p class="text-info">
            Après mon intervention, je complète ou modifie les champs "nombre d'enfants", "genre" et "classe d'âge"
          </p>
        </div>
        <div class="mb-3 mt-3"  v-if="formIntervention.dateMaj < formIntervention.dateIntervention">
          <p class="text-info">
            Après mon intervention, je complète ou modifie les champs "nombre d'enfants", "genre" et "classe d'âge"
          </p>
        </div>
        <div
          class="mb-3 mt-3"
          v-if="formIntervention.dateMaj"
        >Dernière modification réalisée le {{formIntervention.dateMaj | timestamp}}</div>
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

        <p class="modal-btns">
          <b-button
            v-on:click="resetform(); $modal.hide('editIntervention')"
            v-if="intervention.id"
            title="Réinitialiser le formulaire"
          >Annuler</b-button>
          <b-button
            v-on:click="resetform() "
            v-if="!intervention.id"
            title="Réinitialiser le formulaire"
          >Réinitialiser le formulaire</b-button>
          <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Vue from "vue";
import moment from "moment";

var loadFormIntervention = function(intervention) {
  let formIntervention = JSON.parse(
    JSON.stringify(
      Object.assign(
        {
          commune: null,
          cp: "",
          nbEnfants: "",
          nbGarcons: "",
          nbFilles: "",
          nbmoinssix: "",
          nbsixhuit: "",
          nbneufdix: "",
          nbplusdix: "",
          dateIntervention: null,
          cadreintervention: "",
          blocId: null,
          cai: null,
          commentaire: "",
          siteintervention: ""
        },
        intervention
      )
    )
  );
  let dateIntervention = moment(intervention.dateIntervention);
  formIntervention.dateIntervention = dateIntervention.format("YYYY-MM-DD");

  return formIntervention;
};

export default {
  props: {
    intervention: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    showAttestation() {
      return (
        this.intervention &&
        this.intervention.id &&
        this.intervention.blocId === "3"
      );
    }
  },
  data() {
    return {
      erreurformulaire: [],
      listecommune: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          insee: null,
          cp: null,
          codedep: null
        }
      ],

      formIntervention: loadFormIntervention(this.intervention),
      //<aria-label="texte de l'infobulle">
      // v-b-popover.hover="'I am popover content!'"
      listecadreintervention: [
        { text: `Scolaire`, value: "3" },
        { text: `Péri-scolaire`, value: "1" },
        { text: `Extra-scolaire (clubs, associations ...)`, value: "2" }
      ],
      listebloc: [
        { text: "-- Choix du type de bloc --", value: null },
        { text: "Bloc 1 : Savoir pédaler", value: "1" },
        { text: "Bloc 2 : Savoir circuler", value: "2" },
        { text: "Bloc 3 : Savoir rouler", value: "3" }
      ],
      selectedCommune: null,
      // Nécessaire pour le fonctionnement des popovers quand plusieurs composants intervention sont sur la page
      randomId: "popover-" + Math.floor(Math.random() * 100000)
    };
  },
  methods: {
    showPDF: function(id) {
      console.info("showPDF");
      this.$axios({
        url: process.env.API_URL + "/pdf/" + id,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        var idformate = "";
        var nbzero;
        idformate = id.toString();
        for (nbzero=0;nbzero<7-id.toString().length;nbzero++){
            idformate = "0" + idformate;
        }
        idformate = "SRAV_Attestation-" + idformate;  
        console.log("intervention : " + idformate);      
        link.setAttribute("download", `${idformate}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },

    resetform: function() {
      const action = "reset_interventions";
      console.info({ action });
      return this.$store.commit(action);
    },

    checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      // Vérification du format du code postal TODO alphanum => numérique only + Corse ?
      if (!this.formIntervention.cp.length === 5) {
        this.erreurformulaire.push("Le code postal du lieu d'intervention");
        formOK = false;
      }
      if (!this.formIntervention.commune) {
        this.erreurformulaire.push("La commune du lieu d'intervention");
        formOK = false;
      }
      if (!this.formIntervention.blocId) {
        this.erreurformulaire.push("Le type de bloc");
        formOK = false;
      }
      if (!this.formIntervention.nbEnfants) {
        this.erreurformulaire.push("Le nombre d'enfants évalués");
        formOK = false;
      }
      if (!this.formIntervention.dateIntervention) {
        this.erreurformulaire.push("La date d'intervention");
        formOK = false;
      }
      if (!this.formIntervention.cai) {
        this.erreurformulaire.push("Le cadre d'intervention");
        formOK = false;
      }

      if (!formOK) {
        console.info("Formulaire invalide", this.erreurformulaire);
        return;
      }

      const url = process.env.API_URL + "/interventions";
      const intervention = {
        id: this.formIntervention.id,
        cp: this.formIntervention.cp,
        nbEnfants: this.formIntervention.nbEnfants,
        nbGarcons: this.formIntervention.nbGarcons,
        nbFilles: this.formIntervention.nbFilles,
        nbmoinssix: this.formIntervention.nbmoinssix,
        nbsixhuit: this.formIntervention.nbsixhuit,
        nbneufdix: this.formIntervention.nbneufdix,
        nbplusdix: this.formIntervention.nbplusdix,
        commune: this.formIntervention.commune,
        cai: this.formIntervention.cai,
        blocId: this.formIntervention.blocId,
        dateIntervention: this.formIntervention.dateIntervention,
        commentaire: this.formIntervention.commentaire,
        siteintervention: this.formIntervention.siteintervention
      };

      const action = intervention.id ? "put_intervention" : "post_intervention";
      console.info({ intervention, action });
      return this.$store
        .dispatch(action, intervention)
        .then(async serverIntervention => {
          console.info(serverIntervention);
          var action = [];
          if (intervention.blocId == "3") {
            action.push({
              text: "Télécharger l'attestation",
              onClick: (e, toastObject) => {
                this.showPDF(serverIntervention.id);
              },
              class: "toastLink"
            });
          }
          console.log(serverIntervention);
          var interventionLabel = serverIntervention.id
            ? "#" + serverIntervention.id
            : "";
          this.$toast.success(`Intervention ${interventionLabel} enregistrée`, {
            action
          });
          this.resetform();
          this.$modal.hide("editIntervention");
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la sauvegarde de l'intervention",
            error
          );
        });
    },
    // Get liste des communes correspondant au code postal
    recherchecommune: function() {
      console.info("Recherche de la commune");
      if (this.formIntervention.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listecommune?codepostal=" +
          this.formIntervention.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then(response => {
            this.listecommune = response.communes;
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listecommune = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    }
  },
  watch: {
    intervention(intervention) {
      let formIntervention = JSON.parse(
        JSON.stringify(
          Object.assign(
            {
              commune: null,
              cp: "",
              nbEnfants: "",
              nbGarcons: "",
              nbFilles: "",
              nbmoinssix: "",
              nbsixhuit: "",
              nbneufdix: "",
              nbplusdix: "",
              dateIntervention: null,
              cadreintervention: "",
              blocId: null,
              cai: null,
              commentaire: "",
              siteintervention: ""
            },
            intervention
          )
        )
      );
      formIntervention.dateIntervention = new Date(
        formIntervention.dateIntervention
      );
      Vue.set(this, "formIntervention", loadFormIntervention(intervention));
    },
    "formIntervention.cp"(cp) {
      this.recherchecommune();
    },
    selectedCommune() {
      this.formIntervention.commune = this.listecommune.find(commune => {
        return commune.cpi_codeinsee == this.selectedCommune;
      });
    }
  },
  mounted() {
    this.recherchecommune().then(res => {
      if (this.formIntervention && this.formIntervention.commune) {
        this.selectedCommune = this.formIntervention.commune.cpi_codeinsee;
      }
    });
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
.input-group-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.input-group-display span {  
  margin-top: 5px;
}
ul {
  list-style-type: none;
}
.date-input-width {
  width: 190px;
}

</style>
