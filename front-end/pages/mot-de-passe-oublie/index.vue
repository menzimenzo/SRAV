<template>
    <b-container>
      <b-row align-h="center">
        <b-col cols="6">
          <b-card title="Mot de passe oublié">
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
                <div class="mb-3 text-right">
                  <b-button
                    @click="forgot_password"
                    variant="success"
                    :disabled="errors.any()"
                  >Réinitialiser</b-button>
                </div>
              </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import logger from '~/plugins/logger'
const log = logger('lca:pages:mdp')

export default {
    data() {
        return {
            loading: false,
            mail: ''
        }
    },
    methods: {
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
        forgot_password() {
            log.i('forgot_password  - IN')
            this.$validator.validateAll().then(isValid => {
                if (!isValid) {
                    log.i('forgot_password  - Validation failed')
                    return
                }
                log.d('forgot_password  - Validation done')
                this.loading = true
                return this.$store.dispatch('forgot_password', { mail: this.mail })
                    .then(() => {
                        log.d('forgot_password  - Redirect to /login')
                        this.$router.push('/login')
                        this.$toast.success('Un email vous a été envoyé pour pouvoir réinitialiser votre mot de passe.')
                        log.i('forgot_password  - Done')
                    })
                    .catch((e) => {
                        log.w('forgot_password - Failed', e.stack)
                        this.$toast.error(e.message || 'Une erreur est survenue lors de l\'envoi du mail. Veuillez contacter l\'administrateur.')
                    })
                    .finally(() => {
                        this.loading = false
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
