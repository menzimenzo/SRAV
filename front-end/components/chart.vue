
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Bar, Line } from "vue-chartjs";


let NbIntSco = [0,0,0,0,0,0,0,0,0,0,0,0];
let NbIntPer = [0,0,0,2,3,0,0,0,0,0,0,0];
let NbIntExt = [0,0,0,0,1,0,0,0,0,0,0,0];

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
  methods:  {
    CalcStat() {
      this.$store.state.interventions.forEach(element => {
        let mois = element.dateIntervention.getMonth()
        let cai = element.cai -1
        switch (cai)
        {
          case '0' :
            NbIntSco[mois]=NbIntSco[mois] + 1;
            console.log(Mois + ' ' + cai + ' ' +NbIntSco[mois])
          case '1' :
            NbIntPer[mois]=NbIntPer[mois] + 1;
            console.log(Mois + ' ' + cai + ' ' +NbIntPer[mois])
          case '2' :
            console.log(Mois + ' ' + cai + ' ' +NbIntExt[mois])
        }
      });
    }
  },
  async mounted() {
    // Overwriting base render method with actual data.
    await Promise.all([
      this.$store.dispatch("get_interventions"), 
    ])
    //this.CalcStat()
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
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            //categoryPercentage: 0.5,
            //barPercentage: 1
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    );
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
