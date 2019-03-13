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
                <p
                  v-for="user in users"
                  class="card-text"
                  :key="user.id"
                >
                Nom :{{user.nom}} Prénom {{user.prenom}}
                <!--<b-img v-on:click="editIntervention(intervention.id)" fluid :src="require('assets/loupe.png')" class="img-icon" blank-color="rgba(0,0,0,0.5)" />-->
                </p>
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

export default {
 
   data() {
     return {
       users: [],
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
