<template>
  <div>
    <h2 class="mb-3 interventionTitle">USERinfo.vue</h2>
    <b-card class="mb-3">
      <b-form-group label="Prénom :">
        <b-form-input type="text" v-model="user.prenom" disabled />
      </b-form-group>
      <b-form-group label="Nom :">
        <b-form-input type="text" v-model="user.nom" disabled />
      </b-form-group>

      <b-form-group label="Date de naissance :">
        <b-form-input type="date" v-model="user.dateNaissance" disabled />
      </b-form-group>
    </b-card>
    <b-card class="mb-3">
      <b-form>
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
          >
            <!--Mantis 68055 value = 0 -->
            <option value="0">Veuillez choisir votre structure...</option>
            <option value="99999">Collectivités territoriales</option>
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
        <div v-if="user.structureId != 99999 && ! user.typeCollectivite" >
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
              >Il est nécessaire de choisir un type de collectivité.</b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div>
          <div v-if="user.typeCollectivite == 2 "> <!--*" ! user.typeCollectivite ">-->
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
          <div v-if="user.typeCollectivite == 1">
            <b-form-group
              id="CodePostal"
              label="Code Postal :"
              label-for="cp"
            >
              <b-form-input
                v-model="user.cp"
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
                  >{{ commune.com_libellemaj}}</option>
                </b-form-select>
              <b-form-invalid-feedback id="communeFeedback"
                >La commune est obligatoire.</b-form-invalid-feedback
              >
            </b-form-group>
          </div>
          <div v-if="user.typeCollectivite == 3 && ! user.typeCollectivite">
            <b-form-group
              id="comcom"
              label="Communauté de communes :"
              required
              label-for="comcomInput"
            >
              <b-form-input
                v-validate="{ required: true }"
                key="comcom"
                name="comcom"
                :state="validateState('comcom')"
                aria-describedby="comcomFeedback"
                id="comcomInput"
                type="text"
                v-model="user.libelleCol"
                placeholder="Nom de la communauté de communes"
              />
              <b-form-invalid-feedback id="communeFeedback"
                >La communauté de communes est
                obligatoire.</b-form-invalid-feedback
              >
            </b-form-group>
          </div>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLegalChecked: "false",
      listtypecol: [
        { text: "Commune", value: 1 },
        { text: "Département", value: 2 },
        { text: "Communauté de communes", value: 3 },
      ],
      listdepartement:null,
      listecommune: [
        {
          text: "Veuillez saisir un code postal",
          value: null,
          insee: null,
          cp: null,
          codedep: null
        }
      ]
    };
  },
  props: ["submitTxt", "user", "checkLegal"],
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
    // true si la structure sélectionnée est une fédération
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
    recherchecommune: function() {
      
      if (this.user.cp.length === 5) {
        // Le code postal fait bien 5 caractères
        console.info("Recherche de la commune");
        const url = process.env.API_URL + "/listecommune?codepostal=" + this.user.cp;
        console.info(url);
        return this.$axios
          .$get(url)
          .then(response => {
            this.listecommune = response.communes;
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
        return Promise.resolve(null);
      }
    },
    resetFields: function() {
        if (!this.$store.state.utilisateurCourant.typeCollectivite)
        {
          /*console.log('AVANT')  
          console.log(this.user)
          console.log('cp:'+this.user.cp)
          console.log('departement:'+this.user.departement)*/
          this.user.typeCollectivite = null;
        }
    }
  },
  watch: {
    "user.cp"() {
      this.recherchecommune();
    },
    "user.structureId"() {
      console.log('BBB')
      this.resetFields();
    },
    "user.typeCollectivite"(){
      console.log('AAAAAA');
      this.user.libelleCollectivite = null;
      //this.resetFields();
    }
  },
  async mounted() {
    await this.$store.dispatch("get_structures");
    // Mantis 68055
    if (!this.$store.state.utilisateurCourant.validated) {
      this.user.structureId = 0;
    }
    this.getDepartements().then(res => {});
  },
  computed: {
    ...mapState(["structures"]),
    listeStructures() {
      var liste = this.structures;
      if (this.user.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        if (!this.$store.state.utilisateurCourant.typeCollectivite)
        {
        liste = this.structures.filter((str) => {
          var isMatch = true;
          isMatch =
            isMatch &
            (String(str.str_libellecourt) != "DS") &
            (String(str.str_libellecourt) != "DEP") &
            (String(str.str_libellecourt) != "COM") &
            (String(str.str_libellecourt) != "COMCOM");
          return isMatch;
        });
        }
        else {
          liste = this.structures.filter((str) => {
          var isMatch = true;
          isMatch =
            isMatch &
            (String(str.str_libellecourt) != "DS");
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

