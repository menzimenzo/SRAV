
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Doughnut } from "vue-chartjs";

function CalcStat(interventions) {
  var nbMaxStructureAffichees = 14;
  interventions.forEach(element => {
    let structure = element.structure;
    let bloc = element.blocId;

    if (!IntParStructure[structure]) {
      IntParStructure[structure] = { total: 0, bloc1: 0, bloc2: 0, bloc3: 0 };
    }
    IntParStructure[structure].total++;
    switch (bloc) {
      case "1":
        IntParStructure[structure].bloc1++;
        break;
      case "2":
        IntParStructure[structure].bloc2++;
        break;
      case "3":
        IntParStructure[structure].bloc3++;
        break;
    }
  });

  // Tri par ordre decroissant et regroupement des petites structures entre elles si trop nombreuses
  var keys = Object.keys(IntParStructure);
  keys.sort(function(a, b) {
    return IntParStructure[b] - IntParStructure[a];
  });

  if (keys.length > nbMaxStructureAffichees) {
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
            (Number(IntParStructure[k].total) / interventions.length) * 100
          )
        );
        SubDataToDisplay.push(
          Math.round(
            (Number(IntParStructure[k].bloc1) / interventions.length) * 100
          )
        );
        SubDataToDisplay.push(
          Math.round(
            (Number(IntParStructure[k].bloc2) / interventions.length) * 100
          )
        );
        SubDataToDisplay.push(
          Math.round(
            (Number(IntParStructure[k].bloc3) / interventions.length) * 100
          )
        );
        LabelsToDisplay.push(k);
        SubLabelsToDisplay.push(k + " / bloc 1");
        SubLabelsToDisplay.push(k + " / bloc 2");
        SubLabelsToDisplay.push(k + " / bloc 3");
      }
    });
    DataToDisplay.push(
      Math.round((nbAutre.total / interventions.length) * 100)
    );
    SubDataToDisplay.push(
      Math.round((nbAutre.bloc1 / interventions.length) * 100)
    );
    SubDataToDisplay.push(
      Math.round((nbAutre.bloc2 / interventions.length) * 100)
    );
    SubDataToDisplay.push(
      Math.round((nbAutre.bloc3 / interventions.length) * 100)
    );
    LabelsToDisplay.push("Autre");
    SubLabelsToDisplay.push("Autre / bloc 1");
    SubLabelsToDisplay.push("Autre / bloc 2");
    SubLabelsToDisplay.push("Autre / bloc 3");
  } else {
    keys.forEach(function(k) {
      DataToDisplay.push(
        Math.round(
          (Number(IntParStructure[k].total) / interventions.length) * 100
        )
      );
      SubDataToDisplay.push(
        Math.round(
          (Number(IntParStructure[k].bloc1) / interventions.length) * 100
        )
      );
      SubDataToDisplay.push(
        Math.round(
          (Number(IntParStructure[k].bloc2) / interventions.length) * 100
        )
      );
      SubDataToDisplay.push(
        Math.round(
          (Number(IntParStructure[k].bloc3) / interventions.length) * 100
        )
      );
      LabelsToDisplay.push(k);
      SubLabelsToDisplay.push(k + " / bloc 1");
      SubLabelsToDisplay.push(k + " / bloc 2");
      SubLabelsToDisplay.push(k + " / bloc 3");
    });
  }
}

let IntParStructure = {};
let DataToDisplay = [];
let SubDataToDisplay = [];
let LabelsToDisplay = [];
let SubLabelsToDisplay = [];

export default {
  extends: Doughnut,
  props: {
    chartdata: {
      type: Array,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    interventions() {
      CalcStat(this.interventions);
      this.renderChart(
        {
          
        },
        {
          responsive: false,
          maintainAspectRatio: true,
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text:
              "Répartition interventions par Bloc et par Cadre d'intervention"
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
        }
      );
    }
  },
  computed: {
    ...mapState(["interventions"])
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
