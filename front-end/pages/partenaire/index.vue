<template>
  <b-container>
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
                  :src="require('assets/banner_ray_blue.png')"
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
                    Liste des Intervenants de ma structure
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
                :defaultSortField="{ key: 'nom', order: 'asc' }"
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
                <b-img :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)" />
                <b-btn
                  class="accordionBtn"
                  block
                  href="#"
                  v-b-toggle.accordion2
                  variant="Dark link"
                >
                  <h4 v-if="loading === false">
                    <i class="material-icons accordion-chevron">chevron_right</i>
                    <i class="material-icons ml-2 mr-2">poll</i>
                    Accès aux indicateurs : {{statStructure[structure2].nbAttestations}} attestations enregistrées depuis Avril 2019
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
          <b-collapse id="accordion2" visible accordion="my-accordion" role="tabpanel">
            <b-row>&nbsp;</b-row>
            <b-card-header header-tag="header" style="background:#d0eef2">
              <b-row></b-row>&nbsp;
              <b-row>
                <b-col style="text-align:center">
                  Veuillez sélectionner la structure dont vous souhaitez voir la répartition des interventions :
                  <span
                    class="liste-deroulante"
                  >
                    <b-form-select v-model="structure1" v-on:change="viewCarte(structure1)">
                      <option :value="'nationale'">Toutes</option>
                      <option
                        v-for="structure in structures"
                        :key="structure.str_libellecourt"
                        :value="structure.str_libellecourt"
                      >{{ structure.str_libellecourt}}</option>
                    </b-form-select>
                  </span>
                </b-col>
              </b-row>
            </b-card-header>
            <b-row>&nbsp;</b-row>
            <b-row align="center">
              <b-col>
                <h5 v-if="structure1 === 'nationale'">Répartition des interventions par département</h5>
                <h5 v-else>
                  Répartition des interventions par département pour la structure :
                  <b>{{structure1}}</b>
                </h5>
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row align="center" class="mx-2">
              <b-col cols="4">Taux d'intervention départemental (en %) :</b-col>
              <b-col cols="1" class="legendCarte" style="background:#3f3f3f ; color:white">Aucune</b-col>
              <b-col cols="1" class="legendCarte" style="background:#B0E0E6">]0;3]</b-col>
              <b-col cols="1" class="legendCarte" style="background:#77B5FE">]3;6]</b-col>
              <b-col cols="1" class="legendCarte" style="background:#318CE7 ; color:white">]6;9]</b-col>
              <b-col cols="1" class="legendCarte" style="background:#4169E1 ; color:white">]9;12]</b-col>
              <b-col cols="1" class="legendCarte" style="background:#191970 ; color:white">+12</b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row>&nbsp;</b-row>
            <b-row>
              <b-col>
                <carte
                  v-if="loading === false"
                  :remplissage="remplissage"
                  :struc="structures"
                  :nb="statStructure"
                />
                <b-img fluid v-else :src="require('assets/giphy.gif')" />
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row>&nbsp;</b-row>
            <b-card-header header-tag="header" style="background:#d0eef2">
              <b-row></b-row>&nbsp;
              <b-row>
                <b-col style="text-align:center">
                  Structure principale :
                  <span class="liste-deroulante">
                    <b-form-select
                      v-model="structure2"
                      v-on:change="viewHisto(structure2,structure3);viewDoughnut(structure2)"
                    >
                      <option :value="'nationale'">Toutes</option>
                      <option
                        v-for="structure in structures"
                        :key="structure.str_libellecourt"
                        :value="structure.str_libellecourt"
                      >{{ structure.str_libellecourt}}</option>
                    </b-form-select>
                  </span>&nbsp;
                  Structure de comparaison :
                  <span class="liste-deroulante">
                    <b-form-select
                      v-model="structure3"
                      v-on:change="viewHisto(structure2,structure3)"
                    >
                      <option :value="''"></option>
                      <option :value="'nationale'">Toutes</option>
                      <option
                        v-for="structure in structures"
                        :key="structure.str_libellecourt"
                        :value="structure.str_libellecourt"
                      >{{ structure.str_libellecourt}}</option>
                    </b-form-select>
                  </span>
                </b-col>
              </b-row>
            </b-card-header>
            <b-row>&nbsp;</b-row>
            <b-row align="center">
              <b-col>
                <h5>Nb Interventions par bloc / Nb Attestations cumulé</h5>
                <h6 v-if="structure3==''">"{{structure2}}"</h6>
                <h6 v-else>"{{structure2}}" vs "{{structure3}}"</h6>
              </b-col>
              <b-col>
                <h5>Nb Interventions par Cadre / Nb attestations délivrées</h5>
                <h6 v-if="structure3==''">"{{structure2}}"</h6>
                <h6 v-else>"{{structure2}}" vs "{{structure3}}"</h6>
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row>&nbsp;</b-row>
            <b-row align="center">
              <b-col align-self="center">
                <bar-chart
                  v-if="loading === false"
                  :chartdata="data3"
                  :options="optionsHisto"
                  :width="400"
                  :height="400"
                />
                <b-img fluid v-else :src="require('assets/giphy.gif')" />
              </b-col>
              <b-col align-self="center">
                <bar-chart
                  v-if="loading === false"
                  :chartdata="data1"
                  :options="optionsHisto"
                  :width="400"
                  :height="400"
                />
                <b-img fluid v-else :src="require('assets/giphy.gif')" />
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row align="center">
              <b-col>
                <h5>Interventions par Bloc et par Cadre</h5>
                <h6>"{{structure2}}"</h6>
              </b-col>
              <b-col>
                <h5>Répartition des interventions par structure et par bloc</h5>
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
            <b-row align="center">
              <b-col align-self="center">
                <doughnut-chart
                  v-if="loading === false"
                  :chartdata="data2"
                  :options="optionsDoughnut"
                  :width="400"
                  :height="400"
                />
                <b-img fluid v-else :src="require('assets/giphy.gif')" />
              </b-col>
                <b-col align-self="center">
                <doughnut-chart
                  v-if="loading === false"
                  :chartdata="data4"
                  :options="optionsDoughnut"
                  :width="400"
                  :height="400"
                />
                <b-img fluid v-else :src="require('assets/giphy.gif')" />
              </b-col>
            </b-row>
            <b-row>&nbsp;</b-row>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)" />
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
                    Commentaires saisis par les intervenants
                  </h4>
                </b-btn>
              </b-col>
            </b-form-row>
          </b-card-header>
          <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <editable
                :columns="headersCom"
                :data="commentaires"
                :removable="false"
                :creable="false"
                :editable="false"
                :noDataLabel="''"
                tableMaxHeight="none"
                :loading="loading"
                :defaultSortField="{ key: 'id', order: 'asc' }"
              ></editable>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
    </b-row>
    <modal name="editUser" height="auto" width="900px" :scrollabe="true">
      <user />
    </modal>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import Editable from "~/components/editable/index.vue";
