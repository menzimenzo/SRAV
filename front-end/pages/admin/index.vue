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
                  <b-img fluid :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,0.5)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion1 variant="Dark link">
                      Liste des utilisateurs
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <editable :columns="headers" :data="users" :removable="false" :creable="false" 
                  :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading">
                  <template slot-scope="props" slot="actions">
                    <!--<b-btn @click="editIntervention(props.data.id)" size="sm" class="mr-1" variant="primary">
                      <i class="material-icons" >edit</i>
                    </b-btn>
                    <b-btn @click="downloadPdf(props.data.id)" size="sm" class="ml-1" variant="primary">
                      <i class="material-icons" >cloud_download</i>
                    </b-btn>-->
                  </template>
                </editable>   
                </b-card-body>
            </b-collapse>

          </b-card>
          <!--  ACCORDEON -- MES INTERVENTIONS -->
          <b-card no-body class="mb-3">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-form-row>
                <b-col>
                  <!-- IMAGE RAYEE BANNER INTERVENTION -->
                  <b-img  :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion2 variant="Dark link">
                    Title 2
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>

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
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion3 variant="Dark link">
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
              <b-card-body>

              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import Editable from '~/components/editable/index.vue'

export default {
   components: {
    Editable
  },
   data() {
     return {
       users: [],
       headers: [
        
        { path: 'id', title: 'N° d\'utilisateur', type: 'text', sortable:true},
        { path: 'profil', title: 'Rôle', type: 'date', sortable:true},
        { path: 'nom', title: 'Nom', type: 'date', sortable:true},
        { path: 'prenom', title: 'Prénom', type: 'text', sortable:true},
        { path: 'structure', title: 'structure', type: 'text', sortable:true},
        { path: '__slot:actions', title: 'Actions', type: '__slot:actions', sortable:false},
           
      ]
     };
   },
  computed: mapState([]),
  methods: {

  },
//
//  CHARGEMENT ASYNCHRONE DES USERS
//
  async mounted() {
    const url = process.env.API_URL + '/user'
    await this.$axios.$get(url)
        .then(response => {

          this.users = response.users
        })
        .catch(error => {

        })
  }
};
</script>

<style>

</style>
