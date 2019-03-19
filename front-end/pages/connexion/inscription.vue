<template>
  <section class="container">
    <b-container class="interventions">
      <b-row>
        <b-col cols="6" offset="3" >
            <div class="text-center mb-3">
              <h1>
                Validation de l'inscription
              </h1>
            </div>
            <b-card class="mb-3">
              <b-form-group
                label="Prénom:">

                <b-form-input type="text" v-model="user.prenom" disabled />
              </b-form-group>
              <b-form-group
                label="Nom:">

                <b-form-input type="text" v-model="user.nom" disabled />
              </b-form-group>

              <b-form-group
                label="Date de naissance:">

                <b-form-input type="text" v-model="user.dateNaissance" disabled />
              </b-form-group>
            </b-card>
            <b-card class="mb-3">
              <b-form-group
                id="emailInputGroup"
                label="Email:"
                label-for="emailInput">

                <b-form-input
                  id="emailInput"
                  type="email" v-model="user.mail"
                  required
                  placeholder="Email" />
              </b-form-group>


              <b-form-group id="structNationaleGroup" label="Structure nationale:" label-for="structNatSelect">
                <b-form-select  id="structNatSelect" :options="structures" required v-model="user.structureId" />
              </b-form-group>

              <b-form-group id="structLocaleGroup" label="Structure Locale:" v-if="isFederation(user.structureId)=='true'" label-for="structLocaleInput">
                <b-form-input
                  id="structLocaleInput"
                  type="text" v-model="user.structureLocale"
                  required
                  placeholder="Nom de la structure" />
              </b-form-group>

              <b-form-group id="legalCheckGroup">
                <b-form-checkbox-group v-model="isLegalChecked" id="legalCheck">
                  <b-form-checkbox value="true">« Intervenant du <b>Savoir Rouler à Vélo</b>, je m’engage à construire et réaliser mes sessions d’apprentissage sur la base du socle commun <b>Savoir Rouler à Vélo</b> et à vérifier l’acquisition de l’ensemble des compétences attendues du bloc 1, 2 et 3 pour délivrer l’attestation <b>Savoir Rouler à Vélo</b>». 
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-card>
            <div class="mb-3 text-right">
              <b-button variant="success" @click="confirmRegistration()" :disabled="isLegalChecked == 'false' || !isLegalChecked" >
                Je valide mon compte
              </b-button>
            </div>
            

        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      structures: [
        { value: 1, text: 'Structure DEMO : DS' }
      ],
      user: JSON.parse(JSON.stringify(this.$store.state.utilisateurCourant)),
      isLegalChecked: "false"
    };
  },
  methods: {
    confirmRegistration(){
      const url = process.env.API_URL + '/connexion/verify'

      return this.$axios.$post(url, this.user)
      .then(async response => {
        await this.$store.dispatch('set_utilisateur', response.user);
        this.$router.push('/interventions')
      }).catch(err => {
        console.log(err)
      })
    },
    async isFederation(id){
      console.log("id Structure sélectionnée : " + id);
      const url = process.env.API_URL + '/structures/structure?id=' + id;
        console.info(url);
        this.$axios
          .$get(url)
          .then(response => {
            console.log("Réponse correcte de la route - Fédération :" + response.structures.str_federation);
            return response.structures.str_federation;
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération de la structure associée à la sélection",
              error
            );
          });
      
    }
  },
  mounted(){
    const url = process.env.API_URL + '/structures'
    this.$axios.get(url).then(response => {
      this.structures = response.data.map(struct => {
        return {
          value: struct.str_id,
          text: struct.str_libellecourt
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }

};
</script>

<style>

</style>
