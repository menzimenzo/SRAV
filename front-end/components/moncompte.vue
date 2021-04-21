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

        <b-form-group
          required
          id="structNationaleGroup"
          label="Structure nationale :"
          label-for="structNatSelect"
        >
          <!--Mantis 68055 : min_value: 1-->
          <b-form-select
            id="structNatSelect"
            v-model="structureId"
            v-validate="{ required: true, min_value: 1 }"
            name="struct"
            :state="validateState('struct')"
            aria-describedby="structFeedback"
            :disabled="!checkLegal"
            @change="emitUser"
          >
            <!--Mantis 68055 value = 0 -->
            <option :value="0">Veuillez choisir votre structure...</option>
            <option :value="99999">Collectivités territoriales</option>
            <option
              v-for="structure in listeStructures"
              :key="structure.str_id"
              :value="structure.str_id"
            >
              {{ structure.str_libelle }}
            </option>
          </b-form-select>
          <b-form-invalid-feedback id="structFeedback"
            >Il est nécessaire de choisir une
            structure.</b-form-invalid-feedback
          >
        </b-form-group>
        <!-- Cas d'une structure non collectivite territoriale
            le champ structureLocale ne doit apparaitre que si la structure n'est pas une collectivité
             quand Création de compte, ce qui définit une structure de type collectivité c'est user.structureId == 99999-> -->
        <div v-if="user.structureId != 99999">
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
            <b-form-invalid-feedback id="structLocFeedback"
              >La structure locale est obligatoire.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <!-- FIN Cas d'une structure non collectivite territoriale-->
        <!-- Cas d'une collectivite territoriale-->
        <div v-else>
          <b-form-group
            required
            id="typeCollectivite"
            label="Type de collectivité territoriale :"
            label-for="typeCollectiviteSelect"
          >
            <b-form-select
              id="typeCollectiviteSelect"
              v-model="user.typeCollectivite"
              v-validate="{ required: true }"
              name="typeCol"
              :state="validateState('typeCol')"
              aria-describedby="typeColFeedback"
              :disabled="!checkLegal"
              @change="emitUser"
            >
              <option
                v-for="type in listtypecol"
                :key="type.value"
                :value="type.value"
              >
                {{ type.text }}
              </option>
            </b-form-select>
            <b-form-invalid-feedback id="typeColFeedback"
              >Il est nécessaire de choisir un type de
              collectivité.</b-form-invalid-feedback
            >
          </b-form-group>
          <!-- DEPARTEMENT -->
          <div v-if="user.typeCollectivite == 2">
            <b-form-group
              id="Departement"
              label="Département :"
              required
              label-for="departementSelect"
            >
              <b-form-select
                :disabled="!checkLegal"
                id="departementSelect"
                v-model="user.libelleCollectivite"
                v-validate="{ required: true }"
                name="departement"
                  :state="validateState('departement')"
                aria-describedby="departementFeedback"
              >
                <option
                  v-for="departement in listdepartement"
                  :key="departement.dep_num"
                  :value="departement.dep_libelle"
                >
                  {{ departement.dep_libelle }}
                </option>
              </b-form-select>
              <b-form-invalid-feedback id="communeFeedback"
                >Le département est obligatoire.</b-form-invalid-feedback
              >
            </b-form-group>
          </div>
          <!-- FIN DEPARTEMENT -->
          <!-- COMMUNE -->
          <div v-if="user.typeCollectivite == 1">
            <b-form-group id="CodePostal" label="Code Postal :" label-for="cp">
              <b-form-input
                v-model="cp"
                name="cp"
                key="cp"
                :state="validateState('cp')"
                aria-describedby="cpFeedback"
                id="cp"
                type="number"
                placeholder="CP de la commune"
              />
            </b-form-group>
            <b-form-group
              id="Commune"
              label="Commune :"
              required
              label-for="communeInput"
            >
              <b-form-select
                :disabled="!checkLegal"
                v-validate="{ required: true }"
                name="commune"
                key="commune"
                :state="validateState('commune')"
                aria-describedby="communeFeedback"
                type="text"
                v-model="user.libelleCollectivite"
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
          </div>
          <!-- FIN COMMUNE -->
          <!-- EPCI -->
          <div v-if="user.typeCollectivite == 3">
            <b-form-group
              id="CodePostalEpci"
              label="Code Postal EPCI:"
              label-for="cpEpci"
            >
              <b-form-input
                v-model="cpEpci"
                name="cpEpci"
                key="cpEpci"
                :state="validateState('cpEpci')"
                aria-describedby="cpEpciFeedback"
                id="cpEpci"
                type="number"
                placeholder="CP d'une des communes de l'EPCI"
              />
            </b-form-group>
            <div v-if="cpEpci">
              <b-form-group
                v-if="boolEpci"
                id="ECPI"
                label="EPCI :"
                required
                label-for="epciInput"
              >
                <b-form-select
                  :disabled="!checkLegal"
                  id="epciSelect"
                  v-model="user.libelleCollectivite"
                  v-validate="{ required: true }"
                  name="epcis"
                  :state="validateState('toto')"
                  aria-describedby="epciFeedback"
                >
                  <option
                    v-for="epci in listepci"
                    :key="epci.epci_libelle"
                    :value="epci.epci_libelle"
                  >
                    {{ epci.epci_libelle }}
                  </option>
                </b-form-select>
                <b-form-invalid-feedback id="epciFeedback"
                  >L'EPCI est obligatoire.</b-form-invalid-feedback
                ></b-form-group
              >
              <b-form-group v-if="boolEpci == false">
                Aucun EPCI correspondant</b-form-group
              >
            </div>
          </div>
          <!-- FIN EPCI-->
        </div>
        <!-- FIN Cas d'une collectivite territoriale-->

        

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
            <b-form-input type="text" v-model="user.adresse" />
          </b-form-group>          
          <b-form-group label="Complément d'adresse :">
            <b-form-input type="text" v-model="user.compladresse" />
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
            <b-form-input type="number" v-model="user.telephone" />
          </b-form-group>  
        </div>      
      <b-form>
        <b-form-group id="publiCheckGroup" >
          <b-form-checkbox-group
            v-model="user.autorisepublicarte"
            id="publiCheck"
          >
            <b-form-checkbox >
              Je souhaite que ces données soient publiées sur le site "prévention des noyades" et qu'elles apparaissent sur la cartographie             

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
        //isLegalChecked: "false",
        siteweb: null,
        cp: null,
        commune: null,
        emailidentique: "false",
        listtypecol: [
          { text: "Commune", value: 1 },
          { text: "Conseil Général", value: 2 },
          { text: "EPCI", value: 3 },
        ],
        listdepartement: null,
        listepci: null,
        cpEpci: null,
        boolEpci: false,
        structureId: null,
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
  props: ["user", "submitTxt", "cancelTxt","checkLegal"],
  methods: {
    cancel: function () {
      this.$emit("cancel");
    },
  
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
    // true si la structure sélectiontypeCollectivitenée est une fédération
    isFederation(id) {
      var structure = this.structures.find((str) => {
        return str.str_id == id;
      });
      if (!structure) {
        return false;
      }
      return structure.str_federation;
    },
    getDepartements: function () {
      console.info("recupération de la liste des départements");
      const url = process.env.API_URL + "/listedepartement";
      console.info(url);
      return this.$axios
        .$get(url)
        .then((response) => {
          this.listdepartement = response.departements;
        })
        .catch((error) => {
          console.error(
            "Une erreur est survenue lors de la récupération des départements",
            error
          );
        });
    },


    // Get liste des communes correspondant au code postal
    recherchecommune: function () {
      if (this.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        console.info("Recherche de la commune");
        this.user.cp = this.cp
        const url =
          process.env.API_URL + "/listecommune?codepostal=" + this.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then((response) => {
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
        rechercheepci: function () {
      if (this.cpEpci.length === 5) {
        // Le code postal fait bien 5 caractères
        console.info("Recherche de l'EPCI'");
        const url = process.env.API_URL + "/listepci?codepostal=" + this.cpEpci;
        console.info(url);
        return this.$axios
          .$get(url)
          .then((response) => {
            if (response.epci.length == 0) {
              this.boolEpci = false;
            } else {
              this.boolEpci = true;
              this.listepci = response.epci;
            }
          })
          .catch((error) => {
            console.error(
              "Une erreur est survenue lors de la récupération des EPCI",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listepci = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    },
    emitUser: function() {
      return this.$store.dispatch('set_state_element',{ key:'utilisateurCourant', value: this.user }) 
    },

    /*
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
    */
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
    cpEpci() {
      this.rechercheepci();
    },
    cp() {
      this.recherchecommune();
    },

    /*
    "user.codepostal"() {
      console.log("Watch user.codepostal");
      // Lancement de la recherche de la commune lorsque la valeur du CP change
      this.recherchecommune();
    },
    selectedCommune() {
      this.user.commune = this.listecommune.find(commune => {
        return commune.cpi_codeinsee == this.selectedCommune;
      });
    },
    */
    "cp"() {
      // On recherche la liste des communes lors de la modification du Code postal
      this.recherchecommune2();
    },

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
    // Mantis 68055 ==> Ecran qui n'est pas appelé à la connexion
    //if (!this.$store.state.utilisateurCourant.validated) {
    //  this.user.structureId = 0;
    //}
    
    this.getDepartements().then((res) => {});

    console.log("Structure : " + (this.user.structureId))
    console.log("TypeCollectivite : " + this.user.typeCollectivite)
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

  },
  computed: {
    ...mapState(["structures"]),
    listeStructures() {
      
      var liste = this.structures;
      if (this.mail && this.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        if (!this.user.typeCollectivite) {
          liste = this.structures.filter((str) => {
            var isMatch = true;
            isMatch =
              isMatch &
              (String(str.str_libellecourt) != "DS") &
              (String(str.str_libellecourt) != "DEP") &
              (String(str.str_libellecourt) != "EPCI") &
              (String(str.str_libellecourt) != "COM");
            if (this.user.structureId == str.structureId) {
              console.log("C'est une collectivité")
              //this.structureId = "9999";
              }

            return isMatch;
          });
        } 
        console.log("TypeCollectivite : " + this.user.typeCollectivite)
        return liste;
      }
    },    
    /*listeStructures() {
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
    },*/
    isUserRegisteredViaPwd() {
      return Boolean(this.user && this.user.tokenFc);
    },
    
  },
};
</script>

<style>
</style>

