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
            Déclarer uniquement le bloc 3 lorsque l’ensemble du programme est réalisé avec un même groupe d’enfants, sinon, déclarer chacun des blocs réalisés et le nombre d’enfants correspondant.<br>
            Seule la réalisation du bloc 3 permet l'impression de l'attestation.
          </p>
        </div>
        <div>
          J'interviens pour la structure * :
            <!-- STRUCTURE -->
            <b-form-select 
              class="liste-deroulante"
              v-model="formIntervention.ustid"
              :disabled="this.isVerrouille">
              <option :value="null">-- Choix de la structure --</option>
              <option
                style="width: 25em"
                v-for="structure in listestructures"
                :key="structure.ust_id"
                :value="structure.ust_id"
              >{{ structure.str_libellecourt}} - {{ structure.uti_structurelocale}}{{ structure.tco_libelle}} - {{ structure.com_libelle}} {{ structure.dep_libelle}}{{ structure.eta_nom}}{{ structure.epci_libelle }}</option>
            </b-form-select>
        </div>     
        <div class="input-group-display">
          <span>Type de bloc * :</span>
          <b-form-select 
            :disabled="this.isVerrouille"
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
                :disabled="this.isVerrouille"
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
                  :disabled="this.isVerrouille"
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
              :disabled="this.isVerrouille"
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
                :disabled="this.isVerrouille"
                v-model="formIntervention.nbGarcons" 
                type="number" 
                min="0"
                class="text-cinq-car"
                ></b-form-input>
              garçons et
              <b-form-input 
                :disabled="this.isVerrouille"
                v-model="formIntervention.nbFilles" 
                type="number" 
                min="0"
                class="text-cinq-car"
                ></b-form-input>
              filles
            </li>
            <li>
              Classe d'âge :
              <ul>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input :disabled="this.isVerrouille" v-model="formIntervention.nbmoinssix" type="number" min="0"></b-form-input>
                  </span>
                  moins de 6 ans
                  <span class="text-cinq-car">
                    <b-form-input :disabled="this.isVerrouille" v-model="formIntervention.nbsixhuit" type="number" min="0"></b-form-input>
                  </span>
                  6-7-8 ans
                </li>
                <li>
                </li>
                <li>
                  <span class="text-cinq-car">
                    <b-form-input :disabled="this.isVerrouille" v-model="formIntervention.nbneufdix" type="number" min="0"></b-form-input>
                  </span>
                  9-10 ans
                                    <span class="text-cinq-car">
                    <b-form-input :disabled="this.isVerrouille" v-model="formIntervention.nbplusdix" type="number" min="0"></b-form-input>
                  </span>
                  plus de 10 ans
                </li>
                <li>

                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="mb-3 mt-3">
         <b-form-group >
            Des enfants sont en situation de handicap *
            <b-form-radio-group 
              :disabled="this.isVerrouille"
              v-model="isHandicap" 
              >
              <b-form-radio value="true">Oui</b-form-radio>
              <b-form-radio value="false">Non</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div >
        <div v-if="isHandicap == true || isHandicap == 'true'">
             Nombre d'enfants concernés * : 
              <b-form-input 
                :disabled="this.isVerrouille"
                v-model="formIntervention.nbenfantshandicapes" 
                type="number" 
                min="1"
                class="text-cinq-car" 
                >
              </b-form-input>
        </div>
        <div class="mb-3 mt-3">
         <b-form-group >
            Intervention en QPV (Quartier Prioritaire de Politique de Ville) *
            <b-form-radio-group 
              :disabled="this.isVerrouille"
              v-model="isQpv" 
              >
              <b-form-radio value="true">Oui</b-form-radio>
              <b-form-radio value="false">Non</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div >
        <li class="input-group-display" v-if="isQpv == true || isQpv == 'true'">
          <span>Quartier concerné * :</span>
            <b-form-select 
              :disabled="this.isVerrouille"
              class="liste-deroulante"
              v-model="formIntervention.qpvcode">
              <option :value="null">-- Choix du QPV --</option>
              <option
                v-for="qpv in listeQPV"
                :key="qpv.qpv_code"
                :value="qpv.qpv_code"
              >{{ qpv.qpv_libelle }}</option>
            </b-form-select>
        </li>            
      </b-col>

      <!-- SECONDE BLOC DE SAISIE INTERVENTION -->
      <b-col cols="6">
        <div class="input-group-display">
          <span>Date d'intervention * :</span>
          <b-form-input 
            maxlength="10" 
            :disabled="this.isVerrouille"
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
              :disabled="this.isVerrouille"
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
              :disabled="this.isVerrouille"
              v-model="formIntervention.siteintervention" 
              type="text"
              class="text"></b-form-input>
        </div>

        <div class="mb-3 mt-3">
          <span>Commentaires libres :</span>
          <b-form-textarea
            :disabled="this.isVerrouille"
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
        <div class="bv-example-row">
          <p class="text-danger">
            Une fois votre intervention déclarée, si besoin, vous avez jusqu'à <b>5 jours après la date de l'intervention pour la modifier</b>.<br>
            Pour les interventions déclarées à postériori, vous avez <b>5 jours maximum après la date effective de l'intervention</b> pour effectuer la saisie.
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

        <p>
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
          <b-button :disabled="this.isVerrouille" variant="success" v-on:click="checkform">Enregistrer</b-button>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import { mapState } from "vuex";

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
    ...mapState(["utilisateurCourant"]),
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
      isHandicap: {
        type: Boolean,
        default: null
      },
      isQpv: {
        type: Boolean,
        default: null
      },
      isVerrouille: true,
      parametreNbMoisMaxAnticip: null,
      parametreNbJoursMaxRetroSaisie: null,
      parametreNbJoursMaxModifInter: null,
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
      listeQPV: [],
      formIntervention: loadFormIntervention(this.intervention),
      //<aria-label="texte de l'infobulle">
      // v-b-popover.hover="'I am popover content!'"
      listecadreintervention: [
        { text: `Scolaire`, value: "3" },
        { text: `Péri-scolaire`, value: "1" },
        { text: `Extra-scolaire (clubs, associations ...)`, value: "2" }
      ],
      listebloc:  [{ text: "-- Choisissez votre structure --", value: null }],
      listeouinon: [
        { text: `Oui`, value: "true" },
        { text: `Non`, value: "false" }
      ],
      listestructures: [],
      selectedCommune: null,
      selectedQPV: null,
      //selectedStructure: null,
      selectedCollectivite: null,
      selectedEtablissement: null,
      //isHandicap: null,
      //isQPV: true,
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
      this.isQpv = null
      this.isHandicap = null
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
      else
      {

        var date1 = this.formIntervention.dateIntervention;
        var dateDelaiMaxAnticip = new Date()
        dateDelaiMaxAnticip.setMonth(dateDelaiMaxAnticip.getMonth() + this.parametreNbMoisMaxAnticip);
        var sdateDelaiMaxAnticip = dateDelaiMaxAnticip.toISOString().slice(0, 10)
        var idateDelaiMaxAnticip = Number(sdateDelaiMaxAnticip.toString().replaceAll("-",""))
        var idate1 = Number(date1.toString().replaceAll("-",""))
        // Si la idateDelaiMaxAnticip (aujourd'hui + X mois) - date d'intervention > 0 Alors on a dépassé les X mois d'anticipation
        /*
        console.log("Delai:", this.parametreNbMoisMaxAnticip)
        console.log("idateDelaiMaxAnticip:", idateDelaiMaxAnticip)
        console.log("idate1:", idate1)
        console.log("Delta:", idateDelaiMaxAnticip-idate1)
        */
        if (this.utilisateurCourant.profilId != 1)
        {
          if (idateDelaiMaxAnticip-idate1<0) 
          {
            formOK = false;
            this.erreurformulaire.push("La date d'intervention ne peut être anticipée de plus de " + this.parametreNbMoisMaxAnticip + " mois");
          }
        }

        var dateRetroSaisie = new Date()
        dateRetroSaisie.setDate(dateRetroSaisie.getDate() - this.parametreNbJoursMaxRetroSaisie);
        var sdateRetroSaisie = dateRetroSaisie.toISOString().slice(0, 10)
        var idateRetroSaisie = Number(sdateRetroSaisie.toString().replaceAll("-",""))
        // Si la dateRetroSaisie (aujourd'hui - X jours) - date d'intervention <= 0 Alors on a dépassé les 5 jours pour la rétro saisie
        /*
        console.log("Delai:", this.parametreNbJoursMaxRetroSaisie)
        console.log("idateRetroSaisie:", idateRetroSaisie)
        console.log("idate1:", idate1)
        console.log("Delta:", idate1-idateRetroSaisie)
        */
        if (this.utilisateurCourant.profilId != 1)
        {
          if (idate1-idateRetroSaisie<0) 
          {
            formOK = false;
            this.erreurformulaire.push("La date d'intervention ne peut être antérieure de plus de " + this.parametreNbJoursMaxRetroSaisie + " jours");
          }
        }
        
      }
      console.log("this.isHandicap",this.isHandicap)
      if (this.isHandicap == null) 
      {
        formOK = false;
        this.erreurformulaire.push("Enfants en situation de handicap");
      }
      else
      {
        if (this.isHandicap == 'true' || this.isHandicap == true) {
          if (!this.formIntervention.nbenfantshandicapes) 
          {
            formOK = false;
            this.erreurformulaire.push("Nombre d'enfants en situation de handicap");
          }
        }
      }

      if (this.isQpv == null) 
      {
        formOK = false;
        this.erreurformulaire.push("Intervention en QPV");
      }
      else
      {
        console.log("this.formIntervention.isqpv",Boolean(this.formIntervention.isqpv))
        if (this.isQpv == 'true' || this.isQpv == true) {
          if (!this.formIntervention.qpvcode) 
          {
            formOK = false;
            this.erreurformulaire.push("QPV associé à la commune d'intervention");
          }
        }
      }

      if (!this.formIntervention.cai) {
        this.erreurformulaire.push("Le cadre d'intervention");
        formOK = false;
      }
      if (!this.formIntervention.ustid) {
        this.erreurformulaire.push("La structure d'intervention est obligatoire");
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
        siteintervention: this.formIntervention.siteintervention,
        isenfantshandicapes: this.formIntervention.isenfantshandicapes,
        nbenfantshandicapes: this.formIntervention.nbenfantshandicapes,
        isqpv: this.formIntervention.isqpv,
        qpvcode: this.formIntervention.qpvcode,
        ustid: this.formIntervention.ustid
      };
      console.log(intervention)
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
    },
    rechercheqpv: function() {
      console.info("Recherche de la qpv");
      if (this.formIntervention.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listeqpv?codepostal=" +
          this.formIntervention.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then(response => {
            this.listeQPV = response.qpv;
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des qpv",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listeQPV = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    },
  chargeUtiStructures(iduti) {
    const url =  process.env.API_URL + "/structures/user/" + iduti;
    console.info(url);
    return this.$axios.$get(url).then(response => {
            this.listestructures = response.structures;
            // Si une seule structure, on la selectionne par défaut
            if (this.listestructures.length == 1) {
              this.formIntervention.ustid = this.listestructures[0].ust_id
              console.log("Une seule structure : ", this.formIntervention.ustid)
              this.ChargeBlocsStructure(this.formIntervention.ustid)
            }
            this.loading = false;
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
    },
    ChargeBlocsStructure(ustid) {
      this.listebloc = []

      if (ustid) {
        /*
          { text: "-- Choix du type de bloc --", value: null },
          { text: "Bloc 1 : Savoir pédaler", value: "1" },
          { text: "Bloc 2 : Savoir circuler", value: "2" },
          { text: "Bloc 3 : Savoir rouler", value: "3" }]         
        */
        const url =  process.env.API_URL + "/structures/ust/" + ustid;
        var structureSelectionne
        return this.$axios.$get(url)
        .then(response => {
          structureSelectionne = response.structure;
          this.listebloc =  [{ text: "-- Choix du type de bloc --", value: null }]         
          // Si une seule structure, on la selectionne par défaut
          if (structureSelectionne.str_aut_bloc1 == true) {
            this.listebloc.push({ text: "Bloc 1 : Savoir pédaler", value: "1" });
          }
          else
          {
            // Si un petit malin a pensé à mettre le bloc 3 sur une autre structure et qu'il 
            // change de structure alors qu'elle n'a pas le droit au bloc 1
            // Alors on remet à null
            if (this.formIntervention.blocId == 1) { this.formIntervention.blocId = null}
          }

          if (structureSelectionne.str_aut_bloc2 == true) {
            this.listebloc.push({ text: "Bloc 2 : Savoir circuler", value: "2" });
          }
          else
          { 
            if (this.formIntervention.blocId == 2) { this.formIntervention.blocId = null}
          }

          if (structureSelectionne.str_aut_bloc3 == true) {
            this.listebloc.push({ text: "Bloc 3 : Savoir rouler", value: "3" });
          }
          else
          {
            if (this.formIntervention.blocId == 3) { this.formIntervention.blocId = null}
          }
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération des blocs des structures",
            error
          );
        });
      }
      else
      {
        this.listebloc =  [{ text: "-- Choisissez votre structure --", value: null }]         
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
      
/*
var date1 = this.formIntervention.dateIntervention;
      var dateDelaiMaxAnticip = new Date()
      dateDelaiMaxAnticip.setMonth(dateDelaiMaxAnticip.getMonth() + this.parametreNbMoisMaxAnticip);
      var sdateDelaiMaxAnticip = dateDelaiMaxAnticip.toISOString().slice(0, 10)
      var idateDelaiMaxAnticip = Number(sdateDelaiMaxAnticip.toString().replaceAll("-",""))
      var idate1 = Number(date1.toString().replaceAll("-",""))
*/
    },
    "formIntervention.cp"(cp) {
      this.recherchecommune();
      this.rechercheqpv();
    },
    "isQpv"() {
      console.log("IsQPV",this.isQpv)
      this.formIntervention.isqpv = this.isQpv
      if (this.isQpv == false || this.isQpv =='false')
      {
        this.formIntervention.qpvcode = null;
      }
    },
    "isHandicap"() {
      console.log("isHandicap",this.isHandicap)
      this.formIntervention.isenfantshandicapes = this.isHandicap
      if (this.isHandicap == false || this.isHandicap =='false')
      {
        this.formIntervention.nbenfantshandicapes = null;
      }
    },
    selectedCommune() {
      this.formIntervention.commune = this.listecommune.find(commune => {
        return commune.cpi_codeinsee == this.selectedCommune;
      });
    },
    "formIntervention.ustid"() {
      // Chargement des blocs autorisé pour cette structure
      this.ChargeBlocsStructure(this.formIntervention.ustid)

    }
  },
  mounted() {

    this.$store.dispatch("get_parametre", "MAX_ANTICIP_INTER")
      .then(() => {
        console.log(this.$store.state.parametreSelectionne.par_valeur)
        this.parametreNbMoisMaxAnticip = Number(this.$store.state.parametreSelectionne.par_valeur)
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération du paramètre MAX_ANTICIP_INTER",
          error
        );
      });    

      this.$store.dispatch("get_parametre", "MAX_RETRO_INTER")
        .then(() => {
          console.log(this.$store.state.parametreSelectionne.par_valeur)
          this.parametreNbJoursMaxRetroSaisie = Number(this.$store.state.parametreSelectionne.par_valeur)
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du paramètre MAX_RETRO_INTER",
            error
          );
        });    

      this.isQpv = this.formIntervention.isqpv;
      this.isHandicap  = this.formIntervention.isenfantshandicapes;
      console.log("this.isQpv",this.isQpv)
      console.log("this.isHandicap",this.isHandicap)
      this.$store.dispatch("get_parametre", "MAX_MODIF_INTER")
        .then(() => {
          this.parametreNbJoursMaxModifInter = Number(this.$store.state.parametreSelectionne.par_valeur)

          var date1 = new Date(this.formIntervention.dateIntervention);
          date1.setDate(date1.getDate() + this.parametreNbJoursMaxModifInter);
          var sdate1 = date1.toISOString().slice(0, 10)
          var dateMaxModifInter = new Date()
          var sdateMaxModifInter = dateMaxModifInter.toISOString().slice(0, 10)
          var idateMaxModifInter = Number(sdateMaxModifInter.toString().replaceAll("-",""))
          var idate1 = Number(sdate1.toString().replaceAll("-",""))
          // Si la idateDelaiMaxAnticip (aujourd'hui + X mois) - date d'intervention > 0 Alors on a dépassé les X mois d'anticipation
          /*          
          console.log("Delai:", this.parametreNbJoursMaxModifInter)
          console.log("idateMaxModifInter:", idateMaxModifInter)
          console.log("idate1:", idate1)
          console.log("Delta:", idateMaxModifInter-idate1)
          */
          if (this.utilisateurCourant.profilId != 1)
          {
            if (idateMaxModifInter-idate1>0) 
            {
              //console.log ("Intervention verrouillee")
              this.isVerrouille = true;
            }
            else
            {
              //console.log ("Intervention NON verrouillee")
              this.isVerrouille = false;
            }
          }
          else
          {
            this.isVerrouille = false;
          }

        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du paramètre MAX_MODIF_INTER",
            error
          );
        }); 

      this.recherchecommune().then(res => {
        if (this.formIntervention && this.formIntervention.commune) {
          this.selectedCommune = this.formIntervention.commune.cpi_codeinsee;
        }
      });
      this.rechercheqpv().then(res=>{
          if (this.formIntervention && this.formIntervention.qpv) {
            this.formIntervention.qpvcode = this.formIntervention.qpv.qpv_code;
          }
      });
    this.recherchecommune().then(res => {
      if (this.formIntervention && this.formIntervention.commune) {
        this.selectedCommune = this.formIntervention.commune.cpi_codeinsee;
      }
    });
    this.chargeUtiStructures(this.$store.state.utilisateurCourant.id)
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
