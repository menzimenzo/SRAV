<template>
  <b-container class="interventions">
    <b-row>
      <b-col cols="12">
        <!--  ACCORDEON -- JE SAISIS UNE INTERVENTION -->
        <b-card no-body class="mb-3" v-if="utilisateurCourant.profilId!=4">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img
                  fluid
                  :src="require('assets/banner_ray_yellow.png')"
                  blank-color="rgba(0,0,0,0.5)"
                />
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion1
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-1">create</i> Je saisis une intervention
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
            <Intervention :intervention="interventionCourrante" />
          </b-collapse>
        </b-card>
        <!--  ACCORDEON -- MES INTERVENTIONS -->
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion2
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-1">list</i> Mes interventions
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-container>
                <b-row>
                  <b-col cols="12">
                      <b-row>
                        <b-col cols="3" v-if="this.utilisateurCourant.profilId == 2">
                            Structure d'intervention :
                              <!-- STRUCTURE -->
                              <b-form-select 
                                class="liste-deroulante"
                                v-model="filtreIdStructure"
                                >
                                <option :value="null">-- Choix de la structure--</option>
                                <option
                                  style="width: 25em"
                                  v-for="structure in listestructuresnationale"
                                  :key="structure.str_id"
                                  :value="structure.str_id"
                                >{{ structure.str_libellecourt}}</option>
                              </b-form-select>
                        </b-col>
                        <b-col cols="3" v-if="this.utilisateurCourant.profilId == 3">
                            Structure d'intervention :
                              <!-- STRUCTURE -->
                              <b-form-select 
                                class="liste-deroulante"
                                v-model="filtreIdStructureUtilisateur"
                                >
                                <option :value="null">-- Choix de la structure --</option>
                                <option
                                  style="width: 25em"
                                  v-for="structure in listestructures"
                                  :key="structure.ust_id"
                                  :value="structure.ust_id"
                                >{{ structure.str_libellecourt}} - {{ structure.uti_structurelocale}}{{ structure.tco_libelle}} - {{ structure.com_libelle}} {{ structure.dep_libelle}}{{ structure.eta_nom}}{{ structure.epci_libelle }}</option>
                              </b-form-select>
                        </b-col>
                        <b-col cols="3">
                          Date de début
                          <b-form-input 
                              maxlength="10" 
                              v-model="filtreDateInterventionDebut" 
                              type="date"
                              class="text-date date-input-width">
                            </b-form-input>
                        </b-col>
                        <b-col cols="3">
                          Date de fin
                          <b-form-input 
                              maxlength="10" 
                              v-model="filtreDateInterventionFin" 
                              type="date"
                              class="text-date date-input-width">
                            </b-form-input>
                        </b-col>
                        <b-btn @click="razFiltres()" class="mb-2" variant="primary">
                        <i class="material-icons" style="font-size: 18px; top: 4px;">filter_alt_off</i> Vider filtres
                      </b-btn>
                      </b-row>
                      <br>
                      <b-row>
                        <b-col cols="2">
                      <b-btn @click="rechercheInterventions()" class="mb-2" variant="primary">
                        <i class="material-icons" style="font-size: 18px; top: 4px;">search</i> Rechercher
                      </b-btn>
                    </b-col>
                        <b-col cols="2">
                      <b-btn @click="exportCsv()" class="mb-2" variant="primary"  :disabled="interditCSV===true" >
                        <i class="material-icons" style="font-size: 18px; top: 4px;">import_export</i> Export CSV
                      </b-btn>
                    </b-col>
                      </b-row>
                      
                      <div v-if="afficheResultat === true">

                      <editable
                        :columns="headers"
                        :data="interventions"
                        :removable="false"
                        :creable="false"
                        :editable="false"
                        :noDataLabel="''"
                        tableMaxHeight="none"
                        :loading="loading"
                        :defaultSortField="{ key: 'dateIntervention', order: 'desc' }"
                      >
                        <template slot-scope="props" slot="actions"  v-if="utilisateurCourant.profilId!=4 && ((utilisateurCourant.profilId==2 || utilisateurCourant.profilId==3)  && props.data.structureId == utilisateurCourant.structureId ) ">
                          <div style="min-width: 147px;">
                            <b-btn
                              v-if="!autoriseModifIntervention(props.data.dateIntervention)"
                              @click="editIntervention(props.data.id)"
                              size="sm"
                              class="ml-1"
                              variant="primary"
                              v-b-popover.hover="`Visualiser l'intervention`"
                            >
                              <i class="material-icons">visibility</i>
                            </b-btn>
                            <b-btn
                              v-if="autoriseModifIntervention(props.data.dateIntervention)"
                              @click="editIntervention(props.data.id)"
                              size="sm"
                              class="ml-1"
                              variant="primary"
                              v-b-popover.hover="`Modifier l'intervention`"
                            >
                              <i class="material-icons">edit</i>
                            </b-btn>
                            <b-btn
                              v-if="props.data.blocId == '3'"
                              @click="downloadPdf(props.data.id)"
                              size="sm"
                              class="ml-1"
                              variant="primary"
                              v-b-popover.hover="`Télécharger l'attestation`"
                            >
                              <i class="material-icons">cloud_download</i>
                            </b-btn>
                            <b-btn
                              v-if="autoriseModifIntervention(props.data.dateIntervention)"
                              @click="deleteIntervention(props.data.id)"
                              size="sm"
                              class="ml-1"
                              variant="danger"
                              v-b-popover.hover="`Supprimer l'intervention`"
                            >
                              <i class="material-icons">delete_forever</i>
                            </b-btn>
                          </div>
                        </template>
                      </editable>
                    </div>
                    <h4
                      class="text-center"
                      v-if="(afficheResultat === false)"
                    >La recherche ne retourne aucun résultat.</h4>
                  </b-col>
                </b-row>
              </b-container>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!--  ACCORDEON -- DOCUMENTS -->
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion3
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">bookmarks</i>Documents utiles
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-container>
                <b-row>
                  <b-col cols="12">
                    <h5 class="mb-3">Documents disponibles:</h5>
                    <ul>
                      <li v-for="doc in documents" :key="doc.doc_id">
                        {{doc.doc_libelle}}
                        <b-img
                          class="img-icon"
                          fluid
                          @click="downloadDoc(doc)"
                          :src="require('assets/pdf-240x240.png')"
                          blank-color="rgba(0,0,0,0.5)"
                        />
                      </li>
                    </ul>
                  </b-col>
                </b-row>
              </b-container>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
    </b-row>
    <modal
      name="editIntervention"
      height="auto"
      width="1100px"
      @closed="clearIntervention()"
      :scrollabe="true"
    >
      <Intervention :intervention="interventionCourrante" />
    </modal>
  </b-container>
