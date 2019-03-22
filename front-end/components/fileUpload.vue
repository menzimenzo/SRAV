<template>
    <b-container>
      <b-row>
        <b-col cols="6" offset="3">
            <h4>Télé-versement d'un nouveau fichier</h4>
            <b-form-group
                label="Libellé:">

                <b-form-input type="text" v-model="libelle" />
            </b-form-group>
            <b-form-group
                label="Fichier:">
              <b-form-file v-model="file" placeholder="Choisissez un fichier..." :browse-text="'Parcourir'"/>
            </b-form-group>
            <b-btn variant="primary" class="float-right mt-3" @click="uploadFile()" :disabled="!file || !libelle.length">Ajouter</b-btn>
        </b-col>
      </b-row>
    </b-container>


</template>
<script>
export default {
  props: {

  },
  computed: {

  },
  data() {
    return {
      file: null,
      libelle: ""

    };
  },
  methods: {
    uploadFile: function(id) {
      console.info( 'uploadFile' )
      var formData = new FormData();
      formData.append('file', this.file)
      formData.append('libelle', this.libelle)
      return this.$axios.post(process.env.API_URL + '/documents', formData).then(res => {
          console.log(res)
      }).catch(err => {
          console.log(err)
      })
      
    }
  },
  mounted(){

  }
};
</script>

<style>
.custom-file-input ~ .custom-file-label::after {
  content: 'Parcourir';
}
</style>
