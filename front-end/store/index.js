import Vue from 'vue'
import { get } from 'lodash'
import { parseErrorMessage, formatEmail } from '~/lib/utils'
import logger from '~/plugins/logger'
const log = logger('store:index')

export const state = () => ({
  interventions         : [],
  interventionCourrante : {},
  utilisateurCourant    : null,
  utilisateurSelectionne: [],
  users                 : [],
  structures            : [],
  structureSelectionnee : [],
  documents             : [],
  evenements            : [],
  evenementSelectionnee : [],
  statStructure         : [],
  parametreSelectionne : [],
  utilisateurStructures : []

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
      log.i(`mutations::SET:${key}`, { value, key })
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
    log.i(`mutations::set_statStructure`)
    state.statStructure = statStructure;
  },
  set_interventionCourrantes(state, interventions) {
    log.i(`mutations::set_interventionCourrantes`)
    state.interventions = interventions;
  },
  set_interventionCourrante(state, intervention) {
    log.i(`mutations::set_interventionCourrante`, { intervention })
    state.interventionCourrante = intervention;
  },
  put_intervention(state, { intervention, index }) {
    log.i(`mutations::put_interventionCourrante`, { intervention })
    Vue.set(state.interventions, index, intervention);
  },
  add_intervention(state, intervention) {
    log.i(`mutations::add_interventionCourrante`, { intervention })
    state.interventions.push(intervention);
  },
  clean_interventions(state) {
    log.i(`mutations::clean_interventionCourrante`)
    state.interventions = [];
  },
  reset_interventions(state) {
    log.i(`mutations::reset_interventionCourrante`)
    state.interventionCourrante = {};
  },
  select_intervention(state, index) {
    log.i(`mutations::select_intervention`)
    state.intervention = state.interventions[index];
  },
  set_utilisateurCourant(state, utilisateur) {
    log.i("::mutations::set_utilisateurCourant - In");
    state.utilisateurCourant = utilisateur;
  },
  set_utilisateurSelectionne(state, utilisateur) {
    log.i(`mutations::set_utilisateurSelectionne`)
    state.utilisateurSelectionne = utilisateur;
  },
  put_user(state, { utilisateurSelectionne, index }) {
    log.i(`mutations::put_user`)
    Vue.set(state.utilisateurSelectionne, index, utilisateurSelectionne);
  },
  clean_utilisateurCourant(state) {
    log.i(`mutations::clean_utilisateurCourant`)
    state.utilisateurCourant = null;
  },
  set_users(state, users){
    log.i(`mutations::set_users`)
    state.users = users
  },
  put_user(state, {user, index}){
    log.i(`mutations::put_user`)
    Vue.set(state.users, index, user)
  },
  set_structures(state, structures){
    log.i(`mutations::set_structures`)
    state.structures = structures
  },
  set_structureSelectionnee(state, structure) {
    log.i(`mutations::set_structureSelectionne`)
    state.structureSelectionnee = structure;
  },
  put_structure(state, {structure, index}){
    log.i(`mutations::put_structure`)
    Vue.set(state.structures, index, structure)
  },
  add_structure(state, structure) {
    log.i(`mutations::add_structure`)
    state.structures.push(structure);
  },
  clean_structureSelectionnee(state) {
    log.i(`mutations::clean_structureSelectionnee`)
    state.structureSelectionnee = null;
  },
  set_documents(state, documents){
    log.i(`mutations::set_documents`)
    state.documents = documents
  },
  set_evenements(state, evenements){
    log.i(`mutations::set_evenements`)
    state.evenements = evenements
  },  
  clean_evenementSelectionnee(state) {
    log.i(`mutations::clean_evenementSelectionnee`)
    state.evenementSelectionnee = null;
  },
  set_evenementSelectionnee(state, evenement) {
    log.i(`mutations::set_evenementSelectionne`)
    state.evenementSelectionnee = evenement;
  },
  put_evenement(state, {evenement, index}){
    log.i(`mutations::put_evenement`)
    Vue.set(state.evenements, index, evenement)
  },

  set_parametreSelectionne(state, parametre) {
    log.i(`mutations::set_parametreSelectionne`)
    state.parametreSelectionne = parametre;
  },
  get_user_structures(state, utilisateurStructures){
    log.i(`mutations::set_utilisateur_structure`)
    state.utilisateurStructures = utilisateurStructures
  },
  post_del_user_structure(state, mastructure){
    log.i(`mutations::post_del_user_structure`)
    state.mastructure = mastructure
  },
  post_user_structures(state, mastructure) {
    log.i(`mutations::post_user_structures`)
    state.mastructure = mastructure
    //state.utilisateurStructures.push(mastructure);
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req, route }) {
    // Transition states
    log.i('actions::nuxtServerInit - Loading user')
    if (route.path.indexOf('/connexion/logout') === 0) {
      return
    }
    await this.$axios.$get(process.env.PROXY_URL + '/backend/api/connexion/user').then(utilisateur => {
      log.i('actions::nuxtServerInit - Done')
      commit("set_utilisateurCourant", utilisateur)
    }).catch((err) => {
      log.w('actions::nuxtServerInit - Error - nuxtServerInit', err.stack)
    })
  },
  async get_interventions({ commit, state }) {
    log.i("actions::get_interventions - In");
    const url = process.env.API_URL + "/interventions";
    return await this.$axios
      .$get(url)
      .then(response => {
        response.interventions.forEach(intervention => {
          intervention.dateCreation     = new Date(intervention.dateCreation)
          intervention.dateIntervention = new Date(intervention.dateIntervention)
        })
        commit("set_interventionCourrantes", response.interventions);
        log.i("actions::get_interventions - Done", {
          interventions: this.interventions
        });
        // this.interventions = response.interventions
      })
      .catch(error => {
        log.w("actions::Une erreur est survenue lors de la récupération des interventions", error);
        this.$store.commit("clean_interventions");
      });
  },
  async get_intervention({ commit, state }, idIntervention) {
    log.i("actions::get_intervention - In");
    const url = process.env.API_URL + "/interventions/" + idIntervention;
    return await this.$axios
      .$get(url)
      .then(response => {
        response.intervention.dateCreation     = new Date(response.intervention.dateCreation)
        response.intervention.dateIntervention = new Date(response.intervention.dateIntervention)
        commit("set_interventionCourrante", response.intervention);
        log.i("actions::get_intervention - done", { intervention: response.intervention });
        // this.interventions = response.interventions
      })
      .catch(error => {
        log.w("actions::get_intervention - erreur", error);
      });
  },
  async post_intervention({ commit, state }, intervention) {
    const url                        = process.env.API_URL + "/interventions";
          intervention.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$post(url, { intervention }).then(({ intervention }) => {
      log.i("actions::post_intervention - In", { intervention });
      commit('add_intervention', intervention)
      return intervention
    });
  },
  async put_intervention({ commit, state }, intervention) {
    log.i("actions::put_intervention - In", { intervention });
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
    log.i("actions::get_users - In");
    const url = process.env.API_URL + "/user/";
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_users", response.users);
        return { users: response.users }
      })
      .catch(error => {
        log.w("actions::get_users - erreur", error);
      });
  },
  async get_user({ commit,state }, ustid) {
    log.i("actions::get_user - In");
    const url = process.env.API_URL + "/user/" + ustid;
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_utilisateurSelectionne", response.user);
      })
      .catch(error => {
        log.w("actions::get_user - In", error);
      });
  },
  async put_user({ commit, state }, utilisateurSelectionne) {
    const url = process.env.API_URL + "/user/" + utilisateurSelectionne.id;
    log.i("actions::put_user - In", { url });
    var userIndex = state.users.findIndex(utilisateur => {
      return utilisateur.id == utilisateurSelectionne.id
    })
    return await this.$axios
      .$put(url, { utilisateurSelectionne })
      .then(async res => {
        const url = process.env.API_URL + "/user/" + res.user.id;
        log.d("actions::put_user - get updated user", { url });
        return this.$axios
          .$get(url)
          .then(response => {
            commit("put_user", {user: response.user, index: userIndex});
          })
      })
      .catch(error => {
        log.w("actions::put_user - erreur", { error });
      });
  },
  async logout({ commit }) {
    commit("set_utilisateurCourant", null)
  },
  async get_structures({commit}) {
    log.i("actions::get_structures - In");
    const url = process.env.API_URL + '/structures'
    return this.$axios.get(url).then(response => {
      commit("set_structures", response.data);
      log.i("actions::get_structures - done");
    }).catch(err => {
      log.w("actions::get_structures - error", { err });
    })
  },
  async get_structure({ commit,state }, idStructure) {
    log.i("actions::get_structure - In", { idStructure });
    const url = process.env.API_URL + "/structures/" + idStructure;
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_structureSelectionnee", response.structures);
        log.i("actions::get_structure - done");
      })
      .catch(error => {
        log.w("actions::get_structure - erreur", { error });
      });
  },
  async put_structure({ commit, state }, structureSelectionnee) {
    log.i("actions::put_structure - In", { structureSelectionnee });
    const url = process.env.API_URL + "/structures/" + structureSelectionnee.str_id;
    var structureIndex = state.structures.findIndex(structure=> {
      return structure.id == structureSelectionnee.id
    })
    return await this.$axios
      .$put(url, { structureSelectionnee })
      .then(async res => {
        const url = process.env.API_URL + "/structures/" + res.structures.str_id;
        return this.$axios
          .$get(url)
          .then(response => {
            commit("put_structure", {structure: response.structure, index: structureIndex});
            log.i("actions::put_structure - done");
          })
      })
      .catch(error => {
        log.w("actions::put_structure - error", { error });
      });
  },
  async post_structure({ commit, state }, structure) {
    const url  = process.env.API_URL + "/structures";
    log.i("actions::post_structure - In", { url });
    return await this.$axios.$post(url, { structure }).then(({ structure }) => {
      commit('add_structure', structure)
      log.i("actions::post_structure - done");
      return structure
    });
  },


