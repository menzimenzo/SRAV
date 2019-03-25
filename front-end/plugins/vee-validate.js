import Vue from 'vue'

import VeeValidate, { Validator } from 'vee-validate'

import fr from 'vee-validate/dist/locale/fr'

// Install the Plugin and set the locale.
Vue.use(VeeValidate, {
    inject: true,
    // Important to name this something other than 'fields'
    fieldsBagName: 'veeFields'
})

// Add locale helper.
Validator.localize('fr', fr)
