<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="6">
          <b-card title="Réinitialisation du mot de passe">
              <b-form>
                <b-form-group label="Nouveau mot de passe :" label-for="pwdInput" required>
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
                    @click="resetPassword"
                    variant="success"
                    :disabled="errors.any()"
                  >Validation</b-button>
                </div>
              </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import logger from '~/plugins/logger'
const log = logger('lca:pages:reset')

export default {
  data() {
    return {
      password:'',
      confirmation:'',
      id: null,
      oldPwd: null
    };
  },
  mounted() {
    if (this.$Countly && this.$Countly.track_pageview) {
        this.$Countly.track_pageview('/mot-de-passe-oublie/reset')
    }
    this.oldPwd = this.$route.query.old
    this.id = this.$route.query.key
  },
  methods: {
    resetPassword: function() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          const params = {
            id: this.id,
            old: this.oldPwd,
            password: this.password,
            confirm: this.confirmation
          }
          return this.$store.dispatch('reset_password', params)
            .then(() => {
                log.d('reset_password  - Redirect to /login')
                this.$router.push('/login')
                this.$toast.success('Vous pouvez à présent vous connecter avec votre nouveau mot de passe.')
                log.i('reset_password  - Done')
            })
            .catch((e) => {
                log.w('reset_password - Failed', e.stack)
                this.$toast.error(e.message || 'Une erreur est survenue lors de la mise à jour de vos informations. Veuillez contacter l\'administrateur.')
            })
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
