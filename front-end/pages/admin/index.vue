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
                :defaultSortField="{ key: 'nom', order: 'asc' }"
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
                  <h4 v-if="loading === false">
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">poll</i>
                    Accès aux indicateurs : {{NbAttestations}} attestations délivrées
                  </h4>
                  <h4 v-else>
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">poll</i>
                    Accès aux indicateurs
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
            <b-row></b-row>&nbsp;
            <b-row>
              <b-col>
                <h6>Interventions par Cadre d'intervention / Nombre d'attestations délivrées par mois</h6>
                <bar-chart
                  v-if="loading === false"
                  :chartdata="data1"
                  :options="optionsHisto"
                  :width="400"
                  :height="400"
                />
              </b-col>
              <b-col>
                <h6>Répartition des interventions par bloc et par Cadre d'intervention</h6>
                <doughnut-chart
                  v-if="loading === false"
                  :chartdata="data2"
                  :options="optionsDoughnut"
                  :width="400"
                  :height="400"
                />
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row>
              <b-col>
                <h6>Interventions par bloc</h6>
                <bar-chart
                  v-if="loading === false"
                  :chartdata="data3"
                  :options="optionsHisto"
                  :width="400"
                  :height="400"
                />
              </b-col>
              <b-col>
                <h6>Répartition des interventions par structure et par bloc</h6>
                <doughnut-chart
                  v-if="loading === false"
                  :chartdata="data4"
                  :options="optionsDoughnut"
                  :width="400"
                  :height="400"
                />
              </b-col>
            </b-row>
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
                :defaultSortField="{ key: 'id', order: 'asc' }"
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
import BarChart from "~/components/histogramme.vue";
import DoughnutChart from "~/components/doughnut.vue";

