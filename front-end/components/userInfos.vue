<template>
  <div>
    <b-card class="mb-3">
      <b-form>
        <b-form-group 
          label="Prénom :"
          id="prenomInputGroup"
          label-for="prenomInput"
          required
          >
          <b-form-input
            id="prenomInput"
            type="text"
            v-model="user.prenom"
            name="prenom"
            key="prenom-input"
            v-validate="{ required: true }"
            aria-describedby="prenomFeedback"
            placeholder="Prénom"
            :disabled="isUserRegisteredViaPwd"
            :state="validateState('prenom')"
          />
           <b-form-invalid-feedback id="prenomFeedback"
            >Le prénom est obligatoire.</b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group 
          label="Nom :"
          id="nomInputGroup"
          label-for="nomInput"
          required
          >
          <b-form-input
            id="nomInput"
            type="text"
            v-model="user.nom"
            name="nom"
            key="nom-input"
            v-validate="{ required: true}"
            aria-describedby="nomFeedback"
            placeholder="Nom"
            :disabled="isUserRegisteredViaPwd"
            :state="validateState('nom')"
          />
           <b-form-invalid-feedback id="nomFeedback"
            >Le nom est obligatoire.</b-form-invalid-feedback
          >
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
            v-model="mail"
            required
            name="mail"
            key="email-input"
            v-validate="{ required: true, email: true }"
            aria-describedby="emailFeedback"
            placeholder="Courriel"
            :state="validateState('mail')"
            :disabled="!isUserRegisteredViaPwd"
          />

          <b-form-invalid-feedback id="emailFeedback"
            >Le courriel est obligatoire et doit être
            valide.</b-form-invalid-feedback
          >
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
            v-model="mastructure.str_id"
            v-validate="{ required: true, min_value: 1 }"
            name="struct"
            :state="validateState('struct')"
            aria-describedby="structFeedback"
            :disabled="!checkLegal"
          >
            <!--Mantis 68055 value = 0 -->
            <option :value="0">Veuillez choisir votre structure...</option>
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
        <!-- ETABLISSEMENT POUR STRUCTURE EDUCATION NATIONALE -->
        <div v-if="mastructure.str_id == 9">
          <b-form-group id="CodePostalEtab" label="Code Postal Etablissement :" label-for="cpetab">
            <b-form-input
              v-model="cpetab"
              name="cpetab"
              key="cpetab"
              :state="validateState('cpetab')"
              aria-describedby="cpetabFeedback"
              id="cpetab"
              type="number"
              placeholder="CP de la commune de l'établissement"
            />
          </b-form-group>
          <b-form-group
            id="etablissement"
            label="Etablissement :"
            required
            label-for="etabInput"
          >
            <b-form-select
              v-validate="{ required: true }"
              name="etab"
              key="etab"
              :state="validateState('etab')"
              aria-describedby="etabFeedback"
              type="text"
              v-model="mastructure.uti_structurelocale"
              id="etabSelect"
            >
              <option :value="null">-- Choix de l'établissement --</option>
              <option
                v-for="etablissement in listeetablissement"
                :key="etablissement.eta_uai"
                :value="etablissement.eta_uai"
              >
                {{ etablissement.eta_affichage }}
              </option>
            </b-form-select>
            <b-form-invalid-feedback id="etabFeedback"
              >L'établissement est obligatoire.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>           
        <!-- Cas d'une structure non collectivite territoriale
            le champ structureLocale ne doit apparaitre que si la structure n'est pas une collectivité
             quand Création de compte, ce qui définit une structure de type collectivité c'est user.structureId == 99999-> -->
        <div v-if="mastructure.str_id != 99999 && mastructure.str_id != 9">
          <b-form-group
            id="structLocaleGroup"
            label="Structure locale :"
            required
            label-for="structLocaleInput"
            key="structurelocale"
          >
            <b-form-input
              v-validate="{ required: true , max:100}"
              name="structLoc"
              :state="validateState('structLoc')"
              aria-describedby="structLocFeedback"
              id="structLocaleInput"
              type="text"
              v-model="mastructure.uti_structurelocale"
              placeholder="Nom de la structure locale"
            />
            <b-form-invalid-feedback id="structLocFeedback"
              >La structure locale est obligatoire et ne peut dépasser 100 caractères.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <!-- FIN Cas d'une structure non collectivite territoriale-->
        <!-- Cas d'une collectivite territoriale-->
        
        <!-- CHOIX POUR LA STRUCTURE DE TYPE COLLECTIVITE TERRITORIALE-->
        <div v-if="mastructure.str_id == 99999">
          <!-- CHOIX DU TYPE DE COLLECTIVITE-->

          <b-form-group
            required
            id="typeCollectivite"
            label="Type de collectivité territoriale :"
            label-for="typeCollectiviteSelect"
          >
            <b-form-select
              id="typeCollectiviteSelect"
              v-model="mastructure.tco_id"
              v-validate="{ required: true }"
              name="typeCol"
              :state="validateState('typeCol')"
              aria-describedby="typeColFeedback"
            >
              <option
                v-for="typeCol in typeCollectivite"
                :key="typeCol.tco_id"
                :value="typeCol.tco_id"
              >
                {{ typeCol.tco_libelle }}
              </option>
            </b-form-select>
            <b-form-invalid-feedback id="typeColFeedback"
              >Il est nécessaire de choisir un type de
              collectivité.</b-form-invalid-feedback
            >
            <!-- COLLECTIVITE TYPE COMMUNE -->
            <div v-if="mastructure.tco_id == 1">
              <!-- SAISIE DU CODE POSTAL -->
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
              <!-- CHOIX DE LA COMMUNE -->
              <b-form-group
                id="Commune"
                label="Commune :"
                required
                label-for="communeInput"
                v-if="CommuneExiste"
              >
                <b-form-select
                  v-validate="{ required: true }"
                  name="commune"
                  key="commune"
                  :state="validateState('commune')"
                  aria-describedby="communeFeedback"
                  type="text"
                  v-model="mastructure.dco_insee"
                  id="communeSelect"
                >
                  <option :value="null">-- Choix de la commune --</option>
                  <option
                    v-for="commune in listecommune"
                    :key="commune.cpi_codeinsee"
                    :value="commune.cpi_codeinsee"
                  >
                    {{ commune.com_libellemaj }}
                  </option>
                </b-form-select>
                <b-form-invalid-feedback id="communeFeedback"
                  >La commune est obligatoire.</b-form-invalid-feedback
                >
              </b-form-group>
            </div>   
            <!-- COLLECTIVITE TYPE CONSEIL DEPARTEMENTAL -->
            <div v-if="mastructure.tco_id == 2">
              <b-form-group
                id="Departement"
                label="Département :"
                required
                label-for="departementSelect"
              >
                <b-form-select
                  id="departementSelect"
                  v-model="mastructure.dco_dep"
                  v-validate="{ required: true }"
                  name="departement"
                    :state="validateState('departement')"
                  aria-describedby="departementFeedback"
                >
                  <option
                    v-for="departement in listdepartement"
                    :key="departement.dep_num"
                    :value="departement.dep_num"
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
            <!-- COLLECTIVITE TYPE EPCI -->
          <div v-if="mastructure.tco_id == 3">
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
            <b-form-group  v-if="boolEpci == true">
             EPCI correspondant : <b>{{mastructure.dco_insee}} {{listepci[0].epci_libelle}}</b></b-form-group
            >
            <b-form-group v-if="boolEpci == false">
                Aucun EPCI correspondant</b-form-group
            >
            <div>
            </div>
          </div>

          </b-form-group>    
        </div>    
        <!-- FIN EPCI-->
        <!-- FIN Cas d'une collectivite territoriale-->
        <b-form-group 
          >
            Avez-vous suivi la formation "Génération Vélo" ?<span style="color: red">*</span>
            <b-form-radio-group  
              v-model="formgenevelo"
              v-validate="{ required: true }"
              aria-describedby="geneveloFeedback">
              <b-form-radio value="true">Oui</b-form-radio>
              <b-form-radio value="false">Non</b-form-radio>
            </b-form-radio-group>
            <b-form-invalid-feedback id="geneveloFeedback"
            >Le nom est obligatoire.</b-form-invalid-feedback
          >
                </b-form-group>

      </b-form>
    </b-card>
    <b-card class="mb-3" header="Vos coordonnées :" v-if="mastructure.str_id !=9">
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
            id="emailidentique"
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
                v-model="cpcontact"
                name="codepostal"
                key="codepostal"
                :state="validateState('codepostal')"
                v-validate="{ required:Boolean(user.autorisepublicarte), length:5,numeric:true}"
                aria-describedby="cpFeedback"
                id="codepostal"
                type="number"
                placeholder="CP de la commune"
              />
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
                  v-for="commune in listecommunecontact"
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
                v-validate="{numeric, min:0, max:10}" />
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
    <b-card class="mb-3" >

      <b-form-group id="legalCheckGroup" v-if="checkLegal">
          <b-form-checkbox-group
            v-model="isLegalChecked"
            id="legalCheck"
            :state="validateState('legalCheck')"
            aria-describedby="legalFeedback"
            v-validate="{ is: 'true' }"
            name="legalCheck"
          >
            <b-form-checkbox value="true">
              « Intervenant du
              <b>Savoir Rouler à Vélo</b>, je m’engage à construire et réaliser
              mes sessions d’apprentissage sur la base du socle commun
              <b>Savoir Rouler à Vélo</b> et à vérifier l’acquisition de
              l’ensemble des compétences attendues du bloc 1, 2 et 3 pour
              délivrer l’attestation <b>Savoir Rouler à Vélo</b>».
              <span style="color: red">*</span>
            </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-invalid-feedback id="legalFeedback"
            >Il est obligatoire de valider les conditions
            légales.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group>
          <span style="color: red">*</span> : Champ obligatoire
        </b-form-group>
        <div class="mb-3 text-right">
          <b-button
            @click="submit"
            variant="success"
            :disabled="
              (isLegalChecked === 'false') 
            "
            >{{ submitTxt }}</b-button
          >
        </div>
        <div v-if="(errors.any() && (errors.items.length > 0))"><p style="color:red;">Il existe {{errors.items.length}} erreur(s) sur le formulaire.<br>Corrigez puis revalidez<br>{{errors.items.msg}}</p></div>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      cp: null,
      cpcontact: null,
      isLegalChecked: "false",
      emailidentique: "false",
      listtypecol: [
        { text: "Commune", value: 1 },
        { text: "Conseil Départemental", value: 2 },
        { text: "EPCI", value: 3 },
      ],
      listdepartement: null,
      listepci: null,
      cpEpci: null,
      boolEpci: false,
      userStructureId: 0,
      listecommune: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          insee: null,
          cp: null,
          codedep: null,
        },
      ],
      listecommunecontact: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          insee: null,
          cp: null,
          codedep: null,
        },
      ],
      listeetablissement: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          eta_commune: null,
          eta_nom: null, 
          eta_adresse1: null,
          eta_codepostal: null,
        },
      ],
      cpetab: null,

      mastructure:   {
        str_id: null,
        uti_structurelocale: null,
        tco_id: null,
        dco_id: null,
        str_libellecourt: null ,
        str_libelle: null ,
        str_actif: null ,
        str_federation: null ,
        str_typecollectivite: null ,
        dco_codepostal: null ,
        dco_insee: null ,
        dco_dep: null ,
        dco_epci_code: null, 
        
      },
      // COLLECTIVITE
      maCollectivite: null,
      typeCollectivite: [],
      // COLLECTIVITE type Commune
      maCommune: null,
      CommuneExiste: false,
      formgenevelo: {
          type: Boolean,
          default: null
        }
    };
  },
  props: ["submitTxt", "user", "checkLegal"],
  methods: {
    submit: function () {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {

          this.$store.dispatch('post_user_structures', this.mastructure) 
            .then(message => {
              console.info(message)
              this.$toast.success(`structure #${this.mastructure.str_id} créée`, [])
              //this.$store.dispatch('get_structures') 
              //this.$modal.hide('editStruct')
              this.$store.dispatch('set_state_element',{ key:'utilisateurCourant', value: this.user })

            })
            .catch(error => {
              console.error('Une erreur est survenue lors de la création de la structure', error)
            })

          return this.$emit("submit");
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
      console.log("***************************")
      if (this.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        console.info("Recherche de la commune");
        this.mastructure.dco_codepostal = this.cp
        const url =
          process.env.API_URL + "/listecommune?codepostal=" + this.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then((response) => {
            this.CommuneExiste = true;
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
        this.CommuneExiste = false;
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
    recherchecommune2: function() {
      // Recopie du CP dans le CP User
      this.user.codepostal = this.cpcontact
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
            this.listecommunecontact = response.communes;
            console.info("recherchecommune2 : this.listecommunecontact " + this.listecommunecontact );
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération des communes pour le contact",
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
    rechercheetablissementcp: function() {
      // Recopie du CP dans le CP User
      if (this.cpetab.length === 5) {
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listeetablissement?codepostal=" +
          this.cpetab;
        // Retourne la liste des communes associées au Code postal
        return this.$axios
          .$get(url)
          .then(response => {
            this.listeetablissement = response.etablissement;
            //console.info("rechercheetablissementcp : this.listeetablissement " + this.listeetablissement );
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération établissements",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listeetablissement = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    },    
    rechercheetablissementuai: function() {
      // Recopie du CP dans le CP User
      //console.log ("this.user.structureLocale.length" + this.user.structureLocale.length)
      if (this.mastructure.uti_structurelocale.length === 8) {
        //console.log ("this.user.structureLocale.length" + this.user.structureLocale.length)
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listeetablissement?codeuai=" + this.mastructure.uti_structurelocale

          //console.log (url)
        // Retourne la liste des communes associées au Code postal
        return this.$axios
          .$get(url)
          .then(response => {
            this.listeetablissement = response.etablissement;
            //cpetab = response.etablissement.codepostal;
            this.cpetab = this.listeetablissement[0].eta_codepostal
            //console.info("rechercheetablissementuai : this.listeetablissement XXX", this.listeetablissement[0].eta_codepostal );
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération établissements par code uai",
              error
            );
          });
      } else {
        // On vide la liste car le code postal a changé
        this.listeetablissement = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
      }
    }, 
    chargeTypeCollectivite: function() {
      const url =  process.env.API_URL + "/structures/typecollectivite/";
      console.info(url);
      return this.$axios.$get(url).then(response => {
              this.typeCollectivite = response.typeCollectivite;
              //console.log (this.listestructures)
              //this.loading = false;
            })
            .catch(error => {
              console.error(
                "Une erreur est survenue lors de la récupération des type de collectivité",
                error
              );
            });
    },
    chargeUtiStructures(iduti) {
      const url =  process.env.API_URL + "/structures/user/" + iduti;
      console.info(url);
      return this.$axios.$get(url).then(response => {
              this.listestructures = response.structures;

              console.log (this.listestructures)
              this.loading = false;
            })
            .catch(error => {
              console.error(
                "Une erreur est survenue lors de la récupération des communes",
                error
              );
            });
    },    
    emitUser: function() {

      this.$store.dispatch('post_user_structures', this.mastructure) 
        .then(message => {
          console.info(message)
          this.$toast.success(`structure #${this.mastructure.str_id} créée`, [])
          //this.$store.dispatch('get_structures') 
          //this.$modal.hide('editStruct')
          return this.$store.dispatch('set_state_element',{ key:'utilisateurCourant', value: this.user }) 

        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la création de la structure', error)
        })

      
    }
  },
  watch: {
    cp() {
      this.recherchecommune();
    },
    cpEpci() {
      this.rechercheepci();
    },
    "cpcontact"() {
      // On recherche la liste des communes lors de la modification du Code postal
      this.recherchecommune2();
    },
    "emailidentique"()  {
      //console.log("Check mailidentiques : " + this.emailidentique)
      // Renseignement automatique de la valeur de mailcontact avec l'adresse mail de l'utilisateur si on coche
      
      if (this.emailidentique==="true") 
      {
        this.user.mailcontact=this.mail
      }
      
    },
    "userStructureId"() {
      this.mastructure.str_id  = this.userStructureId
    },
    "cpetab"() {
      //console.log("Structure locale avant changement CP : "  + this.user.structurelocale)
      // On recherche la liste des communes lors de la modification du Code postal
      this.rechercheetablissementcp();
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
    // Mantis 68055
    //if (!this.user.validated) {
    //  this.user.structureId = 0;
    //}
    await this.$store.dispatch("get_structures");
    this.getDepartements().then((res) => {});
    // Chargement du CP et liste commune + sélection
    if(this.user.codepostal)
    {
      // Recopie du CP dans le champ code postal
      this.cpcontact = this.user.codepostal
      // Recherche de la liste des commune
      this.recherchecommune2()
      // Sélection de la commune correspondant à celle de l'utilisateur dans la liste
      //this.selectedCommune = this.user.cpi_codeinsee;
    }    
    // Recherchegement de l'établissement si il a été 
    if (this.mastructure.str_id  == 9) {
      this.rechercheetablissementuai()
    }

    // Chargement des type de collectivités pour les collectivités territoriales
    this.chargeTypeCollectivite().then((res) => {});
    
    // CHargement de la structure de l'utilisateur
    this.chargeUtiStructures(this.user.id);
    this.formgenevelo = this.user.formgenevelo;
   
  },
  computed: {
    ...mapState(["structures"]),
    mail: {
      get() {
        return this.$store.state.utilisateurCourant.mail
      },
      set(value) {
        return this.$store.dispatch('set_state_element',{ key:'utilisateurCourant.mail', value })
      }
    },
    isUserRegisteredViaPwd() {
      return Boolean(this.user && this.user.tokenFc)
    },
    listeStructures() {
      var liste = this.structures;
      if (this.mail && this.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        if (!this.user.typeCollectivite) {
          liste = this.structures.filter((str) => {
            var isMatch = true;
            isMatch =isMatch
            &
              (String(str.str_libellecourt) != "DS");
              /*&
              (String(str.str_libellecourt) != "DEP") &
              (String(str.str_libellecourt) != "EPCI") &
              (String(str.str_libellecourt) != "COM");
              */
            return isMatch;
          });
        } 
        return liste;
      }
    },
  },
};
</script>

<style>
</style>

