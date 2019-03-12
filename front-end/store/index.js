import Vue from 'vue'

export const state = () => ({
  interventions: [],
  interventionCourrante: null,
  utilisateurCourant: null
});

export const mutations = {
  set_interventionCourrantes(state, interventions) {
    state.interventions = interventions;
  },
  set_interventionCourrante(state, intervention) {
    console.info("set_interventionCourrante", { intervention });
    state.interventionCourrante = intervention;
  },
  put_intervention(state, { intervention, index }) {
    console.info("set_interventionCourrante", { intervention });
    Vue.set(state.interventions, index, intervention);
  },
  add_intervention(state, intervention) {
    console.info("add_intervention", { intervention: JSON.stringify(intervention) });
    state.interventions.push(intervention);
  },
  clean_interventions(state) {
    state.interventions = [];
  },
  reset_interventions(state) {
    state.interventionCourrante = null;
  },
  select_intervention(state, index) {
    state.intervention = state.interventions[index];
  },
  set_utilisateurCourant(state, utilisateur) {
    console.info("set_utilisateurCourant BEGIN");
    console.log('%O', utilisateur)
    state.utilisateurCourant = utilisateur;
  },
  clean_utilisateurCourant(state) {
    console.log("CLEANING USER")
    state.utilisateurCourant = null;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { req, route }) {
    // Transition states
    if (route.path.indexOf('/connexion/logout') === 0 ){
      return
  }
    await this.$axios.$get('http://proxy/backend'+ '/connexion/user').then(utilisateur => {
      commit("set_utilisateurCourant", utilisateur)
    }).catch((err) => {
        console.log(err)
    })
  },
  async get_interventions({ commit }) {
    console.info("get_interventions");
    const url = "http://localhost/backend/interventions";
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_interventionCourrantes", response.interventions);
        console.info("fetched interventions - done", {
          interventions: this.interventions
        });
        // this.interventions = response.interventions
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des interventions",
          error
        );
        this.$store.commit("clean_interventions");
      });
  },
  async get_intervention({ commit }, idIntervention) {
    console.info("get_interventions");
    const url = "http://localhost/backend/interventions/" + idIntervention;
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_interventionCourrante", response.intervention);
        console.info("fetched intervention - done", {
          intervention: response.intervention
        });
        // this.interventions = response.interventions
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération de l'intervention",
          error
        );
      });
  },
  async post_intervention({ commit }, intervention) {
    const url = "http://localhost/backend/interventions";
    return await this.$axios.$post(url, { intervention }).then(({ intervention }) => {
      console.info('post_intervention', { intervention });
      return commit('add_intervention', intervention)
    });
  },
  async put_intervention({ commit, state }, intervention) {
    const url = "http://localhost/backend/interventions/" + intervention.id;
    const index = state.interventions.findIndex(i => i.id === intervention.id )
    return await this.$axios.$put(url, { intervention }).then(({ intervention }) => {
      commit('put_intervention', { intervention, index })
    })
  },
  async set_utilisateur({ commit }, utilisateur) {
    commit("set_utilisateurCourant", utilisateur)
  },
  async logout({commit}){
    commit("set_utilisateurCourant", {})
  }
};
