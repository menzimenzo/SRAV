<template>
    <b-container>
      <b-row>
        <b-col cols="12">

          <h5>Ajouter un document: </h5> 
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="5">
            <b-form-group
                label="Libellé:">

                <b-form-input type="text" v-model="libelle" />
            </b-form-group>
        </b-col>
        <b-col cols="5">
            <b-form-group
                label="Fichier:">
              <b-form-file v-model="file" placeholder="Choisissez un fichier..." :browse-text="'Parcourir'"/>
            </b-form-group>
        </b-col>
        <b-col cols="2">
            <b-btn variant="primary" style="margin-top: 1.9rem !important;" @click="uploadFile()" :disabled="!file || !libelle.length">Ajouter</b-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <h5 >Documents disponibles: </h5>
          <ul v-if="documents.length > 0">
            <li v-for="doc in documents" :key="doc.doc_id" >
              {{doc.doc_libelle}}
              <b-img class="img-icon" fluid  @click="downloadDoc(doc)" :src="require('assets/pdf-240x240.png')" blank-color="rgba(0,0,0,0.5)" />
              <b-button variant="danger" class="ml-3" @click="deleteFile(doc.doc_id)" size="sm"><i class="material-icons">delete</i></b-button>
            </li>
          </ul>
          <div v-if="documents.length == 0">Aucun document disponible</div>
        </b-col>
      </b-row>
    </b-container>


</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {

  },
  computed: {
    ...mapState(['documents'])
  },
  data() {
    return {
      file: null,
      libelle: ""

    };
  },
  methods: {
    uploadFile: function() {
      console.info( 'uploadFile' )
      var formData = new FormData();
      formData.append('file', this.file)
      formData.append('libelle', this.libelle)
      return this.$axios.post(process.env.API_URL + '/documents', formData).then(res => {
          console.log(res)
          this.$store.dispatch('get_documents')
      }).catch(err => {
          console.log(err)
      })
      
    },
    deleteFile: function(id) {
      console.info( 'deleteFile' )
      return this.$axios.delete(process.env.API_URL + '/documents/' + id).then(res => {
          console.log(res)
          this.$store.dispatch('get_documents')
      }).catch(err => {
          console.log(err)
      })
    },
    downloadDoc: function(doc) {
      this.$axios({
        url: process.env.API_URL + '/documents/'+doc.doc_id,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
          // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
           // Crée un objet blob avec le contenue du CSV et un lien associé
          const url = window.URL.createObjectURL(new Blob([response.data]))
          // Crée un lien caché pour télécharger le fichier
          const link = document.createElement('a')
          link.href = url
          const fileName = doc.doc_filename
          link.setAttribute('download', fileName)
          // Télécharge le fichier
          link.click()
          link.remove()
          console.log('Done - Download', {fileName})
      }).catch(err => {
          console.log(JSON.stringify(err))
          this.$toasted.error('Erreur lors du téléchargement: ' + err.message )
      })
    },
  },
  mounted(){
    this.$store.dispatch('get_documents')
  }
};
</script>

<style>
.custom-file-input ~ .custom-file-label::after {
  content: 'Parcourir';
}
</style>
