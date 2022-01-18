<template>
  <div>
    <b-card class="mb-3">
      <b-card-body>
        <editable
          :columns="headers"
          :data="this.listestructures"
          :removable="false"
          :creable="false"
          :editable="false"
          :noDataLabel="''"
          tableMaxHeight="none"
          :loading="loading"
        >
          <template slot-scope="props" slot="actions">
            <b-btn
              @click="deleteStruct(props.data.str_id, props.data.dco_id, props.data.uti_structurelocale, props.data.str_libelle)"
              size="sm"
              class="mr-1"
              variant="danger"
              id="boutonDesactive"
            >
              <i class="material-icons">no_accounts</i>
            </b-btn>
            <b-tooltip target="boutonDesactive" triggers="hover">
                Je n'interviens plus<br> sur cette structure<br>Je la désactive
            </b-tooltip>
           
          </template>
        </editable>
        <b-card v-if="listestructures.length == 3" align="center">
          Pour ajouter une nouvelle structure vous devez vous désaffilier d'une de vos structures<br>
          3 structures maximum sont possibles
        </b-card>
        <b-btn v-if="!AjouterStructure && listestructures.length < 3" @click="addStruct(null)" class="btn btn-primary btn-lg btn-block" >
          Ajouter une structure<i class="material-icons">add</i>
        </b-btn>
      </b-card-body>

    </b-card>
      <b-card class="mb-3" v-if="AjouterStructure">
      <b-card-body>
        <b-form> Choix de la structure sur laquelle vous exercez :
          <b-form-select v-model="mastructure.str_id" >
            <option
              v-for="structure in this.structures"
              :key="structure.str_id"
              :value="structure.str_id"
            >{{ structure.str_libellecourt}}</option>
          </b-form-select>
        </b-form>
<!--
{{mastructure}}
{{maCollectivite}}
-->
        <!-- STRUCTURE LOCALE POUR TOUS SAUF EDUCATION NATIONALE & COLLECTIVITE TERRITORIALES -->
        <div v-if="mastructure.str_id != null && mastructure.str_id != 99999  && mastructure.str_id != 9">
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
              v-model="mastructure.uti_structurelocale"
              placeholder="Nom de la structure locale"
            />
            <b-form-invalid-feedback id="structLocFeedback"
              >La structure locale est obligatoire.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
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
             EPCI correspondant : <b>{{listepci[0].com_codeinsee}} {{listepci[0].epci_libelle}}</b></b-form-group
            >
            <b-form-group v-if="boolEpci == false">
                Aucun EPCI correspondant</b-form-group
            >
            <div>
              <!--
              <b-form-group
                v-if="boolEpci"
                id="ECPI"
                label="EPCI :"
                required
                label-for="epciInput"
              >
                <b-form-select
                  id="epciSelect"
                  v-model="mastructure.dco_insee"
                  v-validate="{ required: true }"
                  name="epcis"
                  :state="validateState('toto')"
                  aria-describedby="epciFeedback"
                >
                  <option
                    v-for="epci in listepci"
                    :key="epci.com_codeinsee"
                    :value="epci.com_codeinsee"
                  >
                    {{ epci.epci_libelle }}+ {{epci.com_codeinsee}}
                  </option>
                </b-form-select>
                <b-form-invalid-feedback id="epciFeedback"
                  >L'EPCI est obligatoire.</b-form-invalid-feedback
                ></b-form-group
              >
              <b-form-group v-if="boolEpci == false">
                Aucun EPCI correspondant</b-form-group
              >
              -->
            </div>
          </div>

          </b-form-group>    
        </div>    
      <!-- BOUTONS ENREGISTRER OU ANNULER  -->
      <b-btn @click="saveStruct(null)" class="btn btn-success btn-lg btn-block" >
        Enregistrer<i class="material-icons">save</i>
      </b-btn>
    </b-card-body>
  </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Editable from "~/components/editable/index.vue";
