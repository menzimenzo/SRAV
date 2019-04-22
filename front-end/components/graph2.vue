
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Doughnut } from "vue-chartjs";

function CalcStat(interventions) {
  interventions.forEach(element => {
    let blocId = element.blocId - 1;
    let cai = element.cai - 1;
    IntParBloc[blocId] = IntParBloc[blocId] + 1;
    let indice = blocId * 3 + cai;
    IntParBlocParCadre[indice] = IntParBlocParCadre[indice] + 1;
  });

  //on passe de valeures absolues en pourcentage
  for (var i = 0; i < IntParBloc.length; i++) {
    IntParBloc[i] = Math.round((IntParBloc[i] / interventions.length) * 100);
  }
  for (var i = 0; i < IntParBlocParCadre.length; i++) {
    IntParBlocParCadre[i] = Math.round(
      (IntParBlocParCadre[i] / interventions.length) * 100
    );
  }
}

let IntParBloc = [0, 0, 0];
let IntParBlocParCadre = [0, 0, 0, 0, 0, 0, 0, 0, 0];

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
