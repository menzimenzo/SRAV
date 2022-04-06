<template>
  <b-container class="interventionModal">
    <b-col cols="12" class="text-center">
      <h2 class="mb-3 interventionTitle">
        Edition de la structure
        <br>
        <b>{{formStruct.str_libellecourt}}</b>
      </h2>
    </b-col>
    <b-col cols="12">
      <b-row>
        <b-col cols="8">
          <div class="mb-3 mt-3">
            Libelle :
            <b-form-input
              aria-describedby="inputFormatterHelp"
              v-model="formStruct.str_libelle"
              type="text"
            ></b-form-input>
          </div>
        </b-col>
        <b-col cols="4">
          <div class="mb-3 mt-3">
            Libelle Court :
            <b-form-input
              aria-describedby="inputFormatterHelp"
              v-model="formStruct.str_libellecourt"
              type="text"
            ></b-form-input>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-row>
      <b-col>
        <div class="mb-3 mt-3">
          <b-form-checkbox switch v-model="formStruct.str_actif" name="check-button">
            structure active
            <b></b>
          </b-form-checkbox>
        </div>
      </b-col>
      <b-col>
        <div class="mb-3 mt-3">
          <b-form-checkbox switch v-model="formStruct.str_federation" name="check-button">
            fédération
            <b></b>
          </b-form-checkbox>
        </div>
      </b-col>
      <b-col>
        <div class="mb-3 mt-3">
          <b-form-checkbox switch v-model="formStruct.str_partenaire_titre" name="check-button">
            Partenaire titre
            <b></b>
          </b-form-checkbox>
        </div>
      </b-col>    
      <b-col cols="12" >
        <b-col cols="5">
            <b-form-group
                label="Logo partenaire :">
              <b-form-file label="Logo partenaire :" @change="previewImage" v-model="file" placeholder="Choisissez un fichier..." :browse-text="'Parcourir'"/>
            </b-form-group>
        </b-col>
        <b-col cols="5">
              <div class="image-preview" v-if="imageData.length > 0">
                  <img class="preview" :src="imageData" :width="this.formStruct.str_logo_proportion*imageData.length/10000">
              </div>
        </b-col>
        <div class="mb-3 mt-3">
          Proportion ({{formStruct.str_logo_proportion}} %):
          <b-form-input
            aria-describedby="inputFormatterHelp"
            v-model="formStruct.str_logo_proportion"
            type="range" min="0" max="100" default="100"
          ></b-form-input>
          Position horizontale (Gauche = 0) (Position actuelle : {{formStruct.str_logo_pos_horizontal}}) :
          <b-form-input
            aria-describedby="inputFormatterHelp"
            v-model="formStruct.str_logo_pos_horizontal"
            type="range" min="0" max="841.89" step="0.01"
          ></b-form-input>
          Position verticale (Haut = 0) (Position actuelle : {{formStruct.str_logo_pos_vertical}}) :
          <b-form-input
            aria-describedby="inputFormatterHelp"
            v-model="formStruct.str_logo_pos_vertical"
            type="range" min="0" max="595.28" step="0.01"
          ></b-form-input>
        </div>        
      </b-col>
    </b-row>    
     &nbsp;
    <b-row>
      <p class="modal-btns">
        <b-button v-on:click="$modal.hide('editStruct')">Annuler</b-button>
        <b-button variant="success" v-on:click="checkform">Enregistrer</b-button>
      </p>
    </b-row>
  </b-container>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";

var loadFormStruct = function(structure) {
  let formStruct = JSON.parse(
    JSON.stringify(
      Object.assign(
        {
          str_libelle: null,
          str_libellecourt: null,
          str_actif: "",
          str_federation: "",
          str_partenaire_titre: "",
          str_logo_proportion: "100",
          str_logo_pos_horizontal: "0",
          str_logo_pos_vertical: "0",
        },
        structure
      )
    )
  );
  return formStruct;
};

export default {
  props: {
    structureSelectionnee: {
      type: Object,
      default: () => {
        return {};
        //return { nbEnfants: 12 }
      }
    }
  },
  data() {
    return {
      formStruct: loadFormStruct(this.$store.state.structureSelectionnee),
      file: null,
      imageData: ""
    };
  },
  async mounted() {
    this.loading = true;

    if (this.$store.state.structureSelectionnee && this.$store.state.structureSelectionnee.str_id) {
      var doc
      this.downloadDoc(doc)
    }
    else
    {
      // Par défaut l'image est initialisée avec une image vide :-)
      this.file = new Blob(["R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"])
      this.previewImage2()
    }
  },
  methods: {
    checkform: function() {
      console.info("Validation du formulaire");
      this.erreurformulaire = [];
      var formOK = true;

      if (! this.formStruct.str_libelle) {
        this.erreurformulaire.push("Le libellé");
        formOK = false;
      } 
      if (! this.formStruct.str_libellecourt) {
        this.erreurformulaire.push("Le libellé court");
        formOK = false;
      }      
   
      if (!formOK) {
        console.info('Formulaire invalide', this.erreurformulaire)
        return
      }
      
      if (this.formStruct.str_id == null ) 
      {
        return this.$store.dispatch('post_structure', this.formStruct) 
        .then(message => {
          this.$toast.success(`structure #${this.formStruct.str_libelle} créée`, [])
          this.$store.dispatch('get_structures') 
          // Ajout du logo même si il est vide
          this.insertFile(message.str_id)
          this.$modal.hide('editStruct')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la création de la structure', error)
        })
      
      } else {
      return this.$store.dispatch('put_structure', this.formStruct) 
        .then(message => {
          console.info(message)
          this.$toast.success(`structure #${this.formStruct.str_libelle} mise à jour`, [])
          // Mise à jour du logo même si il est vide
          this.updateFile()
          this.$store.dispatch('get_structures')
          this.$modal.hide('editStruct')
        })
        .catch(error => {
          console.error('Une erreur est survenue lors de la mise à jour de la structure', error)
        })
      }
    },
    insertFile: function(strid) {
      var formData = new FormData();
      formData.append('file', this.file)
      formData.append('strid', strid)
      return this.$axios.post(process.env.API_URL + '/logos', formData).then(res => {
          console.log(res)
      }).catch(err => {
          this.$toast.error(`Problème à l'enregistrement du logo`, [])
          console.log(err)
      })
    },
    updateFile: function() {
      var formData = new FormData();
      formData.append('file', this.file)
      formData.append('strid', this.formStruct.str_id)
      return this.$axios.put(process.env.API_URL + '/logos', formData).then(res => {
          console.log(res)
      }).catch(err => {
          this.$toast.error(`Problème à la mise à jour du logo`, [])
          console.log(err)
      })
    },
    downloadDoc: function (doc) {
      this.$axios({
        url: process.env.API_URL + "/logos/" + this.$store.state.structureSelectionnee.str_id,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          this.file = new Blob([response.data])
          this.previewImage2()
          console.log("Done - Download", { url });
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.$toasted.error("Erreur lors du téléchargement: " + err.message);
        });
    },
    previewImage: function(event) {
            console.log("PreviewImage")
            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.imageData = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
        },
    previewImage2: function() {
            console.log("PreviewImage2")
            console.log("File", this.file)
            // Ensure that you have a file before attempting to read it
            if (this.file) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.imageData = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                //reader.readAsDataURL(this.file.toString('base64'));
                reader.readAsDataURL(this.file);
            }
        }        
  }
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
