<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="6">
          <b-card title="Données d'accès">
              <b-alert :show="FCauthentified">
                <p>Si vous vous êtes déjà connecté via FranceConnect, vous pouvez désormais aussi vous connecter sans passer par FranceConnect.</p>
                <p>Vous devez en revanche impérativement utiliser <b>le même courriel</b> que celui renseigné lors de votre inscription initiale.</p>
                <p>Ce nouvel accès ne sera effectif que lorsque vous aurez cliqué sur le lien d'activation que vous recevrez à l'adresse courriel renseignée.</p> 
              </b-alert>
              <b-form>
                <b-form-group label="Courriel :" label-for="emailInput" required>
                    <b-form-input
                    id="emailInput"
                    type="email"
                    v-model="mail"
                    name="mail"
                    v-validate="{required: true, email: true}"
                    placeholder="Courriel"
                    :state="validateState('mail')"
                    />
                    <b-form-invalid-feedback>Le courriel est obligatoire et doit être valide.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Mot de passe :" label-for="pwdInput" required>
                    <b-form-input
                    id="pwdInput"
                    type="password"
                    v-model="password"
                    name="password"
                    ref="password"
                    v-validate="{required: true, min: 8}"
                    placeholder="Mot de passe"
                    :state="validateState('password')"
                    />
                    <b-form-invalid-feedback>{{ errors.first('password') }}</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Confirmation :" label-for="confirmInput" required>
                    <b-form-input
                    id="confirmInput"
                    type="password"
                    v-model="confirmation"
                    name="confirmation"
                    v-validate="'|required|confirmed:password'"
                    placeholder="Mot de passe"
                    :state="validateState('confirmation')"
                    />
                    <b-form-invalid-feedback>{{ errors.first('confirmation') }}</b-form-invalid-feedback>
                </b-form-group>
                <div class="mb-3 text-right">
                  <b-button
                    @click="register"
                    variant="success"
                    :disabled="errors.any()"
                  >Inscription</b-button>
                </div>
              </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { mapState } from "vuex"
import Vue from 'vue'

export default {
  data() {
    return {
      mail:'',
      password:'',
      confirmation:''
    };
  },
  computed: {
    FCauthentified() {
      return this.$route.params && this.$route.params.FCauthentified
    }
  },
  methods: {
    register: function() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          const user = {
            mail: this.mail,
            password: this.password,
            confirm: this.confirmation
          }
          return this.$store.dispatch('register', { user })
        } else {
          this.$toast.error('Veuillez vérifier la validité des champs.')
        }
      });
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
  },
}
</script>

<style>
</style>
