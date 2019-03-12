<template>
    <b-container class="mb-3 mt-3">
      <b-row>
        <!-- PREMIER BLOC DE SAISIE INTERVENTION -->
        <b-col cols="6" style="border-right: 1px solid #252195;">
          <div class="bv-example-row">
            <p>Intéger ici le texte précisant ce qu'est une interventions (au sens "validation" du bloc)</p>
          </div>

              Type de bloc * :
              <span class="liste-deroulante">
                <b-form-select v-model="formIntervention.blocId" :options="listebloc"/>
              </span>
            <br>
            <div class="mb-3 mt-3">
            Lieu d'intervention :
              <ul>
                <li>
                  Code Postal * :
                  <span class="text-cinq-car">
                    <b-form-input
                      aria-describedby="inputFormatterHelp"
                      maxlength="5"
                      v-model="formIntervention.cp"
                      type="number"
                      placeholder
                    ></b-form-input>
                  </span>
                </li>
                <li>
                  Commune * :
                  <span class="liste-deroulante">
                    <b-form-select v-model="formIntervention.commune">
                      <option :value="null">-- Choix de la commune --</option>
                      <option
                        v-for="commune in listecommune"
                        :key="commune.id"
                        :value="commune"
                        :selected="formIntervention.commune && formIntervention.commune.cpi_codeinsee === commune.cpi_codeinsee ? 'selected': ''"
                      >{{ commune.com_libellemaj}}
                      </option>
                    </b-form-select>
                  </span>
                </li>
              </ul>
              </div>
              Nombre d'enfants * :
              <span class="text-trois-car">
                <b-form-input v-model="formIntervention.nbEnfants" type="number" min="0"></b-form-input>
              </span>
              <ul>
                <li>
                  Dont
                  <span class="text-trois-car">
                    <b-form-input v-model="formIntervention.nbGarcons" type="number" min="0"></b-form-input>
                  </span>
                  garçons et
                  <span class="text-trois-car">
                    <b-form-input v-model="formIntervention.nbFilles" type="number" min="0"></b-form-input>
                  </span>
                  filles
                </li>
                <li>Classe d'âge :
                  <ul>
                    <li>
                      <span class="text-trois-car">
                        <b-form-input v-model="formIntervention.nbmoinssix" type="number" min="0"></b-form-input>
                      </span>
                      moins de 6 ans
                    </li>
                    <li>
                      <span class="text-trois-car">
                        <b-form-input v-model="formIntervention.nbsixhuit" type="number" min="0"></b-form-input>
                      </span>
                      6-7-8 ans
                    </li>
                    <li>
                      <span class="text-trois-car">
                        <b-form-input v-model="formIntervention.nbneufdix" type="number" min="0"></b-form-input>
                      </span>
                      9-10 ans
                    </li>
                    <li>
                      <span class="text-trois-car">
                        <b-form-input v-model="formIntervention.nbplusdix" type="number" min="0"></b-form-input>
                      </span>
                      plus de 10 ans
                    </li>
                  </ul>
                </li>
              </ul>

        </b-col>

        <!-- SECONDE BLOC DE SAISIE INTERVENTION -->
        <b-col cols="6">
          <div class="mb-3 mt-3">
            Date d'intervention * :
              <span class="text-date">
                <b-form-input maxlength="10" v-model="formIntervention.dateIntervention" type="date"></b-form-input>
              </span>
          </div>
          <div class="mb-3 mt-3">
            Cadre d'intervention * :
              <b-form-group class="ml-3">
                <b-form-radio-group
                  v-model="formIntervention.cai"
                  :options="listecadreintervention"
                  plain
                  stacked
                  name="plainStacked"
                />
              </b-form-group>
          </div>
          <div class="mb-3 mt-3">
            Commentaires libres :
              <b-form-textarea
                id="textarea1"
                v-model="formIntervention.commentaire"
                placeholder=""
                :rows="3"
              ></b-form-textarea>
              <!-- Affichage du texte au fur est à mesure de la frappe (ça sert à rien)
                  <pre class="mt-3">{{ commentaire }}</pre>
              -->
          </div>
          <div
            id="error"
            v-if="erreurformulaire.length==1"
          >Veuillez renseigner le champ :
            <ul>
              <li v-for="erreur in erreurformulaire" :key="erreur">{{ erreur }}</li>
            </ul>
          </div>
          <div
            id="error"
            v-if="erreurformulaire.length>1"
          >Veuillez renseigner les champs suivants :
            <ul>
              <li v-for="erreur in erreurformulaire" :key="erreur">{{ erreur }}</li>
            </ul>
          </div>
        
          <p class="text-right">
            <b-button v-on:click="resetform" title="Réinitialiser le formulaire">Réinitialiser</b-button>
            <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
          </p>

          <div class="div-attestation">
            <b-button variant="primary" v-if="showAttestation" @click="showPDF">Télécharger l'attestation
              <!-- <b-img
                class="img-icon"
                fluid
                :src="require('assets/pdf-240x240.png')"
                blank-color="rgba(0,0,0,0.5)"
                @click="showPDF"
              /> -->
            </b-button>
          </div>
        </b-col>

      </b-row>
    </b-container>


