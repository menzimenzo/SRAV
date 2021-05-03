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
      listdepartement: null,
      cp: null,
      cpEpci: null,
      boolEpci: false,
      listeprofil: [
        { text: "Administrateur", value: "1" },
        { text: "Partenaire", value: "2" },
        { text: "Intervenant", value: "3" },
      ],
      liststatus: [
        { text: "Actif", value: "1" },
        { text: "Bloqué", value: "2" },
      ],
      listtypecol: [
        { text: "Commune", value: "1" },
        { text: "Département", value: "2" },
        { text: "Communauté de communes", value: "3" },
      ],
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
    },
    isAdmin: function () {
      if (this.$store.state.utilisateurCourant.profilId == "1") {
        return true;
      } else {
        return false;
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
        //this.user.cp = this.cp
        const url = process.env.API_URL + "/listecommune?codepostal=" + this.cp;
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
  },
  computed: { ...mapState(["structures", "utilisateurCourant"]),
  filteredStructures: function() {
      return this.structures.filter(x => {
        var isMatch = true;
          isMatch =
            isMatch &&
            (String(x.str_libellecourt) != 'COM' && String(x.str_libellecourt) != 'DEP' && String(x.str_libellecourt) != 'EPCI')
          return isMatch;
      });
    },
  
  },

  async mounted() {
    //await this.$store.dispatch("get_structures");
    await this.$store.dispatch("get_users");
    this.getDepartements().then((res) => {});
    this.loading = false;
  },
  watch: {
    cp() {
      this.recherchecommune();
    },
    cpEpci() {
      this.rechercheepci();
    },
    "formUser.structure"(stru) {
      // si la structure n'est pas de type collectivite, on efface les données liées à
      // la collectivite afin de savoir
      if (stru != 0) {
        this.formUser.typecol = null;
        this.formUser.libelleCollectivite = null;
      }
    },
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
