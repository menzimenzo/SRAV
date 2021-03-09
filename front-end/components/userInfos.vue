<template>
  <div>
    <b-card class="mb-3">
      <b-form>
        <b-form-group label="Prénom :">
          <b-form-input type="text" v-model="user.prenom" :disabled="isUserRegisteredViaPwd" />
        </b-form-group>
        <b-form-group label="Nom :">
          <b-form-input type="text" v-model="user.nom" :disabled="isUserRegisteredViaPwd" />
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
            v-model="user.structureId"
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
              errors.any() || (isLegalChecked == 'false' && !user.validated)
            "
            >{{ submitTxt }}</b-button
          >
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      cp: null,
      isLegalChecked: "false",
      listtypecol: [
        { text: "Commune", value: 1 },
        { text: "Conseil Général", value: 2 },
        { text: "EPCI", value: 3 },
      ],
      listdepartement: null,
      listepci: null,
      cpEpci: null,
      boolEpci: false,
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
  props: ["submitTxt", "user", "checkLegal"],
  methods: {
    submit: function () {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$store.dispatch('set_state_element',{ key:'utilisateurCourant', value: this.user })
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
    }
  },
  watch: {
    cp() {
      this.recherchecommune();
    },
    cpEpci() {
      this.rechercheepci();
    },
  },
  async mounted() {
    // Mantis 68055
    if (!this.user.validated) {
      this.user.structureId = 0;
    }
    await this.$store.dispatch("get_structures");
    this.getDepartements().then((res) => {});
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
      return this.user && this.user.tokenFc
    },
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

