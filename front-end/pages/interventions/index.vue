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
                  <b-img fluid :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,0.5)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion1 variant="Dark link">
                    <h4 v-if='!interventionCourrante'>
                      <i class="material-icons accordion-chevron" >chevron_right</i> Je saisis une intervention
                    </h4>
                    <h4 v-if='interventionCourrante'> <i class="material-icons accordion-chevron" >chevron_right</i>
                      Intervention n°{{interventionCourrante.id}} du {{interventionCourrante.dateIntervention}} à {{interventionCourrante.commune.com_libellemaj}}</h4>
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion1" v-if='interventionCourrante' visible accordion="my-accordion" role="tabpanel">
                <Intervention :intervention="interventionCourrante"/>
            </b-collapse>
            <b-collapse id="accordion1" v-if='!interventionCourrante' accordion="my-accordion" role="tabpanel">
                <Intervention :intervention="interventionCourrante"/>
            </b-collapse>
          </b-card>
          <!--  ACCORDEON -- MES INTERVENTIONS -->
          <b-card no-body class="mb-3">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-form-row>
                <b-col>
                  <!-- IMAGE RAYEE BANNER INTERVENTION -->
                  <b-img  :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion2 variant="Dark link"><h4><i class="material-icons accordion-chevron" >chevron_right</i> Mes interventions</h4></b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <editable :columns="headers" :data="interventions" :removable="false" :creable="false" 
                  :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading">
                  <template slot-scope="props" slot="actions">
                    <b-btn @click="editIntervention(props.data.id)" size="sm" class="mr-1" variant="primary">
                      <i class="material-icons" >edit</i>
                    </b-btn>
                    <b-btn @click="downloadPdf(props.data.id)" size="sm" class="ml-1" variant="primary">
                      <i class="material-icons" >cloud_download</i>
                    </b-btn>
                  </template>
                </editable>
              </b-card-body>
            </b-collapse>
          </b-card>   
          <!--  ACCORDEON -- DOCUMENTS -->
          <b-card no-body class="mb-3">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-form-row>
                <b-col>
                  <!-- IMAGE RAYEE BANNER INTERVENTION -->
                  <b-img  :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion3 variant="Dark link"><h4><i class="material-icons accordion-chevron" >chevron_right</i>Documents</h4></b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <ul>
                  <li>
                    Livret savoir rouler
                    <b-img class="img-icon" fluid :src="require('assets/pdf-240x240.png')" blank-color="rgba(0,0,0,0.5)" />
                  </li>
                </ul>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Intervention from '~/components/Intervention.vue'
import { mapState } from 'vuex'
import Editable from '~/components/editable/index.vue'

export default {
  components: {
    Intervention, Editable
  },
  data() {
    return {
      loading: true,
      headers: [
        
        { path: 'blocId', title: 'N° d\'intervention', type: 'text', sortable:true},
        { path: 'dateIntervention', title: 'Date d\'intervention', type: 'date', sortable:true},
        { path: 'dateCreation', title: 'Date de création', type: 'date', sortable:true},
        { path: 'nbEnfants', title: 'Nombre d\'enfants', type: 'text', sortable:true},
        { path: 'commune.com_libellemaj', title: 'Commune', type: 'text', sortable:true},
        { path: '__slot:actions', title: 'Actions', type: '__slot:actions', sortable:false},
           
      ]
    };
  },
  computed: mapState(['interventions', 'interventionCourrante']),
  methods: {
//
//  fonction de recupération des infos d'une intervention par id
//
    editIntervention: function (idIntervention) {
      return this.$store.dispatch('get_intervention', idIntervention)
        .catch(error => {
          console.error('Une erreur est survenue lors de la récupération du détail de l\'intervention', error)
        })
    },
    downloadPdf: function(id) {
      this.$axios({
        url: process.env.API_URL + '/pdf/'+id,
        method: 'GET',
        responseType: 'blob', // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${id}.pdf`); //or any other extension
          document.body.appendChild(link);
          link.click();
      })
    }
  },
//
//  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
//
  async mounted() {
    console.info("mounted", { interventions: this.interventions});
    const url = process.env.API_URL + '/interventions'
    await this.$axios.$get(url)
        .then(async response => {
          await this.$store.commit('set_interventionCourrantes', response.interventions)
          this.loading = false
          console.info("fetched interventions - done", { interventions: this.interventions});
            // this.interventions = response.interventions
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la récupération des interventions', error)
          this.$store.commit('clean_interventions')
        })
  }
};
</script>

<style>
.accordionBtn{
  text-align: left;
}

.accordionBtn:focus {
  box-shadow: none;
}

.accordion-chevron{
  position: relative;
  top: 5px;

  -webkit-transition: 0.4s ease-in-out;
  -moz-transition: 0.4s ease-in-out;
  -o-transition: 0.4s ease-in-out;
  transition: 0.4s ease-in-out;
  color: #252195;
}

a:not(.collapsed) .accordion-chevron{
  -webkit-transform: rotate(90deg);
  transform:rotate(90deg);
  -moz-transform:rotate(90deg);

}

.btn .material-icons{
 position: relative;
 top: 2px;
}
</style>