export default {
  components: {
    Editable,
    user,
    fileUpload,
    struct,
    BarChart,
    DoughnutChart
  },
  data() {
    return {
      data1: null,
      options1: null,
      data2: null,
      options2: null,
      data3: null,
      options3: null,
      data4: null,
      NbAttestations: null,
      loading: true,
      chartdata: null,
      headers: [
        { path: "id", title: "N° d'utilisateur", type: "text", sortable: true },
        { path: "proLibelle", title: "Rôle", type: "text", sortable: true },
        { path: "nom", title: "Nom", type: "text", sortable: true },
        { path: "prenom", title: "Prénom", type: "text", sortable: true },
        {
          path: "structureLibelleCourt",
          title: "Structure",
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
          title: "Libellé court",
          type: "text",
          sortable: true
        },
        {
          path: "str_actif_on",
          title: "Actif",
          type: "boolean",
          sortable: true
        },
        {
          path: "str_federation_on",
          title: "Fédération",
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
    calcStat: function(intervention) {
      let NbIntBloc1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbIntBloc2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbIntBloc3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbIntSco = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbIntPer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbIntExt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbAtt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbAttCumule = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let IntParBloc = [0, 0, 0];
      let IntParBlocParCadre = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let IntParStructure = {};
      let DataToDisplay = [];
      let SubDataToDisplay = [];
      let LabelsToDisplay = [];
      let SubLabelsToDisplay = [];
      let NbAttestations = 0;
      let data1 = {};
      let data2 = {};
      let data3 = {};
      let data4 = {};
      let optionsHisto = {};
      let optionsDoughnut = {};
      // nb de structures affichées sur le 4eme graphique. 
      // S'il y a plus de nbMaxStructureAffichees structures on affiches les nbMaxStructureAffichees premieres + "Autres"
      const nbMaxStructureAffichees = 2 ;

      intervention.forEach(element => {
        let mois = element.dateIntervention.getMonth();
        let blocId = Number(element.blocId);
        let nbEnfants = Number(element.nbEnfants);
        let cai = Number(element.cai);
        let structure = element.structure;
        let indice = 0;

        //G4
        if (!IntParStructure[structure]) {
          IntParStructure[structure] = {
            total: 0,
            bloc1: 0,
            bloc2: 0,
            bloc3: 0
          };
        }
        IntParStructure[structure].total++;

        //G2
        IntParBloc[blocId - 1] = IntParBloc[blocId - 1] + 1;
        indice = (blocId - 1) * 3 + cai - 1;
        IntParBlocParCadre[indice] = IntParBlocParCadre[indice] + 1;

        if (blocId === 3) {
          NbAtt[mois] = NbAtt[mois] + nbEnfants;
          this.NbAttestations = this.NbAttestations + nbEnfants;
        }
        switch (blocId) {
          case 1:
            NbIntBloc1[mois] = NbIntBloc1[mois] + 1;
            IntParStructure[structure].bloc1++;
            break;
          case 2:
            NbIntBloc2[mois] = NbIntBloc2[mois] + 1;
            IntParStructure[structure].bloc2++;
            break;
          case 3:
            NbIntBloc3[mois] = NbIntBloc3[mois] + 1;
            IntParStructure[structure].bloc3++;
            break;
        }
        switch (cai) {
          case 1:
            NbIntSco[mois] = NbIntSco[mois] + 1;
            break;
          case 2:
            NbIntPer[mois] = NbIntPer[mois] + 1;
            break;
          case 3:
            NbIntExt[mois] = NbIntExt[mois] + 1;
            break;
        }
      });

      // Calcul des interventions cumulees
      for(var i = 0; i < NbAtt.length;i++) {
        if (i === 1 ) {NbAttCumule[i]=NbAtt[i] }
        else { NbAttCumule[i]=NbAttCumule[i-1]+NbAtt[i]}
      }

      //on passe de valeures absolues en pourcentage
      for (var i = 0; i < IntParBloc.length; i++) {
        IntParBloc[i] = Math.round((IntParBloc[i] / intervention.length) * 100);
      }
      for (var i = 0; i < IntParBlocParCadre.length; i++) {
        IntParBlocParCadre[i] = Math.round(
          (IntParBlocParCadre[i] / intervention.length) * 100
        );
      }

      // Tri par ordre decroissant et regroupement des petites structures entre elles si trop nombreuses
      var keys = Object.keys(IntParStructure);
      keys.sort(function(a, b) {
        return IntParStructure[b] - IntParStructure[a];
      });

      if (keys.length >= nbMaxStructureAffichees) {
        console.log("on regroupe");
        let nbAutre = { total: 0, bloc1: 0, bloc2: 0, bloc3: 0 };
        let i = 0;
        keys.forEach(function(k) {
          i++;
          if (i > nbMaxStructureAffichees) {
            nbAutre.total = nbAutre.total + IntParStructure[k].total;
            nbAutre.bloc1 = nbAutre.bloc1 + IntParStructure[k].bloc1;
            nbAutre.bloc2 = nbAutre.bloc2 + IntParStructure[k].bloc2;
            nbAutre.bloc3 = nbAutre.bloc3 + IntParStructure[k].bloc3;
          } else {
            DataToDisplay.push(
              Math.round(
                (Number(IntParStructure[k].total) / intervention.length) * 100
              )
            );
            SubDataToDisplay.push(
              Math.round(
                (Number(IntParStructure[k].bloc1) / intervention.length) * 100
              )
            );
            SubDataToDisplay.push(
              Math.round(
                (Number(IntParStructure[k].bloc2) / intervention.length) * 100
              )
            );
            SubDataToDisplay.push(
              Math.round(
                (Number(IntParStructure[k].bloc3) / intervention.length) * 100
              )
            );
            LabelsToDisplay.push(k);
            SubLabelsToDisplay.push(k + " / bloc 1");
            SubLabelsToDisplay.push(k + " / bloc 2");
            SubLabelsToDisplay.push(k + " / bloc 3");
          }
        });
        DataToDisplay.push(
          Math.round((nbAutre.total / intervention.length) * 100)
        );
        SubDataToDisplay.push(
          Math.round((nbAutre.bloc1 / intervention.length) * 100)
        );
        SubDataToDisplay.push(
          Math.round((nbAutre.bloc2 / intervention.length) * 100)
        );
        SubDataToDisplay.push(
          Math.round((nbAutre.bloc3 / intervention.length) * 100)
        );
        LabelsToDisplay.push("Autre");
        SubLabelsToDisplay.push("Autre / bloc 1");
        SubLabelsToDisplay.push("Autre / bloc 2");
        SubLabelsToDisplay.push("Autre / bloc 3");
      } else {
        keys.forEach(function(k) {
          DataToDisplay.push(
            Math.round(
              (Number(IntParStructure[k].total) / intervention.length) * 100
            )
          );
          SubDataToDisplay.push(
            Math.round(
              (Number(IntParStructure[k].bloc1) / intervention.length) * 100
            )
          );
          SubDataToDisplay.push(
            Math.round(
              (Number(IntParStructure[k].bloc2) / intervention.length) * 100
            )
          );
          SubDataToDisplay.push(
            Math.round(
              (Number(IntParStructure[k].bloc3) / intervention.length) * 100
            )
          );
          LabelsToDisplay.push(k);
          SubLabelsToDisplay.push(k + " / bloc 1");
          SubLabelsToDisplay.push(k + " / bloc 2");
          SubLabelsToDisplay.push(k + " / bloc 3");
        });
      }

      // Définition de l'objet Data envoyé au 1er graphique
      (this.data1 = {
        labels: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Aout",
          "Septembre",
          "Octobre",
          "Novembre",
          "Decembre"
        ],
        datasets: [
          {
            type: "line",
            fill: false,
            label: "Nb attestations",
            pointBackgroundColor: "#a23b45",
            borderColor: "#a23b45",
            backgroundColor: "#a23b45",
            yAxisID: "B",
            data: NbAtt
          },
          {
            label: "scolaire",
            backgroundColor: "#f87979",
            yAxisID: "A",
            data: NbIntSco
          },
          {
            label: "péri-scolaire",
            backgroundColor: "#3D5B96",
            yAxisID: "A",
            data: NbIntPer
          },
          {
            label: "extra scolaire",
            backgroundColor: "#1EFFFF",
            yAxisID: "A",
            data: NbIntExt
          }
        ]
      }),
        // Définition de l'objet Data envoyé au 2eme graphique
        (this.data2 = {
          datasets: [
            {
              backgroundColor: ["#66ff66", "#996633", "#ffcc00"],
              data: [IntParBloc[0], IntParBloc[1], IntParBloc[2]],
              labels: ["Bloc 1", "Bloc 2", "Bloc 3"]
            },
            {
              backgroundColor: [
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF"
              ],
              labels: [
                "Bloc 1 / scolaire",
                "Bloc 1 / péri-scolaire",
                "Bloc 1 / extra-scolaire",
                "Bloc 2 / scolaire",
                "Bloc 2 / péri-scolaire",
                "Bloc 2 / extra-scolaire",
                "Bloc 3 / scolaire",
                "Bloc 3 / péri-scolaire",
                "Bloc 3 / extra-scolaire"
              ],
              data: [
                IntParBlocParCadre[0],
                IntParBlocParCadre[1],
                IntParBlocParCadre[2],
                IntParBlocParCadre[3],
                IntParBlocParCadre[4],
                IntParBlocParCadre[5],
                IntParBlocParCadre[6],
                IntParBlocParCadre[7],
                IntParBlocParCadre[8]
              ]
            }
          ]
        }),
        // Définition de l'objet Data envoyé au 3eme graphique
        (this.data3 = {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Aout",
            "Septembre",
            "Octobre",
            "Novembre",
            "Decembre"
          ],
          datasets: [
            {
            type: "line",
            fill: false,
            label: "Cumul attestations",
            pointBackgroundColor: "#a23b45",
            borderColor: "#a23b45",
            backgroundColor: "#a23b45",
            yAxisID: "B",
            data: NbAttCumule
          },
            { label: "bloc 1", backgroundColor: "#66ff66",  yAxisID: "A", data: NbIntBloc1 },
            { label: "bloc 2", backgroundColor: "#996633",  yAxisID: "A", data: NbIntBloc2 },
            { label: "bloc 3", backgroundColor: "#ffcc00",  yAxisID: "A", data: NbIntBloc3 }
          ]
        }),
        // Définition de l'objet Data envoyé au 4eme graphique
        (this.data4 = {
          datasets: [
            {
              backgroundColor: [
                "#0074D9",
                "#FF4136",
                "#2ECC40",
                "#FF851B",
                "#7FDBFF",
                "#B10DC9",
                "#FFDC00",
                "#001f3f",
                "#39CCCC",
                "#01FF70",
                "#85144b",
                "#F012BE",
                "#3D9970",
                "#111111",
                "#AAAAAA"
              ],
              data: DataToDisplay,
              labels: LabelsToDisplay
            },
            {
              labels: SubLabelsToDisplay,
              backgroundColor: [
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF",
                "#f87979",
                "#3D5B96",
                "#1EFFFF"
              ],
              data: SubDataToDisplay
            }
          ]
        });

      // Définition des options du 1er et 3eme grahiques
      this.optionsHisto = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1
            }
          ],
          yAxes: [
            {
              id: "A",
              type: "linear",
              display: true,
              position: "left",
              min: 0,
              stacked: true
            },
            {
              id: "B",
              type: "linear",
              position: "right",
              min: 0
            }
          ]
        }
      };
      // Définition des options du 2eme et 4eme grahiques
      this.optionsDoughnut = {
        responsive: false,
        maintainAspectRatio: true,
        legend: {
          position: "top"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        pieceLabel: {
          mode: "percentage",
          precision: 1
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var index = tooltipItem.index;
              return dataset.labels[index] + ": " + dataset.data[index] + "%";
            }
          }
        }
      };
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
            intervention.commentaire != "" &&
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
        // Suppression des interventions sans commentaire
        if (this.placeFilter == "" && this.nameFilter == "") {
          isMatch =
            isMatch &&
            intervention.commentaire != ""  
        }
        return isMatch;
      });
    }
  },
  async mounted() {
    this.loading = true;
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
    // Calcul des stats
    this.calcStat(this.interventions);
    this.loading = false;
  }
};
</script>

<style>
</style>

