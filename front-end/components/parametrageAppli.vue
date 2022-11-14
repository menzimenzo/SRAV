<template>
    <b-container>
      <div v-if="parametres!=null && parametres.length>0">
        <div v-for="param in parametres" :key="param.par_code">
          <b-row>
            <b-col cols="12">
              <h5>{{param.par_description}}</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <code>{{param.par_code}}</code>
            </b-col>
            <b-col cols="5">
                <b-form-group >
                    <b-form-input type="text" v-model="param.par_valeur" />
                </b-form-group>
            </b-col>
            <b-col cols="1">
              <b-btn @click="SauveParametre(param.par_code, param.par_valeur)" class="mb-2" variant="primary">
                  <i class="material-icons" style="font-size: 18px; top: 4px;">save</i>
                </b-btn>
            </b-col>
          </b-row>
          <hr/>
        </div>
      </div>
      <p v-else>
        Aucun paramètre à afficher.
      </p>
    </b-container>
</template>
<script>

import logger from '~/plugins/logger'
const log = logger('components:parametrageAppli')

export default {
  data() {
    return {
      parametres : null,
      modeemploi :{
        mep_text : null
        }
    };
  },
  methods: {
    SauveParametre:function(code,valeur){
      console.log("Sauvegarde du paramètre : ", valeur.replace(/&/g,"%26"))
      console.log("Sauvegarde du paramètre : ", code)
      const url = process.env.API_URL + `/parametres/change?code='` + code + `'&valeur='`+valeur.replace(/&/g,"%26")+`'`
        this.$axios.$get(url)
        .then(response => {
            this.$toast.success(`Paramètre enregistré avec succès`, [])
        }).catch(err => {
          this.$toast.error("Une erreur à l'enregistrement du paramètre");
        })

      return true
    }
  },
  mounted(){
    const url = process.env.API_URL + '/parametres/list'
      this.$axios.$get(url)
      .then(response => {
          this.parametres = response
          console.log(JSON.stringify(response))
      }).catch(err => {
        log.w("mounted home - Error on mounted", err);
      })


  }
};
</script>
