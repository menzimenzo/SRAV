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
          :state="validateState('mail')"
          :disabled="!isUserRegisteredViaPwd"
        />
        <b-form-invalid-feedback id="emailFeedback">Le courriel est obligatoire et doit être valide.</b-form-invalid-feedback>

      </b-form-group>
    
      <b-form-group >
            Avez-vous bénéficié de la formation "Génération Vélo" ?<span style="color: red">*</span>
            <b-form-radio-group  
              v-model="formgenevelo"
              
              :state="state" 
              name="radio-validation">
            
              <b-form-radio value="true">Oui</b-form-radio>
              <b-form-radio value="false">Non</b-form-radio>
              
            </b-form-radio-group>
            
            <b-form-invalid-feedback :state="state">Veuillez renseigner votre choix</b-form-invalid-feedback>
            
        </b-form-group>
        <b-form-invalid-feedback id="geneveloFeedback">Le nom est obligatoire.</b-form-invalid-feedback>
      </b-form>
    </b-card>
    <b-card class="mb-3" header="Vos coordonnées :" v-if="user.structureId!=9">
        <div>
          <b-form-group id="siteweb" label="Site Web :" label-for="siteweb">
              <b-form-input
                v-model="user.siteweb"
                name="siteweb"
                key="siteweb"
                :state="validateState('siteweb')"
                v-validate="{url}"
                aria-describedby="sitewebFeedback"
                id="siteweb"
                type="text"
                placeholder="http:// ou https://"
              />
              <b-form-invalid-feedback id="sitewebFeedback">L'url saisie n'a pas le bon format.</b-form-invalid-feedback>
          </b-form-group>
        <b-form-group>
        </b-form-group>        
          <b-form-group
            id="emailcontactInputGroup"
            label="Courriel de contact :"
            label-for="emailcontactInput"
          >
          <b-form-checkbox-group
            v-model="emailidentique"
            id="emailidendique"
          >
          <b-form-checkbox value="true">Courriel identique</b-form-checkbox>
          </b-form-checkbox-group>

            <b-form-input
              id="emailcontactInput"
              type="email"
              v-model="user.mailcontact"
              name="mailcontact"
              key="email-input"
              v-validate="{ email: true }"
              placeholder="Courriel contact"
              :state="validateState('mailcontact')"
              aria-describedby="emailcontactFeedback"
              />
        <b-form-invalid-feedback id="emailcontactFeedback">Le courriel est obligatoire et doit être valide.</b-form-invalid-feedback>

        </b-form-group>
          <b-form-group label="Adresse :">
            <b-form-input 
              type="text" 
              name="adresse"
              area-describedBy="adresseFeedback"
              v-model="user.adresse" 
              :state="validateState('adresse')"
              v-validate="{ min:0, max:100}"
            />
            <b-form-invalid-feedback id="adresseFeedback">L'adresse ne peut dépasser 100 caractères.</b-form-invalid-feedback>
          </b-form-group>          
          <b-form-group label="Complément d'adresse :">
            <b-form-input 
              type="text" 
              name="compladresse"
              area-describedBy="compladresseFeedback"
              :state="validateState('compladresse')"
              v-validate="{ min:0, max:100}"
              v-model="user.compladresse" />
              <b-form-invalid-feedback id="compladresseFeedback">Le complément d'adresse ne peut dépasser 100 caractères.</b-form-invalid-feedback>
          </b-form-group>     
          <b-form-group id="CodePostal" label="Code Postal :" label-for="cp">
              <b-form-input
                v-model="cp"
                name="codepostal"
                key="codepostal"
                :state="validateState('codepostal')"
                v-validate="{required:Boolean(user.autorisepublicarte),  length:5,numeric:true}"
                aria-describedby="cpFeedback"
                id="codepostal"
                type="number"
                placeholder="CP de la commune"
              />
              <b-form-invalid-feedback id="cpFeedback">Le code postal est obligatoire pour publier les informations sur la carte.</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group 
            v-if="user.codepostal"
            label="Commune"
            label-for="lstcommune" 
            require
            >
              <b-form-select 
                class="liste-deroulante"
                v-model="user.codeinsee"
                name="lstcommune"
                v-validate="{ required: true, min:5, max:5}"
                :state="validateState('lstcommune')"
                aria-describedby="lstcommuneFeedback"

              >
                <option :value="null">-- Choix de la commune --</option>
                <option
                  v-for="commune in listecommune"
                  :key="commune.cpi_codeinsee"
                  :value="commune.cpi_codeinsee"
                >{{ commune.com_libellemaj}}</option>
              </b-form-select>
              <b-form-invalid-feedback id="lstcommuneFeedback">Une commune doit être sélectionnée avec un code postal valide.</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Téléphone :">
            <b-form-input 
                name="telephone"
                type="number" 
                v-model="user.telephone" 
                aria-describedby="telephoneFeedback"
                :state="validateState('telephone')"
                v-validate="{ min:0, max:10}"
            />
            <b-form-invalid-feedback id="telephoneFeedback">Le téléphone ne peut comporter plus de 10 chiffres.</b-form-invalid-feedback>
          </b-form-group>  
        </div>      
      <b-form>
        <b-form-group id="publiCheckGroup" >
          <b-form-checkbox-group
            v-model="user.autorisepublicarte"
            id="publiCheck"
          >
            <b-form-checkbox >
              Je souhaite que ces données soient publiées sur le site "Savoir rouler à vélo" et qu'elles apparaissent sur la cartographie             
            </b-form-checkbox> 
          </b-form-checkbox-group>
        </b-form-group>
      </b-form> 
    </b-card>
    <b-card>
      <b-form>
        <b-form-group id="legalCheckGroup">
          <b-button
            @click="cancel"
            variant="secondary"

            >{{ cancelTxt }}</b-button
          >      <b-button
            @click="submit"
            variant="success"

            >{{ submitTxt }}</b-button
          >
     
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
      value: null,
        options: [
          { text: 'First radio', value: 'first' },
          { text: 'Second radio', value: 'second' },
          { text: 'Third radio', value: 'third' }
        ],
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
        formgenevelo: {
          type: Boolean,
          default: null
        },
    };
  },
  props: ["user", "submitTxt", "cancelTxt","checkLegal"],
  methods: {
    cancel: function () {
      this.$emit("cancel");
    },
  
    submit: function () {
      this.$validator.validateAll().then((isValid) => {
        if (this.formgenevelo == null) {
          isValid = false
        }
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
    emitUser: function() {
      return this.$store.dispatch('set_state_element',{ key:'utilisateurCourant', value: this.user }) 
    },

    recherchecommune2: function() {
      // Recopie du CP dans le CP User
      this.user.codepostal = this.cp
      if (this.user.codepostal.length === 5) {
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listecommune?codepostal=" +
          this.user.codepostal;
        // Retourne la liste des communes associées au Code postal
        return this.$axios
          .$get(url)
          .then(response => {
            this.listecommune = response.communes;
            console.info("recherchecommune : this.listecommune " + this.listecommune );
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
      } else {
        // On vide le CodeInsee si le CP n'est pas complet
        this.user.codeinsee = null
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
    "cp"() {
      // On recherche la liste des communes lors de la modification du Code postal
      this.recherchecommune2();
    },
    "formgenevelo"() {
      if (this.formgenevelo == false || this.formgenevelo =='false')
      {
        this.user.formgenevelo = false;
      }
      else 
      if (this.formgenevelo == true || this.formgenevelo =='true')
      {
        this.user.formgenevelo = true;
      }
      else
        this.user.formgenevelo = null
    },

  },
  async mounted() {

    // Chargement du CP et liste commune + sélection
    if(this.user.codepostal)
    {
      // Recopie du CP dans le champ code postal
      this.cp = this.user.codepostal
      // Recherche de la liste des commune
      this.recherchecommune2()
      // Sélection de la commune correspondant à celle de l'utilisateur dans la liste
      //this.selectedCommune = this.user.cpi_codeinsee;
    }
    
    console.log("this.user.formgenevelo : ",this.user.formgenevelo)
    this.formgenevelo  = this.user.formgenevelo
/*
    if (this.user.formgenevelo == true) { 
        this.formgenevelo = 'true'
      }
      else if (this.user.formgenevelo == false) { 
        this.formgenevelo = 'false'
      }
      else this.formgenevelo = null
      */
  },
  computed: {
    isUserRegisteredViaPwd() {
      return Boolean(this.user && this.user.tokenFc);
    },
    state() {
        return !Boolean(this.formgenevelo == null)
      }
    
  },
};
</script>

<style>
</style>

