<template>
  <b-container class="interventions">
    <b-row>
      <b-col cols="12">
        <!--  ACCORDEON --  -->

        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img
                  fluid
                  :src="require('assets/banner_ray_red.png')"
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
                    <i class="material-icons ml-2 mr-2">people</i>
                    Gestion des comptes utilisateurs
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-btn @click="exportCsv()" class="mb-2" variant="primary">
                <i class="material-icons" style="font-size: 18px; top: 4px;">import_export</i> Export CSV
              </b-btn>
              <editable
                :columns="headers"
                :data="users"
                :removable="false"
                :creable="false"
                :editable="false"
                :noDataLabel="''"
                tableMaxHeight="none"
                :loading="loading"
              >
                <template slot-scope="props" slot="actions">
                  <b-btn @click="editUser(props.data.id)" size="sm" class="mr-1" variant="primary">
                    <i class="material-icons">edit</i>
                  </b-btn>
                </template>
              </editable>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_red.png')" blank-color="rgba(0,0,0,1)"/>
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion2
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">list_alt</i>
                    Gestion des structures
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <editable
                :columns="headersRef"
                :data="structures"
                :removable="false"
                :creable="false"
                :editable="false"
                :noDataLabel="''"
                tableMaxHeight="none"
                :loading="loading"
              >
                <template slot-scope="props" slot="actions">
                  <b-btn
                    @click="editStruct(props.data.str_id)"
                    size="sm"
                    class="mr-1"
                    variant="primary"
                  >
                    <i class="material-icons">edit</i>
                  </b-btn>
                </template>
              </editable>
              <b-btn @click="editStruct(null)" class="btn btn-primary btn-lg btn-block">
                <i class="material-icons">add</i>
              </b-btn>
            </b-card-body>
          </b-collapse>
        </b-card>
        <!-- ACCORDEON -- ACCES AUX INDICATEURS -->
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_red.png')" blank-color="rgba(0,0,0,1)"/>
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion3
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">poll</i>
                    Accès aux indicateurs
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <h3 class="text-center">Disponible en V2</h3>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_red.png')" blank-color="rgba(0,0,0,1)"/>
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion4
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">cloud_upload</i>
                    Publication des documents
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <file-upload/>
            </b-card-body>
          </b-collapse>
        </b-card>

        <!--  ACCORDEON -- COMMENTAIRES -->
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_red.png')" blank-color="rgba(0,0,0,1)"/>
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion5
                  variant="Dark link"
                >
                  <h4>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">comment</i>
                    Commentaires
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <div class="mb-3">
                <b-form inline>
                  <label for="nameFilter">Intervenant:</label>
                  <b-input
                    class="ml-2"
                    id="nameFilter"
                    v-model="nameFilter"
                    placeholder="Bernard Dupond"
                  />
                  <label class="ml-3" for="placeFilter">Lieu:</label>
                  <b-input class="ml-2" id="placeFilter" v-model="placeFilter" placeholder="Paris"/>
                </b-form>
              </div>
              <editable
                :columns="headersCom"
                :data="filteredInterventions"
                :removable="false"
                :creable="false"
                :editable="false"
                :noDataLabel="''"
                tableMaxHeight="none"
                :loading="loading"
                v-if="filteredInterventions.length > 0"
              >
                <template slot-scope="props" slot="actions">{{props.data.id}}</template>
              </editable>
              <h5 class="text-center" v-if="filteredInterventions.length == 0">Aucune intervention</h5>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
    </b-row>
    <modal name="editUser" height="auto" width="900px" :scrollabe="true">
      <user/>
    </modal>
    <modal name="editStruct" height="auto" width="900px" :scrollabe="true">
      <struct/>
    </modal>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import Editable from "~/components/editable/index.vue";
import user from "~/components/user.vue";
import fileUpload from "~/components/fileUpload.vue";
import struct from "~/components/struct.vue";

export default {
  components: {
    Editable,
    user,
    fileUpload,
    struct
  },
  data() {
    return {
      loading: true,
      headers: [
        { path: "id", title: "N° d'utilisateur", type: "text", sortable: true },
        { path: "proLibelle", title: "Rôle", type: "text", sortable: true },
        { path: "nom", title: "Nom", type: "text", sortable: true },
        { path: "prenom", title: "Prénom", type: "text", sortable: true },
        {
          path: "structureLibelleCourt",
          title: "structure",
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
      headersCom: [
        { path: "nom", title: "Intervenant", type: "text", sortable: true },
        {
          path: "commune.com_libellemaj",
          title: "Lieu",
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
          path: "commentaire",
          title: "Commentaires",
          type: "text",
          sortable: true
        }
      ],
      nameFilter: "",
      placeFilter: "",
      headersRef: [
        { path: "str_libelle", title: "Libellé", type: "text", sortable: true },
        {
          path: "str_libellecourt",
          title: "libellé court",
          type: "text",
          sortable: true
        },
        { path: "str_actif", title: "actif", type: "boolean", sortable: true },
        {
          path: "str_federation",
          title: "federation",
          type: "boolean",
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

  methods: {
    editUser: function(id) {
      return this.$store
        .dispatch("get_user", id)
        .then(() => {
          this.$modal.show("editUser");
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération du détail de l'user",
            error
          );
        });
    },
    editStruct: function(id) {
      if (id === null) {
        this.$store.commit("clean_structureSelectionnee");
        this.$modal.show("editStruct");
      } else {
        return this.$store
          .dispatch("get_structure", id)
          .then(() => {
            this.$modal.show("editStruct");
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération du détail de la structure",
              error
            );
          });
      }
    },
    //
    // Export CSV des utilisateurs
    //
    exportCsv() {
      this.$axios({
        url: process.env.API_URL + "/user/csv", // + this.utilisateurCourant.id,
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
          const fileName = "Savoir Rouler - Utilisateurs.csv";
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
  //  CHARGEMENT ASYNCHRONE DES USERS, STRUCTURES ET INTERVENTIONS
  //
  computed: {
    ...mapState(["interventions", "users", "structures"]),
    filteredInterventions: function() {
      return this.interventions.filter(intervention => {
        var isMatch = true;
        if (this.nameFilter != "") {
          isMatch =
            isMatch &&
            intervention.nom
              .toLowerCase()
              .indexOf(this.nameFilter.toLowerCase()) > -1;
        }
        if (this.placeFilter != "") {
          isMatch =
            isMatch &&
            intervention.commune.com_libellemaj
              .toLowerCase()
              .indexOf(this.placeFilter.toLowerCase()) > -1;
        }
        return isMatch;
      });
    }
  },
  async mounted() {
    const url = process.env.API_URL + "/user";
    await Promise.all([
      this.$store.dispatch("get_users").catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des users",
          error
        );
      }),
      this.$store.dispatch("get_structures").catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des structures",
          error
        );
      }),
      this.$store.dispatch("get_interventions")
    ]);
    this.loading = false;
  }
};
</script>

<style>
</style>
