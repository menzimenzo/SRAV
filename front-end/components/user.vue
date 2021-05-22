*<template>
  <b-container class="interventionModal">
    <b-row>
      <b-col cols="12" class="text-center">
        <h2 class="mb-3 interventionTitle">
          Edition de l'utilisateur <br /><b
            >{{ formUser.prenom }} {{ formUser.nom }}</b
          >
        </h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col style="border-right: 1px solid #252195">
        <div class="mb-3 mt-3">
          Nom :

          <b-form-input
            readonly
            aria-describedby="inputFormatterHelp"
            v-model="formUser.nom"
            type="text"
          ></b-form-input>
        </div>
        <div class="mb-3 mt-3">
          Prénom :

          <b-form-input
            readonly
            aria-describedby="inputFormatterHelp"
            v-model="formUser.prenom"
            type="text"
          ></b-form-input>
        </div>
        <div class="mb-3 mt-3">
          Courriel :

          <b-form-input
            readonly
            aria-describedby="inputFormatterHelp"
            v-model="formUser.mail"
            type="text"
          ></b-form-input>
        </div>
        <div class="mb-3 mt-3">
          Statut utilisateur :
          <b-form-select v-model="formUser.statut" :options="liststatus" />
        </div>
        <div class="mb-3 mt-3">
          <b-form-checkbox
            switch
            v-model="formUser.validated"
            name="check-button"
          >
            Utilisateur validé <b></b>
          </b-form-checkbox>
        </div>
      </b-col>
      <b-col>
        <div class="mb-3 mt-3">
          Profil :
          <b-form-select
            v-model="formUser.profil"
            :options="listeprofil"
            :disabled="!isAdmin()"
          />
        </div>
        <b-form-group
          required
          id="structNationaleGroup"
          label="Structure nationale :"
          label-for="structNatSelect"
        >
          <!--Mantis 68055 : min_value: 1-->
          <b-form-select
            id="structNatSelect"
          :disabled="!isAdmin()"
            v-model="userStructureId"
            v-validate="{ required: true, min_value: 1 }"
            name="struct"
            :state="validateState('struct')"
            aria-describedby="structFeedback"
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
        
          <!-- ETABLISSEMENT POUR STRUCTURE EDUCATION NATIONALE -->
          <div v-if="userStructureId == 9">
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
                v-model="formUser.structureLocale"
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
        <div v-if="userStructureId != 99999  && userStructureId != 9">
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
              v-model="formUser.structureLocale"
              placeholder="Nom de la structure locale"
            />
            <b-form-invalid-feedback id="structLocFeedback"
              >La structure locale est obligatoire.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <!-- FIN Cas d'une structure non collectivite territoriale-->
        <!-- Cas d'une collectivite territoriale-->
        <div v-if="userStructureId == 99999" >
          <b-form-group
            required
            id="typeCollectivite"
            label="Type de collectivité territoriale :"
            label-for="typeCollectiviteSelect"
          >
            <b-form-select
              id="typeCollectiviteSelect"
              v-model="formUser.typecollectivite"
              v-validate="{ required: true }"
              name="typeCol"
              :state="validateState('typeCol')"
              aria-describedby="typeColFeedback"
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
          <div v-if="formUser.typecollectivite == 2">
            <b-form-group
              id="Departement"
              label="Département :"
              required
              label-for="departementSelect"
            >
              <b-form-select
                id="departementSelect"
                v-model="formUser.libelleCollectivite"
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
          <div v-if="formUser.typecollectivite == 1">
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
                v-validate="{ required: true }"
                name="commune"
                key="commune"
                :state="validateState('commune')"
                aria-describedby="communeFeedback"
                type="text"
                v-model="formUser.libelleCollectivite"
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
          <div v-if="formUser.typecollectivite == 3">
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
                  id="epciSelect"
                  v-model="formUser.libelleCollectivite"
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

        <!--
        <div class="mb-3 mt-3">
          Structure :
          <b-form-select v-model="formUser.structure" :disabled="!isAdmin()">
            <option :value="'0'">Collectivités territoriales</option>
            <option
              v-for="structure in filteredStructures"
              :key="structure.str_id"
              :value="structure.str_id"
            >
              {{ structure.str_libelle }}
            </option>
          </b-form-select>
        </div>
        <div v-if="formUser.structure > 0" class="mb-3 mt-3">
          Structure locale :
          <b-form-input
            id="structLocaleInput"
            type="text"
            v-model="formUser.structureLocale"
            required
            placeholder="Nom de la structure"
            :disabled="!isAdmin()"
          />
        </div>
        <div v-else class="mb-3 mt-3">
          <div class="mb-3 mt-3">
            Type de collectivités:<br />
            <b-form-select v-model="formUser.typecol" :options="listtypecol" />
          </div>
          <div v-if="formUser.typecol == 1" class="mb-3 mt-3">
            <b-form-group id="CodePostal" label="Code Postal :" label-for="cp">
              <b-form-input
                v-model="cp"
                name="cp"
                key="cp"
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
                required
                name="communeInput"
                type="text"
                v-model="formUser.libelleCollectivite"
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
          <div v-if="formUser.typecol == 2" class="mb-3 mt-3">
            <b-form-group
              id="Departement"
              label="Département :"
              required
              label-for="departementSelect"
            >
              <b-form-select
                id="departementSelect"
                v-model="formUser.libelleCollectivite"
                required
                name="departement"
              >
                <option
                  v-for="departement in listdepartement"
                  :key="departement.dep_num"
                  :value="departement.dep_libelle"
                >
                  {{ departement.dep_libelle }}
                </option>
              </b-form-select>
            </b-form-group>
          </div>
          <div v-if="formUser.typecol == 3" class="mb-3 mt-3">
            <b-form-group
              id="CodePostalEpci"
              label="Code Postal EPCI:"
              label-for="cpEpci"
              required
            >
              <b-form-input
                v-model="cpEpci"
                name="cpEpci"
                key="cpEpci"
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
                  id="epciSelect"
                  v-model="formUser.libelleCollectivite"
                  required
                  name="epcis"
                >
                  <option
                    v-for="epci in listepci"
                    :key="epci.epci_libelle"
                    :value="epci.epci_libelle"
                  >
                    {{ epci.epci_libelle }}
                  </option>
                </b-form-select>
              </b-form-group>
              <b-form-group v-if="boolEpci == false">
                Aucun EPCI correspondant</b-form-group
              >
            </div>
          </div>
        </div>
        -->
      </b-col>
    </b-row>

    <p class="modal-btns">
      <b-button v-on:click="$modal.hide('editUser')">Annuler</b-button>
      <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
    </p>
  </b-container>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import { mapState } from "vuex";

