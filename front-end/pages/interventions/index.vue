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
                    <h4 >
                      <i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-1" >create</i> Je saisis une intervention
                    </h4>
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
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
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion2 variant="Dark link"><h4>
                    <i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-1" >list</i> Mes interventions
                  </h4></b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-container >
                  <b-row>
                      <b-col cols="12">
                        <editable :columns="headers" :data="interventions" :removable="false" :creable="false" 
                          :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading" v-if="interventions.length > 0">
                          <template slot-scope="props" slot="actions">
                            <div style="min-width: 100px;">
                              <b-btn @click="editIntervention(props.data.id)" size="sm" class="mr-1" variant="primary">
                                <i class="material-icons" >edit</i>
                              </b-btn>
                              <b-btn @click="downloadPdf(props.data.id)" v-if="props.data.blocId == '3'" size="sm" class="ml-1" variant="primary">
                                <i class="material-icons" >cloud_download</i>
                              </b-btn>
                            </div>
                          </template>
                        </editable>
                        <h4 class="text-center" v-if="interventions.length == 0">
                          Aucune intervention n'a été crée pour le moment.
                        </h4>
                    </b-col>
                  </b-row>
                </b-container>
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
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion3 variant="Dark link"><h4>
                    <i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-2" >bookmarks</i>Documents
                  </h4></b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-container >
                  <b-row>
                      <b-col cols="12">
                        <h5 class="mb-3">Documents disponibles: </h5>
                        <ul>
                          <li>
                            Livret savoir rouler
                            <b-img class="img-icon" fluid :src="require('assets/pdf-240x240.png')" blank-color="rgba(0,0,0,0.5)" />
                          </li>
                        </ul>
                      </b-col>
                  </b-row>
                </b-container>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
    </b-row>
    <modal name="editIntervention" height="auto" width="900px" @close="clearIntervention()" :scrollabe="true">
      <Intervention :intervention="interventionCourrante"/>
    </modal>
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
        
        { path: 'id', title: 'N° d\'intervention', type: 'text', sortable:true},
        { path: 'commune.com_libellemaj', title: 'Commune', type: 'text', sortable:true},
        { path: 'dateIntervention', title: 'Date d\'intervention', type: 'date', sortable:true, filter:"date"},
        { path: 'dateCreation', title: 'Création', type: 'date', sortable:true, filter:"timestamp"},
        { path: 'dateMaj', title: 'Modification', type: 'date', sortable:true, filter:"timestamp"},
        { path: 'nbEnfants', title: 'Nombre d\'enfants', type: 'text', sortable:true},
        { path: '__slot:actions', title: 'Actions', type: '__slot:actions', sortable:false}
           
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
        .then(() => {
          this.$modal.show('editIntervention')
        })
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
    },
    clearIntervention(){
      this.$store.dispatch('reset_interventions')
    }
  },
//
//  CHARGEMENT ASYNCHRONE DES INTERVENTIONS
//
  async mounted() {
    await this.$store.dispatch('get_interventions');
    this.loading = false
    console.info("mounted", { interventions: this.interventions});
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