</template>

<script>
import Intervention from "~/components/Intervention.vue";
import { mapState } from "vuex";
import Editable from "~/components/editable/index.vue";

export default {
  components: {
    Intervention,
    Editable
  },
  data() {
    return {
      parametreNbJoursMaxModifInter: null,
      parametrePartageDonnees: null,
      loading: true,
      //interventionsToDisplay: null,
      headers: [
        {
          path: "id",
          title: "N° d'intervention",
          type: "text",
          sortable: true
        },
        { path: "blocId", title: "Bloc", type: "text", sortable: true },
        {
          path: "commune.com_libellemaj",
          title: "Commune",
          type: "text",
          sortable: true
        },
        {
          path: "dateIntervention",
          title: "Date d'intervention",
          type: "date",
          sortable: true,
          filter: "date"
        },
        {
          path: "dateCreation",
          title: "Création",
          type: "date",
          sortable: true,
          filter: "timestamp"
        },
        {
          path: "dateMaj",
          title: "Modification",
          type: "date",
          sortable: true,
          filter: "timestamp"
        },
        {
          path: "nbEnfants",
          title: "Nombre d'enfants",
          type: "text",
          sortable: true
        },
        {
          path: "__slot:actions",
          title: "Actions",
          type: "__slot:actions",
          sortable: false
        }
      ],
      listestructures: [],
      listestructuresnationale: [],
      filtreIdStructureUtilisateur: null,
      filtreIdStructure: null,
      filtreDateInterventionDebut: null,
      filtreDateInterventionFin: null,
      afficheResultat: false,
      interditCSV: true
    };
  },
  watch: {
    interventions: function() {
      //this.filtreInterventions();
    },
    /*
    filtreIdStructureUtilisateur:function() {
      this.interventions = null;

      //this.filtreInterventions();
    },
    */
    filtreDateInterventionDebut:function() {
      console.log("this.filtreDateInterventionDebut",this.filtreDateInterventionDebut);
      //this.afficheResultat = false
      this.interditCSV = true
    },
    filtreIdStructure:function() {
      console.log("this.filtreIdStructure",this.filtreIdStructure);
      //this.filtreInterventions();
      //this.afficheResultat = false
      this.interditCSV = true

    },
    filtreIdStructureUtilisateur:function() {
      console.log("this.filtreIdStructureUtilisateur",this.filtreIdStructureUtilisateur);
      //this.filtreInterventions();
      //this.afficheResultat = false
      this.interditCSV = true

    },
    filtreDateInterventionFin:function() {
      console.log("this.filtreDateInterventionFin",this.filtreDateInterventionFin);
      //this.filtreInterventions();
      //this.afficheResultat = false
      this.interditCSV = true
    }
    
  },
  computed: mapState([
    "interventions",
    "interventionCourrante",
    "utilisateurCourant",
    "documents"
  ]),
  methods: {
    //
    //  fonction de recupération des infos d'une intervention par id
    //
    editIntervention: function(idIntervention) {
      return this.$store
        .dispatch("get_intervention", idIntervention)
        .then(() => {
          this.$modal.show("editIntervention");
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du détail de l'intervention",
            error
          );
        });
    },
    autoriseModifIntervention: function(dateIntervention) {

          var date1 = new Date(dateIntervention);
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
              return false;
            }
            else
            {
              return true;
            }      
          }
          else
          {
            return true;
          }
    },
    deleteIntervention: function(idIntervention) {
      console.info("Suppression d'une intervention : " + idIntervention);
      //this.$dialog.confirm({ text: 'Confirmez-vous la suppression définitive d\'intervention', title: 'Suppression'});
      if (confirm("Confirmez-vous la suppression définitive d'intervention")) {
        this.loading = true;
        const url =
          process.env.API_URL + "/interventions/delete/" + idIntervention;
        console.info(url);
        return this.$axios
          .$get(url)
          .then(response => {
            rechercheInterventions()
            //this.$store.dispatch("get_interventions");
            //this.resetform();
            this.clearIntervention();
            this.$toast.success(
              `Intervention #${idIntervention} a bien été supprimée`,
              {}
            );
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la suppresion de l'intervention",
              error
            );
          });
        this.loading = false;
      }
    },
    downloadPdf: function(id) {
      this.$axios({
        url: process.env.API_URL + "/pdf/" + id,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        // Crée un objet blob avec le contenue du CSV et un lien associé
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Crée un lien caché pour télécharger le fichier
        const link = document.createElement("a");
        link.href = url;
        var idformate = "";
        var nbzero;
        idformate = id.toString();
        for (nbzero = 0; nbzero < 7 - id.toString().length; nbzero++) {
          idformate = "0" + idformate;
        }
        idformate = "SRAV_Attestation-" + idformate;
        console.log(idformate);
        link.setAttribute("download", `${idformate}.pdf`); //or any other extension
        document.body.appendChild(link);
        // Télécharge le fichier
        link.click();
        link.remove();
      });
    },
    downloadDoc: function(doc) {
      this.$axios({
        url: process.env.API_URL + "/documents/" + doc.doc_id,
        method: "GET",
        responseType: "blob"
      })
        .then(response => {
          // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
          // Crée un objet blob avec le contenue du CSV et un lien associé
          const url = window.URL.createObjectURL(new Blob([response.data]));
          // Crée un lien caché pour télécharger le fichier
          const link = document.createElement("a");
          link.href = url;
          const fileName = doc.doc_filename;
          link.setAttribute("download", fileName);
          // Télécharge le fichier
          link.click();
          link.remove();
          console.log("Done - Download", { fileName });
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.$toasted.error("Erreur lors du téléchargement: " + err.message);
        });
    },
    clearIntervention() {
      this.$store.commit("reset_interventions");
    },
    exportCsv() {

      const params = {
        filtreDateInterventionDebut: this.filtreDateInterventionDebut,
        filtreDateInterventionFin: this.filtreDateInterventionFin,
        filtreIdStructureUtilisateur: this.filtreIdStructureUtilisateur,
        filtreIdStructure: this.filtreIdStructure
          }

      const url = "/interventions/csv/filtre?id=" + this.utilisateurCourant.id + "&dateDebut=" + this.filtreDateInterventionDebut + "&dateFin=" +  this.filtreDateInterventionFin +"&idStructureUtilisateur=" + this.filtreIdStructureUtilisateur + "&idStructure=" + this.filtreIdStructure
      console.log(url)
      this.$axios({
        url:
          process.env.API_URL + url,
          //this.utilisateurCourant.id,
        // url: apiUrl + '/droits/' + 17,
        method: "GET",
        responseType: "blob"
      })
        .then(response => {
          // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
          // Crée un objet blob avec le contenue du CSV et un lien associé
          const url = window.URL.createObjectURL(new Blob([response.data]));
          // Crée un lien caché pour télécharger le fichier
          const link = document.createElement("a");
          link.href = url;
          const fileName = "Savoir Rouler - Interventions.csv";
          link.setAttribute("download", fileName);
          // Télécharge le fichier
          link.click();
          link.remove();
          console.log("Done - Download", { fileName });
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.$toasted.error("Erreur lors du téléchargement: " + err.message);
        });
    },
    chargeStructures(iduti) {
      const url =  process.env.API_URL + "/structures/";
      console.info(url);
      return this.$axios.$get(url).then(response => {
              this.listestructuresnationale = response;
              // Si une seule structure, on la selectionne par défaut
              if (this.listestructuresnationale.length != 0) {

                var newListeStructure = []
                var premierelement = null
                this.listestructuresnationale.forEach(structureitem =>{
                  // Exclusion des structures 9 et 11
                    if (this.parametrePartageDonnees == 1) {
                        if (structureitem.str_id != 9 && structureitem.str_id != 11 && this.utilisateurCourant.structureId != structureitem.str_id) {
                        newListeStructure.push(structureitem)
                      }
                    }
                    
                    if (this.utilisateurCourant.structureId == structureitem.str_id) {
                      premierelement = structureitem
                    }
                    
                   //console.log(structureitem);
                });
                this.listestructuresnationale = newListeStructure
                if (this.parametrePartageDonnees == 1) {
                  // Ajout de la structure "toutes"
                  this.listestructuresnationale.unshift({ str_id: 99, str_libellecourt: "Toutes structures", str_libelle: "Toutes les structures"});
                }
                this.listestructuresnationale.unshift(premierelement)
                // On positionne la liste par défaut sur la structure de l'utilisateur
                this.filtreIdStructure = this.utilisateurCourant.structureId // this.listestructuresnationale[0].str_id
              }
              this.loading = false;
            })
            .catch(error => {
              console.error(
                "Une erreur est survenue lors de la récupération des structures nationales",
                error
              );
            });
    },
    chargeUtiStructures(iduti) {
      const url =  process.env.API_URL + "/structures/user/" + iduti;
      console.info(url);
      return this.$axios.$get(url).then(response => {
              this.listestructures = response.structures;
              // Si une seule structure, on la selectionne par défaut
              if (this.listestructures.length == 1) {
                  this.filtreIdStructureUtilisateur = this.listestructures[0].ust_id
              }
              this.loading = false;
            })
            .catch(error => {
              console.error(
                "Une erreur est survenue lors de la récupération des structures de l'utilisateur",
                error
              );
            });
    },
    filtreInterventions(){
      this.loading = true;
      if (this.utilisateurCourant.profilId == 2) {
       //console.info('suppression interventions hors structure_id : '+this.utilisateurCourant.structureId)
       //console.info('nb inter avant: '+ this.interventions.length)
        this.interventionsToDisplay = this.interventions.filter(x => {
          var isMatch = true;
          isMatch =
            isMatch &&
            (String(x.structureId) == this.utilisateurCourant.structureId ||
              String(x.utiId) == this.utilisateurCourant.id);
          return isMatch;
        });
        //console.info('nb inter apres filtrage structure: '+ this.interventionsToDisplay.length)
      } else {
        if (this.utilisateurCourant.profilId == 3) {
          this.interventionsToDisplay = this.interventions.filter(x => {
            var isMatch = true;
            isMatch =
              isMatch &&
              (String(x.ustid) == this.filtreIdStructureUtilisateur &&
                String(x.utiId) == this.utilisateurCourant.id);
            return isMatch;
          });
          console.log ("Filtre intervenation",this.interventions)
          //this.interventionsToDisplay = this.interventions;
        }
        else
        {
          this.interventionsToDisplay = this.interventions;
        }
      }

      this.loading = false;
    },
    rechercheInterventions(){
      console.log("this.filtreDateInterventionDebut",this.filtreDateInterventionDebut)
      console.log("this.filtreDateInterventionFin",this.filtreDateInterventionFin)
      const params = {
        filtreDateInterventionDebut: this.filtreDateInterventionDebut,
        filtreDateInterventionFin: this.filtreDateInterventionFin,
        filtreIdStructureUtilisateur: this.filtreIdStructureUtilisateur,
        filtreIdStructure: this.filtreIdStructure
          }

        this.$store.dispatch("get_interventions_filtre",params)        
        .then(() => {
          console.log("this.interventions.length ",this.interventions.length )
          if (this.interventions.length > 0) {
            this.afficheResultat = true
            this.interditCSV = false
          }
          else 
          {
            this.afficheResultat = false
            this.interditCSV = true
          }
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération de la liste des interventions filtrées",
            error
          );
        }); 

        
    },
    razFiltres(){
      this.filtreDateInterventionDebut = null
      this.filtreDateInterventionFin = null
      this.filtreIdStructureUtilisateur = null
      this.filtreIdStructure = null
    }

  },
  //
  //  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
  //
  async mounted() {

/*
          const params = {
            id: this.id,
            old: this.oldPwd,
            password: this.password,
            confirm: this.confirmation
          }
          return this.$store.dispatch('reset_password', params)
*/
/*
    const params = {
            dateDebutIntervention: this.dateDebutIntervention,
            dateFinIntervention: this.dateFinIntervention,
            idStructure: this.idStructure
          }
*/
    await Promise.all([
      //this.$store.dispatch("get_interventions_filtre"),
      this.$store.dispatch("get_documents")
    ]);

            
    this.$store.dispatch("get_parametre", "PARTAGE_DONNEES")
        .then(() => {
          console.log(this.$store.state.parametreSelectionne.par_valeur)
          this.parametrePartageDonnees = Number(this.$store.state.parametreSelectionne.par_valeur)
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du paramètre PARTAGE_DONNEES",
            error
          );
        }); 

        this.$store.dispatch("get_parametre", "MAX_MODIF_INTER")
        .then(() => {
          console.log(this.$store.state.parametreSelectionne.par_valeur)
          this.parametreNbJoursMaxModifInter = Number(this.$store.state.parametreSelectionne.par_valeur)
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du paramètre MAX_MODIF_INTER",
            error
          );
        }); 


    this.chargeUtiStructures(this.utilisateurCourant.id);
    this.chargeStructures(this.utilisateurCourant.id);
    //console.info("mounted", { interventions: this.interventions});
    // on supprime les interventions ne relevant pas de la structure si prod_id = 2 (partenaire)
    /*if (this.utilisateurCourant.profilId == 2) {
      console.info('2 - suppression interventions hors structure_id : '+this.utilisateurCourant.structureId)
      console.info('2 - nb inter avant: '+ this.interventions.length)
      this.interventionsToDisplay = this.interventions.filter(x => {
        var isMatch = true;
        isMatch =
          isMatch &&
          String(x.structureId) == this.utilisateurCourant.structureId;
        return isMatch;
      });
      console.info('2 - nb inter apres filtrage structure: '+ this.interventionsToDisplay.length)
    } else {
      this.interventionsToDisplay = this.interventions;
    }*/
    this.loading = false;
  }
};
</script>

<style>
.accordionBtn {
  text-align: left;
}

.accordionBtn:focus {
  box-shadow: none;
}

.accordion-chevron {
  position: relative;
  top: 5px;

  -webkit-transition: 0.4s ease-in-out;
  -moz-transition: 0.4s ease-in-out;
  -o-transition: 0.4s ease-in-out;
  transition: 0.4s ease-in-out;
  color: #252195;
}

a:not(.collapsed) .accordion-chevron {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}
</style>
