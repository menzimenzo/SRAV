
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Bar, Line } from "vue-chartjs";

function CalcStat(interventions) {
      interventions.forEach(element => {
        let mois = element.dateIntervention.getMonth()
        let cai = element.cai 
        //console.log('CAI' + cai)
        switch (cai)
        {
          case '1':
            NbIntSco[mois]=NbIntSco[mois] + 1;
            //console.log(mois + ' ' + cai + ' ' +NbIntSco[mois])
          case '2' :
            NbIntPer[mois]=NbIntPer[mois] + 1;
            //console.log(mois + ' ' + cai + ' ' +NbIntPer[mois])
          case '3' :
            NbIntExt[mois]=NbIntExt[mois] + 1;
            //console.log(mois + ' ' + cai + ' ' +NbIntExt[mois])
        }
      });
    }

let NbIntSco = [0,0,0,0,0,0,0,0,0,0,0,0];
let NbIntPer = [0,0,0,0,0,0,0,0,0,0,0,0];
let NbIntExt = [0,0,0,0,0,0,0,0,0,0,0,0];

export default {
  extends: Bar,
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
      console.log('SColaire'+NbIntSco + 'Peri'+ NbIntPer + 'Extra'+NbIntExt)
      this.renderChart(
      {
        labels: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre" ],
        datasets: [
          { label: "scolaire", backgroundColor: "#f87979", data: NbIntSco },
          { label: "péri-scolaire", backgroundColor: "#3D5B96", data: NbIntPer },
          { label: "extra scolaire", backgroundColor: "#1EFFFF", data: NbIntExt },
        ]
      },
      { 
        responsive: true, 
        //maintainAspectRatio: true,
        scales: {
          xAxes: [{
            stacked: true,
            categoryPercentage: 0.5,
            barPercentage: 1
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    );
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
