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
                <b-form-input type="date" v-model="user.dateNaissance" disabled />
              </b-form-group>
            </b-card>
            <b-card class="mb-3">
              <b-form>
                <b-form-group
                  id="emailInputGroup"
                  label="Courriel:"
                  label-for="emailInput" required>

                  <b-form-input
                    id="emailInput"
                    type="email" v-model="user.mail"
                    required
                    name="mail"
                    v-validate="{required: true, email: true}"
                    aria-describedby="emailFeedback"
                    placeholder="Courriel" 
                    :state="validateState('mail')"
                    />

                  <b-form-invalid-feedback id="emailFeedback">
                    Le courriel est obligatoire et doit être valide.
                  </b-form-invalid-feedback>

                </b-form-group>


                <b-form-group required id="structNationaleGroup" label="Structure nationale:" label-for="structNatSelect">
                  <b-form-select id="structNatSelect"  v-model="user.structureId"
                    v-validate="{required: true}"
                    name="struct"
                    :state="validateState('struct')"
                    aria-describedby="structFeedback">
                    <option :value="null"> Veuillez choisir votre structure...</option>
                    <option v-for="structure in structures" :key="structure.str_id" :value="structure.str_id">{{ structure.str_libelle}}</option>
                  </b-form-select>
                  <b-form-invalid-feedback id="structFeedback">
                    Il est nécessaire de choisir une structure.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="structLocaleGroup" label="Structure Locale:" required v-if="isFederation(user.structureId)" label-for="structLocaleInput">
                  <b-form-input
                    v-validate="{required: isFederation(user.structureId)}"
                    name="structLoc"
                    :state="validateState('structLoc')"
                    aria-describedby="structLocFeedback"
                    id="structLocaleInput"
                    text=""
                    type="text" v-model="user.structureLocale"
                    required
                    placeholder="Nom de la structure" />
                  <b-form-invalid-feedback id="structLocFeedback">
                    La structure local est obligatoire.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="legalCheckGroup">
                  <b-form-checkbox-group v-model="isLegalChecked" id="legalCheck" :state="validateState('legalCheck')"
                      aria-describedby="legalFeedback"
                      v-validate="{is: 'true'}" name="legalCheck"  >
                    <b-form-checkbox value="true" 
                    >
                      « Intervenant du <b>Savoir Rouler à Vélo</b>, je m’engage à construire et réaliser mes sessions d’apprentissage sur la base du socle commun <b>Savoir Rouler à Vélo</b> et à vérifier l’acquisition de l’ensemble des compétences attendues du bloc 1, 2 et 3 pour délivrer l’attestation <b>Savoir Rouler à Vélo</b>».<span style="color: red;">*</span> 
                    </b-form-checkbox>
                  </b-form-checkbox-group>
                  <b-form-invalid-feedback id="legalFeedback">
                    Il est obligatoire de valider les conditions légales.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group>
                  <span style="color: red;">*</span> : Champ obligatoire
                </b-form-group>
                <div class="mb-3 text-right">
                  <b-button  @click="confirmRegistration" variant="success" :disabled="errors.any()" >
                    Je valide mon compte
                  </b-button>
                </div>
              </b-form>
            </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      user: JSON.parse(JSON.stringify(this.$store.state.utilisateurCourant)),
      isLegalChecked: "false"
    };
  },
  methods: {
    // Validation de l'inscription
    confirmRegistration(){
      this.$validator.validateAll().then(isValid => {
        if(isValid){
          const url = process.env.API_URL + '/connexion/verify'
          return this.$axios.$post(url, this.user)
          .then(async response => {
            await this.$store.dispatch('set_utilisateur', response.user);
            this.$router.push('/interventions')
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    // true si la structure sélectionnée est une fédération
    isFederation(id){

       var structure = this.structures.find(str => {
         return str.str_id == id
       })
       if(!structure){return false}
       return structure.str_federation
      
    },
    validateState(ref) {
      if(!this.veeFields){ return null}
      if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated)) {
        return !this.errors.has(ref)
      }
      return null
    }
  },
  async mounted(){
    await this.$store.dispatch('get_structures')
  },
  computed:{
    ...mapState(['structures'])
  }

};
</script>

<style>

</style>
