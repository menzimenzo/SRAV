
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Pie } from "vue-chartjs";

function CalcStat(interventions) {
      interventions.forEach(element => {
        let blocId = element.blocId - 1
        console.log('BLO ' + blocId)
        IntParBloc[blocId] = IntParBloc[blocId]+1
      });
    }

let IntParBloc = [0,0,0,];

export default {
  extends: Pie,
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
      //CalcStat(this.interventions);
      //console.log('BLoc'+IntParBloc)
      this.renderChart(
      {
        //labels: ["Bloc 1","Bloc 2","Bloc 3" ],
        /*datasets: [
          { label: "bloc 1", backgroundColor: "#f87979", data: IntParBloc[0] },
          { label: "bloc 2", backgroundColor: "#3D5B96", data: IntParBloc[1] },
          { label: "bloc 3", backgroundColor: "#1EFFFF", data: IntParBloc[2] }
        ]
      },
      { 
        responsive: true, 
        //maintainAspectRatio: true
      }
    );*/
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
          {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [40, 20, 80, 10]
          }
    ]
      }, 
    {
      responsive: true, 
      maintainAspectRatio: true,
      pieceLabel: {
        mode: 'percentage',
        precision: 1
      }
    }
    )
  }
  },  
  computed: {
    ...mapState(["interventions"])
  }
}
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
