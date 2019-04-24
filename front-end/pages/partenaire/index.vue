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
          <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
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
                <b-img :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)"/>
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
                    Accès aux indicateurs : {{NbAttestations}} attestations enregistrées
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
          <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
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
              <b-col>&nbsp;</b-col>
            </b-row>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-3">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-form-row>
              <b-col>
                <!-- IMAGE RAYEE BANNER INTERVENTION -->
                <b-img :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)"/>
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
                :data="interventions"
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
      <user/>
    </modal>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import Editable from "~/components/editable/index.vue";
import user from "~/components/user.vue";
import BarChart from "~/components/histogramme.vue";
import DoughnutChart from "~/components/doughnut.vue";

export default {
  components: {
    Editable,
    user,
    BarChart,
    DoughnutChart
  },
  data() {
    return {
      data1: null,
      data2: null,
      data3: null,
      optionsHisto: null,
      optionsDoughnut: null,
      NbAttestations: null,
      loading: true,
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
    calcStat: function(intervention) {
      let NbIntBloc1 = [];
      let NbIntBloc2 = [];
      let NbIntBloc3 = [];
      let NbIntSco = [];
      let NbIntPer = [];
      let NbIntExt = [];
      let labelsHisto = [];
      let NbAtt = [];
      let NbAttCumule = [];
      let IntParBloc = [0, 0, 0];
      let IntParBlocParCadre = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let NbAttestations = 0;
      let data1 = {};
      let data2 = {};
      let data3 = {};
      let data4 = {};
      let optionsHisto = {};
      let optionsDoughnut = {};
      // nb de structures affichées sur le 4eme graphique.
      // S'il y a plus de nbMaxStructureAffichees structures on affiches les nbMaxStructureAffichees premieres + "Autres"
      const nbMaxStructureAffichees = 8;
      const moisRef = 1;
      const anneeRef = 118;

      intervention.forEach(element => {
        let mois = element.dateIntervention.getMonth();
        let annee = element.dateIntervention.getYear();
        let blocId = Number(element.blocId);
        let nbEnfants = Number(element.nbEnfants);
        let cai = Number(element.cai);
        let structure = element.structure;
        let indice = 0;
        let indiceMensuel =
          Number(annee - anneeRef) * 12 + Number(mois - moisRef + 1);

        //G2
        IntParBloc[blocId - 1] = IntParBloc[blocId - 1] + 1;
        indice = (blocId - 1) * 3 + cai - 1;
        IntParBlocParCadre[indice] = IntParBlocParCadre[indice] + 1;

        // Si blocid = 3 alors il y a attestation
        if (blocId === 3) {
          if (!NbAtt[indiceMensuel]) {
            NbAtt[indiceMensuel] = 0;
          }
          NbAtt[indiceMensuel] = NbAtt[indiceMensuel] + nbEnfants;
          this.NbAttestations = this.NbAttestations + nbEnfants;
        }

        // incrementation du tableau des etiquettes d'abscisses
        if (mois + 1 < 10) {
          labelsHisto[indiceMensuel] =
            Number(1900 + annee) + "-0" + Number(mois + 1);
        } else {
          labelsHisto[indiceMensuel] =
            Number(1900 + annee) + "-" + Number(mois + 1);
        }

        switch (blocId) {
          case 1:
            if (!NbIntBloc1[indiceMensuel]) {
              NbIntBloc1[indiceMensuel] = 1;
            } else {
              NbIntBloc1[indiceMensuel]++;
            }
            break;
          case 2:
            if (!NbIntBloc2[indiceMensuel]) {
              NbIntBloc2[indiceMensuel] = 1;
            } else {
              NbIntBloc2[indiceMensuel]++;
            }
            break;
          case 3:
            if (!NbIntBloc3[indiceMensuel]) {
              NbIntBloc3[indiceMensuel] = 1;
            } else {
              NbIntBloc3[indiceMensuel]++;
            }
            break;
        }

        switch (cai) {
          case 1:
            if (!NbIntSco[indiceMensuel]) {
              NbIntSco[indiceMensuel] = 1;
            } else {
              NbIntSco[indiceMensuel]++;
            }
            break;
          case 2:
            if (!NbIntPer[indiceMensuel]) {
              NbIntPer[indiceMensuel] = 1;
            } else {
              NbIntPer[indiceMensuel]++;
            }
            break;
          case 3:
            if (!NbIntExt[indiceMensuel]) {
              NbIntExt[indiceMensuel] = 1;
            } else {
              NbIntExt[indiceMensuel]++;
            }
            break;
        }
      });

      for (var i = 0; i < labelsHisto.length; i++) {
        // initialisation des mois "vides"
        if (!NbAtt[i]) {
          NbAtt[i] = 0;
        }
        if (!NbAttCumule[i]) {
          NbAttCumule[i] = 0;
        }
        if (!NbIntBloc1[i]) {
          NbIntBloc1[i] = 0;
        }
        if (!NbIntBloc2[i]) {
          NbIntBloc2[i] = 0;
        }
        if (!NbIntBloc3[i]) {
          NbIntBloc3[i] = 0;
        }
        if (!NbIntSco[i]) {
          NbIntSco[i] = 0;
        }
        if (!NbIntExt[i]) {
          NbIntExt[i] = 0;
        }
        if (!NbIntPer[i]) {
          NbIntPer[i] = 0;
        }
        // Calcul des interventions cumulees
        if (i == 0) {
          NbAttCumule[i] = NbAtt[i];
        } else {
          NbAttCumule[i] = NbAttCumule[i - 1] + NbAtt[i];
        }
      }
      //on passe des valeurs absolues en pourcentage
      for (var i = 0; i < IntParBloc.length; i++) {
        IntParBloc[i] = Math.round((IntParBloc[i] / intervention.length) * 100);
      }
      for (var i = 0; i < IntParBlocParCadre.length; i++) {
        IntParBlocParCadre[i] = Math.round(
          (IntParBlocParCadre[i] / intervention.length) * 100
        );
      }

      // pour les graph 1 et 3, on ne garde que 14 mois (12 avant le mois courant et 2 apres le mois courant)
      const today = new Date();
      const moisCourant = today.getMonth();
      const anneeCourant = today.getYear();
      let indiceCourant =
        Number(anneeCourant - anneeRef) * 12 +
        Number(moisCourant - moisRef + 1);
      // on efface tous les mois inférieurs au mois courant -12
      for (var i = 0; i < indiceCourant - 12; i++) {
        NbIntSco.shift();
        NbAtt.shift();
        NbIntPer.shift();
        NbIntExt.shift();
        NbAttCumule.shift();
        NbIntBloc1.shift();
        NbIntBloc2.shift();
        NbIntBloc3.shift();
        labelsHisto.shift();
      }
      // on efface tous les mois supérieurs au mois courant +2
      while (labelsHisto.length > 15) {
        NbIntSco.pop();
        NbAtt.pop();
        NbIntPer.pop();
        NbIntExt.pop();
        NbAttCumule.pop();
        NbIntBloc1.pop();
        NbIntBloc2.pop();
        NbIntBloc3.pop();
        labelsHisto.pop();
      }
      // Définition de l'objet Data envoyé au 1er graphique
      (this.data1 = {
        labels: labelsHisto,
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
          labels: labelsHisto,
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
            {
              label: "bloc 1",
              backgroundColor: "#66ff66",
              yAxisID: "A",
              data: NbIntBloc1
            },
            {
              label: "bloc 2",
              backgroundColor: "#996633",
              yAxisID: "A",
              data: NbIntBloc2
            },
            {
              label: "bloc 3",
              backgroundColor: "#ffcc00",
              yAxisID: "A",
              data: NbIntBloc3
            }
          ]
        }),
        // Définition des options du 1er et 3eme grahiques
        (this.optionsHisto = {
          //responsive: true,
          //maintainAspectRatio: true,
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
        });
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
      console.log(this.data1.labels)
      console.log(this.data1.datasets[0].data)
      console.log(this.data1.datasets[1].data)
      console.log(this.data1.datasets[2].data)
      console.log(this.data1.datasets[3].data)
    }
  },
  computed: mapState(["interventions", "users"]),

  //  CHARGEMENT ASYNCHRONE DES USERS
  //
  async mounted() {
    this.loading = true;
    const url = process.env.API_URL + "/user";
    //await this.$axios.$get(url)
    await Promise.all([
      this.$store
        .dispatch("get_users")
        .then(response => {
        })
        .catch(error => {
          console.error(
            "Une erreur est survenue lors de la récupération des users",
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
