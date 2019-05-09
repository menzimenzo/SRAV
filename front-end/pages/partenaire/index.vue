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
                  <b-img fluid :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,0.5)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion1 variant="Dark link">
                    <h4><i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-2" >people</i>
                    Liste des Intervenants de ma structure</h4>
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-btn @click="exportCsv()" class="mb-2" variant="primary"><i class="material-icons" style="font-size: 18px; top: 4px;" >import_export</i> Export CSV</b-btn>
                  <editable :columns="headers" :data="users" :removable="false" :creable="false" :defaultSortField="{ key: 'nom', order: 'asc' }" 
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
                  <b-img  :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion2 variant="Dark link">
                    <h4><i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-2" >poll</i>
                    Les indicateurs de ma structure</h4>
                    
                  </b-btn>
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <h3 class="text-center">
                Disponible en V2
                </h3>
              </b-card-body>
            </b-collapse>
          </b-card>   
          <b-card no-body class="mb-3">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-form-row>
                <b-col>
                  <!-- IMAGE RAYEE BANNER INTERVENTION -->
                  <b-img  :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion5 variant="Dark link">
                    <h4><i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-2" >comment</i>
                    Commentaires saisis par les intervenants</h4>
                  </b-btn>
                  
                </b-col>
              </b-form-row>
            </b-card-header>
            <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                  <editable :columns="headersCom" :data="interventions" :removable="false" :creable="false" 
                  :editable="false" :noDataLabel="''" tableMaxHeight="none" :loading="loading"
                  :defaultSortField="{ key: 'id', order: 'asc' }">
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
                  <b-img  :src="require('assets/banner_ray_blue.png')" blank-color="rgba(0,0,0,1)" />
                  <b-btn class="accordionBtn" block href="#" v-b-toggle.accordion3 variant="Dark link"><h4>
                    <i class="material-icons accordion-chevron" >chevron_right</i> <i class="material-icons ml-2 mr-2" >bookmarks</i>Documents utiles
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
                          <li v-for="doc in documents" :key="doc.doc_id" >
                            {{doc.doc_libelle}}
                            <b-img class="img-icon" fluid  @click="downloadDoc(doc)" :src="require('assets/pdf-240x240.png')" blank-color="rgba(0,0,0,0.5)" />
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
       headers: [
        
        { path: 'id', title: 'N° d\'utilisateur', type: 'text', sortable:true},
        { path: 'proLibelle', title: 'Rôle', type: 'date', sortable:true},
        { path: 'nom', title: 'Nom', type: 'date', sortable:true},
        { path: 'prenom', title: 'Prénom', type: 'text', sortable:true},
        { path: 'structureLibelleCourt', title: 'Structure', type: 'text', sortable:true},
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
    },
    exportCsv(){
      this.$axios({
          url: process.env.API_URL + '/user/csv', // + this.utilisateurCourant.id,
          // url: apiUrl + '/droits/' + 17,
          method: 'GET',
          responseType: 'blob'
      }).then((response) => {
          // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
           // Crée un objet blob avec le contenue du CSV et un lien associé
          const url = window.URL.createObjectURL(new Blob([response.data]))
          // Crée un lien caché pour télécharger le fichier
          const link = document.createElement('a')
          link.href = url
          const fileName = 'Savoir Rouler - Intervenants.csv'
          link.setAttribute('download', fileName)
          // Télécharge le fichier
          link.click()
          link.remove()
          console.log('Done - Download', {fileName})
      }).catch(err => {
          console.log(JSON.stringify(err))
          this.$toasted.error('Erreur lors du téléchargement: ' + err.message )
      })
    },
    downloadDoc: function(doc) {
      this.$axios({
        url: process.env.API_URL + '/documents/'+doc.doc_id,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
          // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
           // Crée un objet blob avec le contenue du CSV et un lien associé
          const url = window.URL.createObjectURL(new Blob([response.data]))
          // Crée un lien caché pour télécharger le fichier
          const link = document.createElement('a')
          link.href = url
          const fileName = doc.doc_filename
          link.setAttribute('download', fileName)
          // Télécharge le fichier
          link.click()
          link.remove()
          console.log('Done - Download', {fileName})
      }).catch(err => {
          console.log(JSON.stringify(err))
          this.$toasted.error('Erreur lors du téléchargement: ' + err.message )
      })
    }
  },
  computed: mapState(['interventions', 'users', 'documents']),

//  CHARGEMENT ASYNCHRONE DES USERS
//
  async mounted() {
    const url = process.env.API_URL + '/user'
    //await this.$axios.$get(url)
    await Promise.all([

      this.$store.dispatch('get_users')
          .then(response => {
            this.loading = false
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des users', error)
          })
      , this.$store.dispatch('get_interventionscommentaires')
    ])
    // Chargement des documents utilses
    this.$store.dispatch('get_documents')
    this.loading = false
  }
};
</script>

<style>

</style>