/* #################################################################  */
/* #                 STRUCTURES DE L'UTILISATEUR                   # */
/* #################################################################  */

  async get_user_structures({commit},utiid) {
    log.i("actions::get_user_structure - In", { utiid });
    const url = process.env.API_URL + "/structures/user/" + utiid;

    return this.$axios.get(url).then(response => {
      commit("get_user_structures", response.data);
      log.i("actions::get_user_structures - done");
    }).catch(err => {
      log.w("actions::get_user_structures - error", { err });
    })
  },

  async post_user_structures({ commit, state }, mastructure) {
    const url                        = process.env.API_URL + "/structures/user";
    mastructure.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$post(url, { mastructure }).then(({ mastructure }) => {
      log.i("actions::post_user_structures - In", { mastructure });
      commit('post_user_structures', mastructure)
      return mastructure
    });
  },

  async post_del_user_structure({ commit, state }, mastructure) {
    const url                        = process.env.API_URL + "/structures/desactiveuser";
    mastructure.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$post(url, { mastructure }).then(({ mastructure }) => {
      log.i("actions::post_del_user_structure - In", { mastructure });
      commit('post_del_user_structure', mastructure)
      return mastructure
    });
  },

  async post_add_user_structure({ commit, state }, mastructure) {
    const url                        = process.env.API_URL + "/structures/activeuser";
    mastructure.utilisateurId = state.utilisateurCourant.id
    return await this.$axios.$post(url, { mastructure }).then(({ mastructure }) => {
      log.i("actions::post_add_user_structure - In", { mastructure });
      commit('post_add_user_structure', mastructure)
      return mastructure
    });
  },

  /* FIN DE LA PARTIE STRUCTURES DE L'UTILISATEUR */

  /* GESTION DES EVEMENTS */ 
  async get_evenements({commit}) {
    const url = process.env.API_URL + '/evenements'
    log.i("actions::get_evenements - In", { url });
    return this.$axios.get(url).then(response => {
      log.i("actions::get_evenements - done");
      commit("set_evenements", response.data);
    }).catch(err => {
      log.w("actions::get_evenements - error", { err });
    })
  },
  async get_evenement({ commit,state }, idEvenement) {
    log.i("actions::get_evenement - In", { idEvenement });
    const url = process.env.API_URL + "/evenements/" + idEvenement;
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_evenementSelectionnee", response.evenements);
        log.i("actions::get_evenement - done");
      })
      .catch(error => {
        log.w("actions::get_evenement - erreur", { error });
      });
  },  
  async put_evenement({ commit, state }, evenementSelectionnee) {
    log.i("actions::put_evenement - In", { evenementSelectionnee });
    const url = process.env.API_URL + "/evenements/" + evenementSelectionnee.eve_id;
    var evenementIndex = state.evenements.findIndex(evenement=> {
      return evenement.id == evenementSelectionnee.id
    })
    return await this.$axios
      .$put(url, { evenementSelectionnee })
      .then(async res => {
        const url = process.env.API_URL + "/evenements/" + res.evenements.str_id;
        return this.$axios
          .$get(url)
          .then(response => {
            commit("put_evenement", {evenement: response.evenement, index: evenementIndex});
            log.i("actions::put_evenement - done");
          })
      })
      .catch(error => {
        log.w("actions::put_evenement - error", { error });
      });
  },
  async post_evenement({ commit, state }, evenement) {
    const url  = process.env.API_URL + "/evenements";
    log.i("actions::post_evenement - In", { url });
    return await this.$axios.$post(url, { evenement }).then(({ evenement }) => {
      commit('add_evenement', evenement)
      log.i("actions::post_evenement - done");
      return evenement
    });
  },

  
  /* FIN DE LA GESTION DES EVENEMENTS*/

  async get_documents({commit}) {
    const url = process.env.API_URL + '/documents'
    log.i("actions::get_documents - In", { url });
    return this.$axios.get(url).then(response => {
      var documents = response.data
      documents.forEach(doc => {
        delete doc.doc_contenu
      })
      log.i("actions::get_documents - done");
      commit("set_documents", response.data);
    }).catch(err => {
      log.w("actions::get_documents - error", { err });
    })
  },
  login({ commit }, { mail, password }) {
    log.i('actions::login - In', mail)
    const url = process.env.API_URL + "/connexion/pwd-login"
    return this.$axios.$post(url, { mail, password })
        .then(res => {
            // Correction concernant la finalisation de la création du compte (Report de GC AAQ)
            //const user = res.user
            const { user, redirect, message } = res
            log.d('login - response from server', user)
            if(!user || !user.id) {
              log.w('login - authserver, user not found')
              throw new Error('Email ou mot de passe incorrect.')
            } else if (redirect) {
              log.i('login - Done but redirect', { user, redirect })
              this.$toast.info(message)
              commit("set_utilisateurCourant", user)
              return this.$router.push(redirect)
            } else {
              log.i('login - Done', { user })
              commit("set_utilisateurCourant", user)
              return this.$toast.success(`Bienvenue ${user.prenom}`)
            }
        })
        .catch(err => {
            log.w('login - error', err)
            const message = parseErrorMessage(get(err, 'response.data.message') || err.message)
            this.$toast.error(message)
            throw new Error(message)
        })
  },
  register({ commit }, params) {
      params.user.mail = formatEmail(params.user.mail)
      const { mail, password, confirm } = params.user
      log.i('actions::register - In', mail, password, confirm )
      let user = null
      let path = null

      return this.$axios.$post(`${process.env.API_URL}/connexion/create-account-pwd`, { password, mail, confirm })
          .then(apiRes => {
            user = apiRes.user
            if(apiRes && apiRes.confirmInscription) {
              log.d('actions::register - User not recorded with FC')
              path= '/connexion/inscription'
              commit("set_utilisateurCourant", user)
            } else {
              log.d('actions::register - User already use FC')
              path = '/login'
              this.$toast.info(`Un email de confirmation d'inscription vous a été envoyé. Veuillez cliquer sur le lien contenu dans ce mail.`)
            }
            return this.$router.push({ path })
          })
          .catch((err) => {
            log.w('actions::register', err)
            const message = err.message || parseErrorMessage(get(err, 'response.data.message'))
            this.$toast.error(message)
            throw new Error(message)
          })
  },
  forgot_password({ state }, { mail }) {
      log.i('actions::forgot_password - Init', { mail })
      return this.$axios.$post(`${process.env.API_URL}/connexion/forgot-password/${formatEmail(mail)}`)
        .then(res => {
          log.i('actions::forgot_password - Done', res)
        })
        .catch(err => {
          log.w('actions::forgot_password', err)
          const message = parseErrorMessage(get(err, 'response.data.message'))
          throw new Error(message)
        })
  },
  reset_password({ state }, { id, old, password, confirm }) {
    log.i('actions::reset_password - in ', { id, old, password, confirm })
    return this.$axios.$post(`${process.env.API_URL}/connexion/reset-password/`,{ id, old, password, confirm })
      .then(res => {
        log.i('actions::forgot_password - Done', res)
      })
      .catch(err => {
        log.w('actions::forgot_password', err)
        const message = parseErrorMessage(get(err, 'response.data.message'))
        throw new Error(message)
      })
  },
  set_state_element({ commit }, {key,value }) {
    log.i('actions::set_state_element - In',{key , value} )
    return commit('SET', { key, value })
  },
  async get_parametre({ commit,state }, codeParametre) {
    log.i("actions::get_parametre - In");
    const url = process.env.API_URL + "/parametres/" + codeParametre;
    return await this.$axios
      .$get(url)
      .then(response => {
        commit("set_parametreSelectionne", response.parametre);
      })
      .catch(error => {
        log.w("actions::get_parametre - In", error);
      });
  },
};

export const getters = {
  primaryColor: () => "#4546A1"
}