var loadFormUser = function (utilisateur) {
  let formUser = JSON.parse(
    JSON.stringify(
      Object.assign(
        {
          nom: "",
          prenom: "",
          mail: "",
          naissance: "",
          profil: "",
          structure: "",
          structureLocale: "",
          statut: "",
          validated: "",
          typecollectivite: "",
          str_typecollectivite: ""
        },
        utilisateur
      )
    )
  );
  return formUser;
};

export default {
  props: {
    utilisateurSelectionne: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formUser: loadFormUser(this.$store.state.utilisateurSelectionne),
      listeprofil: [
        { text: "Administrateur", value: "1" },
        { text: "Partenaire", value: "2" },
        { text: "Intervenant", value: "3" },
      ],
      liststatus: [
        { text: "Actif", value: "1" },
        { text: "Bloqué", value: "2" },
      ],
      /*
      listtypecol: [
        { text: "Commune", value: "1" },
        { text: "Département", value: "2" },
        { text: "Communauté de communes", value: "3" },
      ],*/
      // Ajout collectivité
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
      userStructureId: null,
      listecommune: [
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

    };
  },
  methods: {
    checkform: function () {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      if (!this.formUser.nom) {
        this.erreurformulaire.push("Le nom");
        formOK = false;
      }
      if (!this.formUser.prenom) {
        this.erreurformulaire.push("Le prénom");
        formOK = false;
      }
      if (!this.formUser.mail) {
        this.erreurformulaire.push("Le mail");
        formOK = false;
      }

      if (!formOK) {
        console.info("Formulaire invalide", this.erreurformulaire);
        return;
      }

      if (this.formUser.typecol && this.formUser.typecol > 0) {
        console.log("structure de type collectivite");
        // on verifie si la structure existe déjà ou non
        let structureExistante = [];
        structureExistante = this.structures.filter((stru) => {
          var isMatch = true;
          isMatch =
            isMatch &&
            this.formUser.libelleCollectivite
              .toLowerCase()
              .indexOf(stru.str_libelle.toLowerCase()) > -1;
          return isMatch;
        });

        if (!structureExistante[0]) {
          console.log("structure a créer");
          // création de la structure
          let newStruct = {
            str_libelle: this.formUser.libelleCollectivite,
            str_actif: "true",
            str_federation: "",
            str_typecollectivite: this.formUser.typecol,
          };
          switch (this.formUser.typecol) {
            case "1":
              newStruct.str_libellecourt = "COM";
              break;
            case "2":
              newStruct.str_libellecourt = "DEP";
              break;
            case "3":
              newStruct.str_libellecourt = "EPCI";
              break;
          }

          this.$store
            .dispatch("post_structure", newStruct)
            .then((structure) => {
              console.log("structure créée");
              this.formUser.structure = structure.str_id;
              this.formUser.structureLocale = this.formUser.libelleCollectivite;

              return this.$store
                .dispatch("put_user", this.formUser)
                .then((message) => {
                  console.info(message);
                  this.$toast.success(
                    `Utilisateur ${this.formUser.prenom} ${this.formUser.nom} mis à jour`,
                    []
                  );
                  this.$store.dispatch("get_users");
                  this.$modal.hide("editUser");
                })
                .catch((error) => {
                  console.error(
                    "Une erreur est survenue lors de la mise à jour de l'utilisateur",
                    error
                  );
                });
            })
            .catch((error) => {
              console.error(
                "Une erreur est survenue lors de la création de la structure",
                error
              );
            });
        } else {
          // structure collectivite déjà décalrée en base
          console.log("structure déjà existante");
          this.formUser.structure = structureExistante[0].str_id;
          this.formUser.structureLocale = structureExistante[0].str_libelle;

          return this.$store
            .dispatch("put_user", this.formUser)
            .then(() => {
              this.$toast.success(
                `Utilisateur ${this.formUser.prenom} ${this.formUser.nom} mis à jour`,
                []
              );
              this.$store.dispatch("get_users");
              this.$modal.hide("editUser");
            })
            .catch((error) => {
              console.error(
                "Une erreur est survenue lors de la mise à jour de l'utilisateur",
                error
              );
            });
        }
      }
      else
      {
        console.log("Autre structure");
        return this.$store
        .dispatch("put_user", this.formUser)
        .then(() => {
          this.$toast.success(
            `Utilisateur ${this.formUser.prenom} ${this.formUser.nom} mis à jour`,
            []
          );
          this.$store.dispatch("get_users");
          this.$modal.hide("editUser");
        })
        .catch((error) => {
          console.error(
            "Une erreur est survenue lors de la mise à jour de l'utilisateur",
            error
          );
        });                  

      }
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
        this.formUser.cp = this.cp
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
    isAdmin: function(){
      if(this.$store.state.utilisateurCourant.profilId=="1") {
        return true;
      } else {
        return false;
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
      // Recherche de l'établissement à partir de la structure locale (UAI)
      if (this.formUser.structureLocale.length == 8) {
        //console.log ("this.user.structureLocale.length" + this.user.structureLocale.length)
        // Le code postal fait bien 5 caractères
        const url =
          process.env.API_URL +
          "/listeetablissement?codeuai=" + this.formUser.structureLocale

          //console.log (url)
        // Retourne la liste des communes associées au Code postal
        return this.$axios
          .$get(url)
          .then(response => {
            this.listeetablissement = response.etablissement;
            //cpetab = response.etablissement.codepostal;
            this.cpetab = this.listeetablissement[0].eta_codepostal
            console.log("cpetab recharge par uai" + this.formUser.structureLocale,this.listeetablissement[0].eta_codepostal)
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
    }
  },
  watch: {

    cpEpci() {
      this.rechercheepci();
    },
    cp() {
      this.recherchecommune();
    },
    "userStructureId"() {
      this.formUser.structure = this.userStructureId
      this.formUser.structureId = this.userStructureId
    },
    "formUser.structure"(stru) {
      // si la structure n'est pas de type collectivite, on efface les données liées à
      // la collectivite afin de savoir
      if (stru != 0) {
        this.formUser.typecol = null;
        this.formUser.libelleCollectivite = null;
      }
    },    
    "cpetab"() {
      //console.log("Structure locale avant changement CP : "  + this.user.structurelocale)
      // On recherche la liste des communes lors de la modification du Code postal
      this.rechercheetablissementcp();
    },
  },

  computed: { ...mapState(["structures", "utilisateurCourant"]) ,
  
    listeStructures() {
      var liste = this.structures;
      if (this.mail && this.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        if (!this.formUser.typecollectivite) {
          liste = this.structures.filter((str) => {
            var isMatch = true;
            isMatch =
              isMatch &
              (String(str.str_libellecourt) != "DS") &
              (String(str.str_libellecourt) != "DEP") &
              (String(str.str_libellecourt) != "EPCI") &
              (String(str.str_libellecourt) != "COM");

            return isMatch;
          });
        } 
        return liste;
      }
    },    
  
  },
  async mounted() {
    //await this.$store.dispatch("get_structures");
    await this.$store.dispatch("get_users");

    
    this.getDepartements().then((res) => {});

    if (this.formUser.typecollectivite) {
      this.userStructureId = 99999;
    }
        else
    {
      this.userStructureId = this.formUser.structure;

    }
    // Recherchegement de l'établissement si il a été 
    if (this.userStructureId == 9) {
      this.rechercheetablissementuai()
    }
    this.loading = false;
  },
  
};
</script>

<style>
.interventionModal {
  padding: 30px;
}
.modal-btns {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.interventionTitle {
  color: #252195;
}
</style>