import user from "~/components/user.vue";
import BarChart from "~/components/histogramme.vue";
import DoughnutChart from "~/components/doughnut.vue";
import Carte from "~/components/carte.vue";
import stat from "~/lib/mixins/stat";

export default {
  mixins: [stat],
  components: {
    Editable,
    user,
    BarChart,
    DoughnutChart,
    Carte
  },
  data() {
    return {
      hover: false,
      remplissage: null,
      statStructure: null,
      structure1: "nationale",
      structure2: "nationale",
      structure3: "",
      data1: null,
      data2: null,
      data3: null,
      optionsHisto: null,
      optionsDoughnut: null,
      loading: true,
      commentaires: null,
      headers: [
        { path: "id", title: "N° d'utilisateur", type: "text", sortable: true },
        { path: "proLibelle", title: "Rôle", type: "date", sortable: true },
        { path: "nom", title: "Nom", type: "date", sortable: true },
        { path: "prenom", title: "Prénom", type: "text", sortable: true },
        {
          path: "structureLibelleCourt",
          title: "Structure",
          type: "text",
          sortable: true
        },
        {
          path: "inscription",
          title: "Inscription",
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
      ]
    };
  },

  methods: {
    viewCarte(str) {
      this.remplissage = this.$store.state.statStructure[
        str
      ].CouleurParDepartement;
    },
    viewHisto(str1, str2) {
      if (str2 != "") {
        this.data1 = {
          labels: this.$store.state.statStructure["nationale"].labelsHisto,
          datasets: [
            {
              type: "line",
              fill: false,
              label: "Nb att-" + str1,
              borderColor: "#07509e",
              backgroundColor: "#07509e",
              yAxisID: "B",
              data: this.$store.state.statStructure[str1].nbAtt
            },
            {
              type: "line",
              fill: false,
              label: "Nb att-" + str2,
              borderColor: "#000000",
              backgroundColor: "#000000",
              yAxisID: "B",
              data: this.$store.state.statStructure[str2].nbAtt
            },
            {
              label: "sco-" + str1,
              backgroundColor: "#29BF12",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntSco
            },
            {
              label: "péri-sco-" + str1,
              backgroundColor: "#9543D8",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntPer
            },
            {
              label: "ext sco-" + str1,
              backgroundColor: "#E4FC2E",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntExt
            },
            {
              label: "sco-" + str2,
              backgroundColor: "#9AB9A7",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntSco
            },
            {
              label: "péri-sco-" + str2,
              backgroundColor: "#4A5759",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntPer
            },
            {
              label: "ext sco-" + str2,
              backgroundColor: "#B6B4AC",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntExt
            }
          ]
        };
        // Définition de l'objet Data envoyé au 3eme graphique
        this.data3 = {
          labels: this.$store.state.statStructure["nationale"].labelsHisto,
          datasets: [
            {
              type: "line",
              fill: false,
              label: "Cum. att.-" + str1,
              backgroundColor: "#07509e",
              borderColor: "#07509e",
              yAxisID: "B",
              data: this.$store.state.statStructure[str1].nbAttCumule
            },
            {
              type: "line",
              fill: false,
              label: "Cum. att.-" + str2,
              backgroundColor: "#000000",
              borderColor: "#000000",
              yAxisID: "B",
              data: this.$store.state.statStructure[str2].nbAttCumule
            },
            {
              label: "bl. 1-" + str1,
              backgroundColor: "#FF9914",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc1
            },
            {
              label: "bl. 2-" + str1,
              backgroundColor: "#F21B3F",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc2
            },
            {
              label: "bl. 3-" + str1,
              backgroundColor: "#08BDBD",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc3
            },
            {
              label: "bl. 1-" + str2,
              backgroundColor: "#9AB9A7",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntBloc1
            },
            {
              label: "bl. 2" + str2,
              backgroundColor: "#4A5759",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntBloc2
            },
            {
              label: "bl. 3" + str2,
              backgroundColor: "#B6B4AC",
              yAxisID: "A",
              stack: "st2",
              data: this.$store.state.statStructure[str2].nbIntBloc3
            }
          ]
        };
        // Définition des options du 1er et 3eme grahiques
        this.optionsHisto = {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
            display: true
          },
          scales: {
            xAxes: [
              {
                id: "st1",
                stacked: true,
                categoryPercentage: 0.7,
                barPercentage: 1
              },
              {
                id: "st2",
                stacked: true,
                categoryPercentage: 0.7,
                display: false,
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
      } else {
        this.data1 = {
          labels: this.$store.state.statStructure["nationale"].labelsHisto,
          datasets: [
            {
              type: "line",
              fill: false,
              label: "Nb att." + str1,
              borderColor: "#07509e",
              backgroundColor: "#07509e",
              yAxisID: "B",
              data: this.$store.state.statStructure[str1].nbAtt
            },
            {
              label: "sco-" + str1,
              backgroundColor: "#29BF12",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntSco
            },
            {
              label: "péri-sco-" + str1,
              backgroundColor: "#9543D8",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntPer
            },
            {
              label: "ext sco-" + str1,
              backgroundColor: "#E4FC2E",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntExt
            }
          ]
        };
        // Définition de l'objet Data envoyé au 3eme graphique
        this.data3 = {
          labels: this.$store.state.statStructure["nationale"].labelsHisto,
          datasets: [
            {
              type: "line",
              fill: false,
              label: "Cum. att-" + str1,
              backgroundColor: "#07509e",
              borderColor: "#07509e",
              yAxisID: "B",
              data: this.$store.state.statStructure[str1].nbAttCumule
            },
            {
              label: "bl. 1-" + str1,
              backgroundColor: "#FF9914",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc1
            },
            {
              label: "bl. 2-" + str1,
              backgroundColor: "#F21B3F",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc2
            },
            {
              label: "bl. 3-" + str1,
              backgroundColor: "#08BDBD",
              yAxisID: "A",
              stack: "st1",
              data: this.$store.state.statStructure[str1].nbIntBloc3
            }
          ]
        };
        // Définition des options du 1er et 3eme grahiques
        this.optionsHisto = {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
            display: true
          },
          scales: {
            xAxes: [
              {
                id: "st1",
                stacked: true,
                categoryPercentage: 0.7,
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
      }
    },
    viewDoughnut(str1) {
      // Définition de l'objet Data envoyé au 2eme graphique
      this.data2 = {
        datasets: [
          {
            backgroundColor: ["#FF9914", "#F21B3F", "#08BDBD"],
            data: [
              this.$store.state.statStructure[str1].nbBloc1Rel,
              this.$store.state.statStructure[str1].nbBloc2Rel,
              this.$store.state.statStructure[str1].nbBloc3Rel
            ],
            labels: ["Bl. 1-" + str1, "Bl. 2-" + str1, "Bl. 3-" + str1]
          },
          {
            backgroundColor: [
              "#29BF12",
              "#9543D8",
              "#E4FC2E",
              "#29BF12",
              "#9543D8",
              "#E4FC2E",
              "#29BF12",
              "#9543D8",
              "#E4FC2E"
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
              this.$store.state.statStructure[str1].IntParBlocParCadre[0],
              this.$store.state.statStructure[str1].IntParBlocParCadre[1],
              this.$store.state.statStructure[str1].IntParBlocParCadre[2],
              this.$store.state.statStructure[str1].IntParBlocParCadre[3],
              this.$store.state.statStructure[str1].IntParBlocParCadre[4],
              this.$store.state.statStructure[str1].IntParBlocParCadre[5],
              this.$store.state.statStructure[str1].IntParBlocParCadre[6],
              this.$store.state.statStructure[str1].IntParBlocParCadre[7],
              this.$store.state.statStructure[str1].IntParBlocParCadre[8]
            ]
          }
        ],
        labels: ["Bloc 1", "Bloc 2", "Bloc 3"]
      };

      // Définition des options du 2eme et 4eme grahiques
      this.optionsDoughnut = {
        responsive: false,
        maintainAspectRatio: true,
        legend: {
          display: true,
          onClick: function(e, legendItem) {
            var ci = this.chart;
            var bloc = ci.getDatasetMeta(0);
            var cai = ci.getDatasetMeta(1);
            if (bloc.data[legendItem.index].hidden) {
              bloc.data[legendItem.index].hidden = false;
              cai.data[3 * legendItem.index].hidden = false;
              cai.data[3 * legendItem.index + 1].hidden = false;
              cai.data[3 * legendItem.index + 2].hidden = false;
            } else {
              bloc.data[legendItem.index].hidden = true;
              cai.data[3 * legendItem.index].hidden = true;
              cai.data[3 * legendItem.index + 1].hidden = true;
              cai.data[3 * legendItem.index + 2].hidden = true;
            }
            ci.update();
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
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
          const fileName = "Savoir Rouler - Intervenants.csv";
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
    }
  },
  computed: mapState(["interventions", "users", "documents", "structures"]),

  //  CHARGEMENT ASYNCHRONE DES USERS
  //
  async mounted() {
    this.loading = true;
    const url = process.env.API_URL + "/user";
    //await this.$axios.$get(url)
    await Promise.all([
      this.$store
        .dispatch("get_users")
        .then(response => {})
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération des users",
            error
          );
        }),
      this.$store.dispatch("get_interventions"),
      this.$store.dispatch("get_structures")
    ]);
    // Calcul des stats définies dans le mixins stat.js
    this.statCal(this.interventions, this.structures);
    // on positionne structure1 sur la structure de l'utilisateur
     this.structures.forEach(x => {
       if (String(x.str_id) === String(this.$store.state.utilisateurCourant.structureId)) {
        this.structure1 = String(x.str_libellecourt)
        this.structure2 = this.structure1;
        }
     });
    (this.remplissage = this.$store.state.statStructure[
      this.structure1
    ].CouleurParDepartement),
      (this.statStructure = this.$store.state.statStructure);

    // Affichage des graphiques
    this.viewHisto(this.structure2, this.structure3);
    this.viewDoughnut(this.structure2);
    this.loading = false;
  }
};
</script>

<style>
.legendCarte {
  font-size: 14px;
  border-radius: 10px;
  text-align: center;
  vertical-align: center;
  color: black;
}

.links {
  padding-top: 15px;
}

.fcBtn {
  cursor: pointer;
}
</style>
