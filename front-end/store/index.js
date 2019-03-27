import Vue from 'vue'

export const state = () => ({
  interventions         : [],
  interventionCourrante : {},
  utilisateurCourant    : null,
  utilisateurSelectionne: [],
  users                 : [],
  structures            : [],
  documents             : []

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
    state.interventionCourrante = {};
  },
  select_intervention(state, index) {
    state.intervention = state.interventions[index];
  },
  set_utilisateurCourant(state, utilisateur) {
    console.info("set_utilisateurCourant BEGIN");
    console.log('%O', utilisateur)
    state.utilisateurCourant = utilisateur;
  },
  set_utilisateurSelectionne(state, utilisateur) {
    console.info("set_utilisateurSelectionne BEGIN");
    state.utilisateurSelectionne = utilisateur;
  },

  put_user(state, { utilisateurSelectionne, index }) {
    console.info("set_utilisateurSelectionne", { utilisateurSelectionne });
    Vue.set(state.utilisateurSelectionne, index, utilisateurSelectionne);
  },

  clean_utilisateurCourant(state) {
    console.log("CLEANING USER")
    state.utilisateurCourant = null;
  },
  set_users(state, users){
    state.users = users
  },
  put_user(state, {user, index}){
    Vue.set(state.users, index, user)
  },
  set_structures(state, structures){
    state.structures = structures
  },
  set_documents(state, documents){
    state.documents = documents
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req, route }) {
    // Transition states
    console.log('Loading user')
    if (route.path.indexOf('/connexion/logout') === 0) {
      return
    }
    await this.$axios.$get(process.env.API_SERVER_URL + '/connexion/user').then(utilisateur => {
      commit("set_utilisateurCourant", utilisateur)
    }).catch((err) => {
      console.log("Error - nuxtServerInit")
      console.log(err)
    })
  },
  async get_interventions({ commit, state }) {
    console.info("get_interventions");
    const url = process.env.API_URL + "/interventions";
    return await this.$axios
      .$get(url)
      .then(response => {
        response.interventions.forEach(intervention => {
          intervention.dateCreation     = new Date(intervention.dateCreation)
          intervention.dateIntervention = new Date(intervention.dateIntervention)
        })
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
  async get_intervention({ commit, state }, idIntervention) {
    console.info("get_interventions");
    const url = process.env.API_URL + "/interventions/" + idIntervention;
    return await this.$axios
      .$get(url)
      .then(response => {
        response.intervention.dateCreation     = new Date(response.intervention.dateCreation)
        response.intervention.dateIntervention = new Date(response.intervention.dateIntervention)
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
  async post_intervention({ commit, state }, intervention) {
    const url                        = process.env.API_URL + "/interventions";
          intervention.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$post(url, { intervention }).then(({ intervention }) => {
      console.info('post_intervention', { intervention });
      commit('add_intervention', intervention)
      return intervention
    });
  },
  async put_intervention({ commit, state }, intervention) {
    const url                        = process.env.API_URL + "/interventions/" + intervention.id;
    const index                      = state.interventions.findIndex(i => i.id === intervention.id )
          intervention.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$put(url, { intervention }).then(({ intervention }) => {
      commit('put_intervention', { intervention, index })
      return intervention
    })
  },
  async set_utilisateur({ commit }, utilisateur) {
    commit("set_utilisateurCourant", utilisateur)
  },

  async get_users({ commit, state }) {
    console.info("get_users :" + state.utilisateurCourant);
    const url = process.env.API_URL + "/user/";
    console.info('url:' + url)
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_users", response.users);
        return { users: response.users }
      })

      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération des utilisateurs",
          error
        );
      });
  },
  async get_user({ commit,state }, idUtilisateur) {
    console.info("get_user :" + idUtilisateur);
    const url = process.env.API_URL + "/user/" + idUtilisateur;
    console.info('url:' + url)
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_utilisateurSelectionne", response.user);
        console.info("fetched user - done", {
          utilisateurSelectionne: response.user
        });
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération de l'utilisateur",
          error
        );
      });
  },

  async put_user({ commit, state }, utilisateurSelectionne) {
    const url = process.env.API_URL + "/user/" + utilisateurSelectionne.id;
    console.info('url:' + url)
    var userIndex = state.users.findIndex(utilisateur => {
      return utilisateur.id == utilisateurSelectionne.id
    })
    return await this.$axios
      .$put(url, { utilisateurSelectionne })
      .then(async res => {
        const url = process.env.API_URL + "/user/" + res.user.id;
        console.info('url:' + url)
        return this.$axios
          .$get(url)
          .then(response => {
            commit("put_user", {user: response.user, index: userIndex});
          })
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
          error
        );
      });
  }, 
  async logout({ commit }) {
    commit("set_utilisateurCourant", {})
  },
  async get_structures({commit}) {
    const url = process.env.API_URL + '/structures'
    return this.$axios.get(url).then(response => {
      commit("set_structures", response.data);
    }).catch(err => {
      console.log(err)
    })
  },
  async get_documents({commit}) {
    const url = process.env.API_URL + '/documents'
    return this.$axios.get(url).then(response => {
      var documents = response.data
      documents.forEach(doc => {
        delete doc.doc_contenu
      })
      commit("set_documents", response.data);
    }).catch(err => {
      console.log(err)
    })
  }
};

export const getters = {
  primaryColor: () => "#4546A1"
}
