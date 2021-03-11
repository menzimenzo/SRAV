<template>
  <div>
    <b-card class="mb-3">
      <b-form>
        <b-form-group label="Prénom :">
          <b-form-input type="text" v-model="user.prenom" disabled />
        </b-form-group>
        <b-form-group label="Nom :">
          <b-form-input type="text" v-model="user.nom" disabled />
        </b-form-group>
        <b-form-group
          id="emailInputGroup"
          label="Courriel :"
          label-for="emailInput"
          required
        >
          <b-form-input
            id="emailInput"
            type="email"
            v-model="user.mail"
            required
            name="mail"
            key="email-input"
            v-validate="{ required: true, email: true }"
            aria-describedby="emailFeedback"
            placeholder="Courriel"
          />
        </b-form-group>

        <b-form-group
          required
          id="structNationaleGroup"
          label="Structure nationale :"
          label-for="structNatSelect"
        >
          <!--Mantis 68055 : min_value: 1-->
          <b-form-select
            id="structNatSelect"
            v-model="user.structureId"
            v-validate="{ required: true, min_value: 1 }"
            name="struct"
            :state="validateState('struct')"
            aria-describedby="structFeedback"
            :disabled="!checkLegal"
          >
            <!--Mantis 68055 value = 0 -->
            <option value="0">Veuillez choisir votre structure...</option>
            <option
              v-for="structure in listeStructures"
              :key="structure.str_id"
              :value="structure.str_id"
            >
              {{ structure.str_libelle }}
            </option>
          </b-form-select>
          
        </b-form-group>
        <div v-if="user.structureLocale != ''" >
          <b-form-group
            id="structLocaleGroup"
            label="Structure locale :"
            required
            label-for="structLocaleInput"
            key="structurelocale"
          >
            <b-form-input
              v-validate="{ required: true }"
              name="structLoc"
              :state="validateState('structLoc')"
              aria-describedby="structLocFeedback"
              id="structLocaleInput"
              type="text"
              v-model="user.structureLocale"
              placeholder="Nom de la structure locale"
            />
            <b-form-invalid-feedback id="structLocFeedback">
              La structure locale est obligatoire.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="mb-3 text-right">
          <b-button
            @click="submit"
            variant="success"
            :disabled="
              errors.any() || (isLegalChecked == 'false' && !user.validated)
            "
            >{{ submitTxt }}</b-button
          >
        </div>
      </b-form>
    </b-card>
    <b-card class="mb-3" header="Vos coordonnées :">
        <div>
          <b-form-group id="siteweb" label="Site Web :" label-for="siteweb">
              <b-form-input
                v-model="user.siteweb"
                name="siteweb"
                key="siteweb"
                :state="validateState('siteweb')"
                aria-describedby="sitewebFeedback"
                id="siteweb"
                type="text"
                placeholder="http:// ou https://"
              />
          </b-form-group>
        <b-form-group>
        </b-form-group>        
        <b-form-group
          id="emailInputGroup"
          label="Courriel contact :"
          label-for="emailInput"
        >
          <b-form-checkbox-group
            v-model="emailidentique"
            id="emailidendique"
          >
          <b-form-checkbox value="true">Courriel identique</b-form-checkbox>
          </b-form-checkbox-group>

          <b-form-input
            id="emailInput"
            type="email"
            v-model="user.mailcontact"
            name="mail"
            key="email-input"
            v-validate="{ required: true, email: true }"
            aria-describedby="emailFeedback"
            placeholder="Courriel de contact"
          />
        </b-form-group>
          <b-form-group label="Adresse :">
            <b-form-input type="text" v-model="user.adresse" />
          </b-form-group>          
          <b-form-group label="Complément d'adresse :">
            <b-form-input type="text" v-model="user.compladresse" />
          </b-form-group>     
          <b-form-group id="CodePostal" label="Code Postal :" label-for="cp">
              <b-form-input
                v-model="user.codepostal"
                name="codepostal"
                key="codepostal"
                :state="validateState('codepostal')"
                aria-describedby="cpFeedback"
                id="codepostal"
                type="number"
                placeholder="CP de la commune"
              />
            </b-form-group>
            <b-form-group
              id="Commune"
              label="Commune :"
              label-for="communeInput"
            >
              <b-form-select
                v-validate="{ required: true }"
                name="commune"
                key="commune"
                :state="validateState('commune')"
                aria-describedby="communeFeedback"
                type="text"
                v-model="user.commune"
                id="communeSelect"
              >
                <option :value="null">-- Choix de la commune --</option>
                <option
                  v-for="commune in listecommune"
                  :key="commune.cpi_codeinsee"
                  :value="commune.com_libellemaj"
                >
                  {{ commune.com_libellemaj }}
                </option>
              </b-form-select>
              <b-form-invalid-feedback id="communeFeedback"
                >La commune est obligatoire.</b-form-invalid-feedback
              >
            </b-form-group>
              <b-form-group label="Téléphone :">
            <b-form-input type="number" v-model="user.telephone" />
          </b-form-group>  
        </div>      
      <b-form>
        <b-form-group id="legalCheckGroup">
          <b-form-checkbox-group
            v-model="user.autorisepublicarte"
            id="legalCheck"
            :state="validateState('legalCheck')"
            aria-describedby="legalFeedback"
            name="legalCheck"
          >
          <b-form-checkbox value="true">
            « En cochant cette case, vous acceptez la publication de vos coordonnées sur une carte mise à disposition du public.
          </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-invalid-feedback id="legalFeedback"
            >Il est obligatoire de valider les conditions
            légales.</b-form-invalid-feedback
          >
        </b-form-group>
        </b-form>
    </b-card>
    <b-card>
      <b-form>
        <b-form-group id="legalCheckGroup">
          <b-button v-on:click="$modal.hide('editUser')">Annuler</b-button>
          <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
          </b-form-group>
        </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
        //isLegalChecked: "false",
        siteweb: null,
        cp: null,
        commune: null,
        emailidentique: "false",
        listecommune: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          insee: null,
          cp: null,
          codedep: null,
        },
      ],
    };
  },
  props: ["user", "checkLegal"],
  methods: {
    submit: function () {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$emit("submit");
        }
      });
    },
    validateState(ref) {
      if (!this.veeFields) {
        return null;
      }
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.errors.has(ref);
      }

      return null;
    },
    // Get liste des communes correspondant au code postal
    recherchecommune: function () {
        console.info("Avant Recherche de la commune");
      if (this.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        console.info("Recherche de la commune");
        const url =
          process.env.API_URL + "/listecommune?codepostal=" + this.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then((response) => {
            console.info("Réponse OK");
            this.listecommune = response.communes;
          })
          .catch((error) => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
      } else {
        
        // On vide la liste car le code postal a changé
        this.listecommune = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    },
      checkform: function() {
      console.info("Validation du formulaire");
    },
  },
  watch: {
    "emailidentique"()  {
      // Renseignement automatique de la valeur de mailcontact avec l'adresse mail de l'utilisateur si on coche
      if (this.emailidentique==="true") 
      {
        this.user.mailcontact=this.user.mail
      }
    },
    "user.codepostal"() {
      console.log("Watch user.codepostal");
      // Lancement de la recherche de la commune lorsque la valeur du CP change
      this.recherchecommune();
    },
    selectedCommune() {
      this.user.commune = this.listecommune.find(commune => {
        return commune.cpi_codeinsee == this.selectedCommune;
      });
    }
    /*"user.structureId"() {
      if (this.user.structureId != 99999) {
        console.log('changement structure')
        //this.user.typeCollectivite = null;
      }
    },
    "user.typeCollectivite"() {
      console.log("changement collectivité : ")
    }*/
  },
  async mounted() {
    await this.$store.dispatch("get_structures");
    // Mantis 68055
    if (!this.$store.state.utilisateurCourant.validated) {
      this.user.structureId = 0;
    }
    
    console.log("Nom : " + (this.user.nom))
    console.log("Site Web : " + (this.user.siteweb))
    console.log("Amailcontact : " + (this.user.mailcontact))
    console.log("Validation publication carte : " + (this.user.autorisepublicarte))
  },
  computed: {
    ...mapState(["structures"]),
    listeStructures() {
      var liste = this.structures;
      if (this.user.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        
        liste = this.structures.filter((str) => {
          var isMatch = true;
          isMatch =
            isMatch &
            (String(str.str_libellecourt) != "DS")
          return isMatch;
        });
        return liste;
      }
    },
  },
};
</script>

<style>
</style>

