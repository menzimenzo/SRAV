<template>
    <div class="errors" v-if="first">
        <atom-error :tag="currentScope"
            :error="errorMessage">
        </atom-error>
    </div>
</template>

<script>
import atomError from './error'

export default {
    inject: ['$validator'],
    components: { atomError },
    props: {
        name: {
            type: String,
            required: true
        },
        scope: {
            type: String
        }
    },
    computed: {
        currentScope() {
            return this.scope ? `${this.scope}.${this.name}` : this.name
        },
        first() {
            return this.errors.first(this.currentScope)
        },
        errorMessage() {
            const error = getErrors(this.name).find(error => {
                return error.en === this.first
            })
            if (error) {
                return error.fr
            }
            return this.first
        }
    }
}

const getErrors = function(name) {
    return [{
        en: `The ${name} field is required.`,
        fr: `Le champ est obligatoire.`
    }, {
        en: `The ${name} field must be a valid email.`,
        fr: `Le champ doit être un courriel valide.`
    }, {
        en: `The ${name} field may only contain numeric characters.`,
        fr: `Le champ doit contenir uniquement des caractères numériques.`
    }, {
        en: `The ${name} field may only contain alphabetic characters as well as spaces.`,
        fr: `Le champ doit contenir uniquement des caractères alphabétiques ainsi que des espaces.`
    }, {
        en: `The ${name} field format is invalid.`,
        fr: 'Le champ doit être numérique et la décimale doit s’écrire avec un point et non une virgule.'
    }, {
        en: `Le champ BIC n'est pas valide (exemple de N° BIC valide: CCOPFRPP).`,
        fr: `Le champ BIC n'est pas valide (exemple de N° BIC valide: CCOPFRPP).`
    }, {
        en: `Le champ IBAN n'est pas valide (exemple de N° IBAN valide: FR7642559000052102312860353).`,
        fr: `Le champ IBAN n'est pas valide (exemple de N° IBAN valide: FR7642559000052102312860353).`
    }, {
        en: `The ${name} field may contain alpha-numeric characters as well as dashes and underscores.`,
        fr: `Le champ peut contenir des caractères alphanumériques ainsi que des tirets et des traits de soulignement.`
    }, {
        en: `The ${name} field must be an integer.`,
        fr: 'Le champ doit être numérique et potentiellement négatif.'
    }, {
        en: `The ${name} field must be numeric and may contain  decimal points.`,
        fr: 'Le champ doit être numérique et la décimale doit s’écrire avec un point et non une virgule.'
    }, {
        en: `The ${name} field must be numeric and may contain 3 decimal points.`,
        fr: 'Le champ doit être numérique et contenir 3 points décimaux.'
    }, {
        en: `The ${name} field may not be greater than 11 characters.`,
        fr: 'Le champ ne doit pas contenir plus de 11 caractères.'
    }, {
        en: `The ${name} field must be at least 8 characters.`,
        fr: 'Le champ doit contenir au moins 8 caractères.'
    }, {
        en: `The ${name} field may only contain alpha-numeric characters.`,
        fr: 'Le champ ne peut contenir que des caractères alphanumériques.'
    }, {
        en: `The ${name} field may only contain alphabetic characters.`,
        fr: 'Le champ ne peut contenir que des caractères alphabétiques.'
    }, {
        en: 'The field is required. You must declare the sports federations to your association in the administrative information of your association.',
        fr: 'Le champ est obligatoire. Vous devez déclarer les Fédérations sportives auxquelles votre association est affiliée dans les informations administratives de votre association.'
    }, {
        en: `The ${name} length must be 27.`,
        fr: 'Le champ doit contenir 27 caractères.'
    }]
}
</script>
