import Vue from 'vue'
import { get } from 'lodash'
import { parseErrorMessage, formatEmail } from '~/lib/utils'
import logger from '~/plugins/logger'
const log = logger('srav:store:index')

export const state = () => ({
  interventions         : [],
  interventionCourrante : {},
  utilisateurCourant    : null,
  utilisateurSelectionne: [],
  users                 : [],
  structures            : [],
  structureSelectionnee : [],
  documents             : [],
  statStructure         : []

});

export const mutations = {
  CLEAR(state) {
      log.i('mutations::demande/CLEAR')
      const initial = defaultState()
      Object.keys(initial).forEach(k => {
          state[k] = initial[k]
      })
  },
  SET(state, { key, value }) {
      console.log(`mutations::SET:${key}`, { value, key })
      const splitted = key && key.split('.')
      const lastKey = splitted.pop()
      let origin = state
      splitted.forEach(p => {
          // Si origin est vide et n'est pas un Boolean alors définir origin comme Object vide
          if (!origin[p] && typeof origin[p] !== 'boolean') Vue.set(origin, p, {})
          origin = origin[p]
      })
      Vue.set(origin, lastKey, value)
  },
  UNSET(state, { key }) {
      log.i(`mutations::UNSET:${key}`)
      const splitted = key.split('.')
      const lastKey = splitted.pop()
      let origin = state
      splitted.forEach(p => {
          // Si origin est vide et n'est pas un Boolean alors définir origin comme Object vide
          if (!origin[p] && typeof origin[p] !== 'boolean') Vue.set(origin, p, {})
          origin = origin[p]
      })
      Vue.set(origin, lastKey, null)
  },
  set_statStructure(state, statStructure) {
    state.statStructure = statStructure;
  },
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
  set_structureSelectionnee(state, structure) {
    console.info("set_structureSelectionne BEGIN");
    state.structureSelectionnee = structure;
  },
  put_structure(state, {structure, index}){
    Vue.set(state.structures, index, structure)
  },
  add_structure(state, structure) {
    console.info("add_structure", { structure: JSON.stringify(structure) });
    state.structures.push(structure);
  },
  clean_structureSelectionnee(state) {
    console.log("CLEANING structure sélectionnée")
    state.structureSelectionnee = null;
  },
  set_documents(state, documents){
    state.documents = documents
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req, route }) {
    // Transition states
    log.i('actions::nuxtServerInit - Loading user')
    if (route.path.indexOf('/connexion/logout') === 0) {
      return
    }
    await this.$axios.$get(process.env.API_URL + '/connexion/user').then(utilisateur => {
      commit("set_utilisateurCourant", utilisateur)
    }).catch((err) => {
      log.w('actions::nuxtServerInit - Error - nuxtServerInit', err.stack)
    })
  },
  async get_interventions({ commit, state }) {
    log.i("get_interventions - In");
    const url = process.env.API_URL + "/interventions";
    return await this.$axios
      .$get(url)
      .then(response => {
        response.interventions.forEach(intervention => {
          intervention.dateCreation     = new Date(intervention.dateCreation)
          intervention.dateIntervention = new Date(intervention.dateIntervention)
        })
        commit("set_interventionCourrantes", response.interventions);
        log.i("fetched interventions - Done", {
          interventions: this.interventions
        });
        // this.interventions = response.interventions
      })
      .catch(error => {
        log.w(
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
      console.info("fetched structures - done")
    }).catch(err => {
      console.log(err)
    })
  },
  async get_structure({ commit,state }, idStructure) {
    console.info("get_structure :" + idStructure);
    const url = process.env.API_URL + "/structures/" + idStructure;
    console.info('url:' + url)
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_structureSelectionnee", response.structures);
        console.info("fetched structure - done", {
          structureSelectionnee: response.structures
        });
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la récupération de la structure",
          error
        );
      });
  },
  async put_structure({ commit, state }, structureSelectionnee) {
    const url = process.env.API_URL + "/structures/" + structureSelectionnee.str_id;
    console.info('url put:' + url)
    var structureIndex = state.structures.findIndex(structure=> {
      return structure.id == structureSelectionnee.id
    })
    return await this.$axios
      .$put(url, { structureSelectionnee })
      .then(async res => {
        const url = process.env.API_URL + "/structures/" + res.structures.str_id;
        console.info('url put 2 :' + url)
        return this.$axios
          .$get(url)
          .then(response => {
            commit("put_user", {structure: response.structure, index: structureIndex});
          })
      })
      .catch(error => {
        console.error(
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
          error
        );
      });
  }, 
  async post_structure({ commit, state }, structure) {
    const url  = process.env.API_URL + "/structures";
          
    return await this.$axios.$post(url, { structure }).then(({ structure }) => {
      console.info('post_structure', { structure });
      commit('add_structure', structure)
      return structure
    });
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
  },
  login({ commit }, { email, password }) {
    log.i('actions::login - In', email)
    const url = process.env.API_AUTH_URL + "/login"
    return this.$axios.$post(url, { email, password })
        .then(authUser => {
            log.d('login - authserver response', authUser)
            if(authUser && !authUser._id) {
              log.w('login - authserver, user not found')              
              throw new Error('Email ou mot de passe incorrect.')
            } else if (authUser && authUser.applications && !authUser.applications.includes('SRAV')) {
              log.w('login - authserver, user cannot access this application.')
              throw new Error('L\'utilisateur existe mais ne peut accéder à cette application.')
            }
            const params = {
              token: authUser.token
            }
            return this.$axios.$get(`${process.env.API_URL}/connexion/login-from-auth/${authUser._id}`, {params} )
              .then(res => {
                const user = res.user
                log.i('login - Done', { user })
                commit("set_utilisateurCourant", user)
                this.$toast.success(`Bienvenue ${user.prenom}`)
              })
        })
        .catch(err => {
            log.w('login - error', err)
            const message = err.message || parseErrorMessage(get(err, 'response.data.message'))
            this.$toast.error(message)
            throw new Error(message)
        })
  },
  register({ commit }, params) {
      params.user.email = params.user && params.user.email && formatEmail(params.user.email)
      const { email, password, confirm } = params.user
      const url = params.url
      log.i('actions::register - In', email, password, confirm )
      let user = null

      return this.$axios.$get(`${process.env.API_AUTH_URL}/users/${email}/verify`)
          .then(isEmailTaken => {
              if (isEmailTaken) {
                  throw new Error('Un utilisateur utilise déjà cette adresse mail.')
              }
              log.d('actions::register to auth' )
              return this.$axios.$post(`${process.env.API_AUTH_URL}/register`, { applications: ['SRAV'], email, password, confirm, url })
          })
          .then(res => {
              user = res
              if (!user || !user._id) {
                  throw new Error('EMAIL_EXISTS')
              }
              log.i('actions::registered - done, with success to auth-server' )
              user['mail'] = user.email
              return commit("set_utilisateurCourant", user)
          })
          .catch((err) => {
              log.w('actions::register', err)
              const message = err.message || parseErrorMessage(get(err, 'response.data.message'))
              throw new Error(message)
          })
  },
  set_state_element({ commit }, {key,value }) {
    log.i('actions::set_state_element - In',{key , value} )
    return commit('SET', { key, value })
  }
};

export const getters = {
  primaryColor: () => "#4546A1"
}
