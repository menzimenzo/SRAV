<template>
  <b-container class="interventions">
    <b-row>
      <b-col cols="12">
        <!--  ACCORDEON -- JE SAISIS UNE INTERVENTION -->

        <b-card no-body class="mb-3">
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
                    <div v-if="interventions.length > 0">
                      <b-btn @click="exportCsv()" class="mb-2" variant="primary">
                        <i class="material-icons" style="font-size: 18px; top: 4px;">import_export</i> Export CSV
                      </b-btn>
                      <editable
                        :columns="headers"
                        :data="interventionsToDisplay"
                        :removable="false"
                        :creable="false"
                        :editable="false"
                        :noDataLabel="''"
                        tableMaxHeight="none"
                        :loading="loading"
                        :defaultSortField="{ key: 'dateIntervention', order: 'desc' }"
                      >
                        <template slot-scope="props" slot="actions">
                          <div style="min-width: 147px;">
                            <b-btn
                              @click="editIntervention(props.data.id)"
                              size="sm"
                              class="ml-1"
                              variant="primary"
                              v-b-popover.hover="`Modifier l'intervention`"
                            >
                              <i class="material-icons">edit</i>
                            </b-btn>
                            <b-btn
                              @click="downloadPdf(props.data.id)"
                              v-if="props.data.blocId == '3'"
                              size="sm"
                              class="ml-1"
                              variant="primary"
                              v-b-popover.hover="`Télécharger l'attestation`"
                            >
                              <i class="material-icons">cloud_download</i>
                            </b-btn>
                            <b-btn
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
                      v-if="(interventions.length == 0) && (loading===false)"
                    >Aucune intervention n'a été créée pour le moment.</h4>
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
      loading: true,
      interventionsToDisplay: null,
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
      ]
    };
  },
  watch: {
    interventions: function() {
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
        this.interventionsToDisplay = this.interventions;
      }
      this.loading = false;
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
            this.$store.dispatch("get_interventions");
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
      this.$axios({
        url:
          process.env.API_URL +
          "/interventions/csv/" +
          this.utilisateurCourant.id,
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
    }
  },
  //
  //  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
  //
  async mounted() {
    await Promise.all([
      this.$store.dispatch("get_interventions"),
      this.$store.dispatch("get_documents")
    ]);
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
