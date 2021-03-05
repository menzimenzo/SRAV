<template>
    <b-card class="mb-3">
      <b-form>
        <b-form-group label="Courriel :" label-for="emailInput" required>
          <b-form-input
            id="emailInput"
            type="email"
            v-model="mail"
            name="mail"
            v-validate="{required: true, email: true}"
            aria-describedby="emailFeedback"
            placeholder="Courriel"
            :state="validateState('mail')"
          />
          <b-form-invalid-feedback>{{ errors.first('mail') }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Mot de passe :" label-for="pwdInput" required>
          <b-form-input
            id="pwdInput"
            type="password"
            v-model="password"
            name="password"
            v-validate="{required: true, min:8}"
            aria-describedby="pwdFeedback"
            placeholder="Mot de passe"
            :state="validateState('password')"
          />
          <b-form-invalid-feedback>{{ errors.first('password') }}</b-form-invalid-feedback>
        </b-form-group>
        <div class="mb-3 text-right">
          <b-button
            @click="submit"
            variant="success"
            :disabled="errors.any()"
          >Connexion</b-button>
        </div>
      </b-form>
      <b-row align-h="center" class="text-center">
          <b-col cols="6"> 
            <nuxt-link to="/">
                Mot de passe oublié
            </nuxt-link>
          </b-col>
          <b-col cols="6"> 
            <nuxt-link to="/register">
                Je n'ai pas encore de compte
            </nuxt-link>
          </b-col>
      </b-row>
    </b-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
      return {
          mail: '',
          password: ''
      }
  },
  methods: {
    submit: function() {
      return this.$validator.validateAll().then(isValid => {
        if (isValid) {
          return this.$emit("submit", { email: this.mail, password: this.password});
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
    }
  }
};
</script>

<style>
</style>