export default {
    components: {
    Editable},

  data() {
    return {
      loading: true,
      AjouterStructure: false,
      listestructures: [],
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
      // Autre que EN et CT
      structureLocale: null,
      // EDUCATION NATIONALE
      cpetab: null,
      listeetablissement: [],
      // COLLECTIVITE
      maCollectivite: null,
      typeCollectivite: [],
      // COLLECTIVITE type Commune
      maCommune: null,
      cp: null,
      CommuneExiste: false,
      listecommune: [],
      // COLLECTIVITE type Conseil départemental
      listdepartement: [],
      cpEpci: null,
      boolEpci: false,

      // COLLECTIVITE type EPCI
      listepci: [],
      headers: [
        { path: "str_libelle", title: "Libellé", type: "text", sortable: true },
        { path: "uti_structurelocale", title: "Structure locale", type: "text", sortable: true },
        { path: "eta_nom" , title: "Etablissement", type: "text", sortable: true },
        { path: "tco_libelle", title: "Type collectivité", type: "text", sortable: true },
        { path: "dep_libelle" , title: "Département", type: "text", sortable: true },
        { path: "com_libelle" , title: "Commune", type: "text", sortable: true },
        { path: "epci_libelle" , title: "EPCI", type: "text", sortable: true },
              {
                path: "__slot:actions",
                title: "Actions",
                type: "__slot:actions",
                sortable: false
              }],
      };
  },
  props: ["user","submitTxt", "cancelTxt","checkLegal"],
  methods: {
    addStruct: function() {
      this.AjouterStructure = true;
    },
    deleteStruct: function(strid, dcoid,strlocale,strlibelle) {
      console.log("Id structure selectionnée : ", strid)
      console.log("Id structure selectionnée : ", dcoid)
      this.mastructure.str_id = strid
      this.mastructure.dco_id = dcoid
      this.mastructure.uti_structurelocale = strlocale
      this.mastructure.str_libelle = strlibelle
      if (this.listestructures.length === 1) {
        this.$toast.info(`Vous ne pouvez pas désactiver la dernière structure`)
      }
      else
      {
        return this.$store.dispatch('post_del_user_structure', this.mastructure)
          .then(message => {
            console.info("Retour supression structure", message)
            this.AjouterStructure = false
            this.$toast.success(`Désaffiliation à la structure ${this.mastructure.str_libelle} réalisée`, [])
            //this.$store.dispatch("get_user_structures",this.$store.state.utilisateurCourant.id)
            this.chargeUtiStructures(this.$store.state.utilisateurCourant.id);
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la création de la structure', error)
          })
      }
    },
    saveStruct: function() {
      console.log("Sauvegarde des structures")
      return this.$store.dispatch('post_user_structures', this.mastructure) 
        .then(message => {
          console.info(message)
          this.AjouterStructure = false
          this.$toast.success(`Affiliation à la structure #${this.mastructure.str_libelle} réalisée`, [])
          //this.$store.dispatch("get_user_structures",this.$store.state.utilisateurCourant.id)
          this.chargeUtiStructures(this.$store.state.utilisateurCourant.id);
          console.log("Structure rechargées : ",this.mastructure)
          //this.$store.dispatch('get_structures') 
          //this.$modal.hide('editStruct')

        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la création de la structure', error)
        })
    },
    editStruct: function(id) {
      if (id === null) {
        this.$store.commit("clean_structureSelectionnee");
        this.$modal.show("editStruct");
      } else {
        return this.$store.dispatch("get_structure", id)
          .then(() => {
            this.$modal.show("editStruct");
          })
          .catch(error => {
            console.error(
              "Une erreur est survenue lors de la récupération du détail de la structure",
              error
            );
          });
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

    // Get liste des communes correspondant au code postal
    recherchecommune: function () {
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
            this.CommuneExiste = false;
            console.error(
              "Une erreur est survenue lors de la récupération des communes",
              error
            );
          });
      } else {
        this.CommuneExiste = false;
        // On vide la liste car le code postal a changé
        this.listecommune = ["Veuillez saisir un code postal"];
        return Promise.resolve(null);
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
    rechercheepci: function () {
      if (this.cpEpci.length === 5) {
        // Le code postal fait bien 5 caractères
        this.mastructure.dco_codepostal = this.cpEpci
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
              this.mastructure.dco_insee = response.epci[0].com_codeinsee
              this.mastructure.dco_epci_code = response.epci[0].epci_code
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
    }
  },
  watch: {
    cp() {
      this.recherchecommune();
    },
    cpetab() {
      //console.log("Structure locale avant changement CP : "  + this.user.structurelocale)
      // On recherche la liste des communes lors de la modification du Code postal
      this.rechercheetablissementcp();
    },
    cpEpci() {
      this.rechercheepci();
    },     
  },
  async mounted() {
    this.loading = true;
    const iduti = this.$store.state.utilisateurCourant.id
    console.log("UtilisateurCourant : ", iduti)

    console.log("Appel procédure get_user_structures")
    await Promise.all([ 
      this.$store.dispatch("get_user_structures",iduti).catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des structures de l'utilisateur",
          error
        );
      }),
      
      this.$store.dispatch("get_structures").catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des structures",
          error
        );
      }),
    ]);

    console.log (this.structures)
    // Chargement des type de collectivité
    this.chargeTypeCollectivite().then((res) => {});

    // Chargement des départements
    this.getDepartements().then((res) => {});


// formatUtilisateurSructure
    this.chargeUtiStructures(iduti);

  },
  computed: {
    ...mapState(["utilisateurStructures","structures","utilisateurCourant"]),
    
  },
};
</script>

<style>
</style>

