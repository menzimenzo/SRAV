<template>
  <b-container class="interventions">
    <div class="row">Gestion de Mes interventions</div>
    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion2 variant="info">Mes interventions</b-btn>
        </b-card-header>
        <b-collapse id="accordion2" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <p
              v-for="intervention in interventions"
              class="card-text"
              :key="intervention.uti_id"
            >
            Intervention du {{intervention.uti_id}} à {{intervention.uti_last_login}}. Note : {{ intervention.uti_login}}
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>    
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion1 variant="info">Je saisis une intervention</b-btn>
        </b-card-header>
        <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-form-input maxlength="5" v-model="codepostal"
                type="text"
                placeholder="Code Postal"></b-form-input>
            <p>Value: {{ codepostal }}</p>
            <b-form-input v-model="commune"
                          type="text"
                          placeholder="commune"></b-form-input>
            <p>Value: {{ commune }}</p>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      interventions: [],
      commune: '',
      codepostal: ''
    };
  },
  async mounted() {
    console.info("mounted");
    const url = 'http://localhost/backend/interventions'
    await this.$axios.$get(url)
        .then(response => {
            this.interventions = response.interventions
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la récupération des interventions', error)
        })
  }
};
</script>