</template>
<script>
import Vue from 'vue'

export default {
  props: {
    intervention: {
      type: Object,
      default: () => {
        //return { nbEnfants: 12 }
      }
    }
  },
  computed: {
    showAttestation() {
      return this.intervention && this.intervention.id && this.intervention.blocId === '3'
    }
  },
  data() {
    let formIntervention = JSON.parse(JSON.stringify(Object.assign({
       commune: null,
       cp: '',
       nbEnfants: '',
       nbGarcons: '',
       nbFilles: '',
       nbmoinssix: '',
       nbsixhuit: '',
       nbneufdix: '',
       nbplusdix: '',
       dateIntervention: null,
       cadreintervention: '',
       blocId: null,
       cai: null,
       commentaire: ''
    }, this.intervention)))

    return {
      erreurformulaire:[],
      listecommune: [{ text: 'Veuillez saisir un code postal', value: null, insee: null, cp: null,codedep: null}],

     formIntervention,
 
      listecadreintervention: [
        { text: "Scolaire", value: "3" },
        { text: "Péri-scolaire", value: "1" },
        { text: "Extra-scolaire", value: "2" }
      ],
      listebloc: [
        { text: '-- Choix du type de bloc --', value: null },
        { text: 'Bloc 1 : Savoir pédaler', value: '1' },
        { text: 'Bloc 2 : Savoir circuler', value: '2' },
        { text: 'Bloc 3 : Savoir rouler', value: '3' }
      ]
    };
  },
  methods: {
    showPDF: function() {
      console.info( 'showPDF' )
      const id = this.intervention.id
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

    resetform: function() {
      const action = 'reset_interventions'
      console.info({ action })
      return this.$store.commit(action) 
    },

    checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      // Vérification du format du code postal TODO alphanum => numérique only + Corse ?
      if (! this.formIntervention.cp.length===5) {
        this.erreurformulaire.push("Le code postal du lieu d\'intervention");
        formOK = false;
      } 
      if (! this.formIntervention.commune) {
        this.erreurformulaire.push("La commune du lieu d'intervention");
        formOK = false;
      }      
      if (! this.formIntervention.blocId) {
        this.erreurformulaire.push("Le type de bloc");
        formOK = false;
      }
      if (! this.formIntervention.nbEnfants) {
        this.erreurformulaire.push("Le nombre d\'enfants évalués");
        formOK = false;
      }
      if (! this.formIntervention.dateIntervention) {
        this.erreurformulaire.push("La date d\'intervention");
        formOK = false;
      }
      if (! this.formIntervention.cai) {
        this.erreurformulaire.push("Le cadre d\'intervention");
        formOK = false;
      }
   
      if (!formOK) {
        console.info('Formulaire invalide', this.erreurformulaire)
        return
      }

      const url = process.env.API_URL + '/interventions'
      const intervention = {
        id: this.formIntervention.id, 
        cp:this.formIntervention.cp,
        nbEnfants:this.formIntervention.nbEnfants,
        nbGarcons:this.formIntervention.nbGarcons,
        nbFilles:this.formIntervention.nbFilles,
        commune:this.formIntervention.commune,
        cai:this.formIntervention.cai,
        blocId:this.formIntervention.blocId,
        dateIntervention:this.formIntervention.dateIntervention,
        commentaire:this.formIntervention.commentaire
      }

      const action = intervention.id ? 'put_intervention' : 'post_intervention'
      console.info({ intervention, action })
      return this.$store.dispatch(action, intervention) 
        .then(message => {
          console.info(message)
          alert('Intervention enregistrée')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la sauvegarde de l\'intervention', error)
        })
      // this.$axios.$post(url, intervention )
      // .then(response => {
      //   // alert ('Intervention enregistrée')
      //   // TODO : refresh list ici ? / Alert à supprimer ?
      //  })
      // .catch(error => {
      //   // alert ('Une erreur est survenue lors de la sauvegarde de l\'intervention')
      //   console.error('Une erreur est survenue lors de la sauvegarde de l\'intervention', error)
      // }) 
    },
    recherchecommune: function() {
      console.info("Recherche de la commune");
      if (this.formIntervention.cp.length===5) {
        // Le code postal fait bien 5 caractères
        const url = process.env.API_URL + '/listecommune?codepostal=' + this.formIntervention.cp
        console.info(url);
        this.$axios
          .$get(url)
          .then(response => {
            // this.listecommune = response.communes;
            Vue.set(this, 'listecommune',response.communes)
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listecommune = ["Veuillez saisir un code postal"];
      }
    }
  },
  watch: {
    intervention(intervention) {
      let formIntervention = JSON.parse(JSON.stringify(Object.assign({
        commune: null,
        cp: '',
        nbEnfants: '',
        nbGarcons: '',
        nbFilles: '',
        nbmoinssix: '',
        nbsixhuit: '',
        nbneufdix: '',
        nbplusdix: '',
        dateIntervention: null,
        cadreintervention: '',
        blocId: null,
        cai: null,
        commentaire: ''
      }, intervention)))
      Vue.set(this, 'formIntervention', formIntervention)
    },
    'formIntervention.cp'(cp) {
      this.recherchecommune()
    }
  }
};
</script>