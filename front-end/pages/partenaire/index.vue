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
                    Liste des Intervenants de ma structure
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <editable :columns="headers" :data="users" :removable="false" :creable="false" 
                  :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading">
                  <template slot-scope="props" slot="actions">
                    <b-btn @click="editUser(props.data.id)" size="sm" class="mr-1" variant="primary">
                      <i class="material-icons" >edit</i>
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
                  <b-img  :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion2 variant="Dark link">
                    Les indicateurs de ma structure
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                Disponible en V2
              </b-card-body>
            </b-collapse>
          </b-card>   
          <b-card no-body class="mb-3">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-form-row>
                <b-col>
                  <!-- IMAGE RAYEE BANNER INTERVENTION -->
                  <b-img  :src="require('assets/banner_ray_yellow.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion5 variant="Dark link">
                    Commentaires saisis par les intervenants
                  </b-btn>
                  
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                  <editable :columns="headersCom" :data="interventions" :removable="false" :creable="false" 
                  :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading">
                </editable>   
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
import { mapState } from 'vuex'
import Editable from '~/components/editable/index.vue'
import user from '~/components/user.vue'

export default {
   components: {
    Editable,user
  },
   data() {
     return {
       loading: true,
       users: [],
       headers: [
        
        { path: 'id', title: 'N° d\'utilisateur', type: 'text', sortable:true},
        { path: 'proLibelle', title: 'Rôle', type: 'date', sortable:true},
        { path: 'nom', title: 'Nom', type: 'date', sortable:true},
        { path: 'prenom', title: 'Prénom', type: 'text', sortable:true},
        { path: 'structureLibelleCourt', title: 'structure', type: 'text', sortable:true},
        { path: '__slot:actions', title: 'Actions', type: '__slot:actions', sortable:false},
     
      ],
     headersCom: [
        { path: 'nom', title: 'Intervenant', type: 'text', sortable:true},
        { path: 'commune.com_libellemaj', title: 'Lieu', type: 'text', sortable:true},
        { path: 'dateIntervention', title: 'Date d\'intervention', type: 'date', sortable:true, filter:"date"},
        { path: 'commentaire', title: 'Commentaires', type: 'text', sortable:true},
      ] 

     };
   },

  methods: {
    editUser: function (id) {
      return this.$store.dispatch('get_user',id)
        .then(() => {
          this.$modal.show('editUser')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la récupération du détail de l\'user', error)
        })
    }
  },
  computed: mapState(['interventions']),

//  CHARGEMENT ASYNCHRONE DES USERS
//
  async mounted() {
    const url = process.env.API_URL + '/user'
    //await this.$axios.$get(url)
    await this.$store.dispatch('get_users')
        .then(response => {
          this.loading = false
          this.users = response.users
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la récupération des users', error)
        })

    await this.$store.dispatch('get_interventions');

    this.loading = false
  }
};
</script>

<style>

</style>
