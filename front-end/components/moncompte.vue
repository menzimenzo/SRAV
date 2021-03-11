<template>
  <div>
    <b-card class="mb-3">
      <b-form>
        <b-form-group label="Prénom :">
          <b-form-input type="text" v-model="user.prenom" disabled />
        </b-form-group>
        <b-form-group label="Nom :">
          <b-form-input type="text" v-model="user.nom" disabled />
        </b-form-group>
        <b-form-group
          id="emailInputGroup"
          label="Courriel :"
          label-for="emailInput"
          required
        >
          <b-form-input
            id="emailInput"
            type="email"
            v-model="user.mail"
            required
            name="mail"
            key="email-input"
            v-validate="{ required: true, email: true }"
            aria-describedby="emailFeedback"
            placeholder="Courriel"
          />
        </b-form-group>

        <b-form-group
          required
          id="structNationaleGroup"
          label="Structure nationale :"
          label-for="structNatSelect"
        >
          <!--Mantis 68055 : min_value: 1-->
          <b-form-select
            id="structNatSelect"
            v-model="user.structureId"
            v-validate="{ required: true, min_value: 1 }"
            name="struct"
            :state="validateState('struct')"
            aria-describedby="structFeedback"
            :disabled="!checkLegal"
          >
            <!--Mantis 68055 value = 0 -->
            <option value="0">Veuillez choisir votre structure...</option>
            <option
              v-for="structure in listeStructures"
              :key="structure.str_id"
              :value="structure.str_id"
            >
              {{ structure.str_libelle }}
            </option>
          </b-form-select>
          
        </b-form-group>
        <div v-if="user.structureLocale != ''" >
          <b-form-group
            id="structLocaleGroup"
            label="Structure locale :"
            required
            label-for="structLocaleInput"
            key="structurelocale"
          >
            <b-form-input
              v-validate="{ required: true }"
              name="structLoc"
              :state="validateState('structLoc')"
              aria-describedby="structLocFeedback"
              id="structLocaleInput"
              type="text"
              v-model="user.structureLocale"
              placeholder="Nom de la structure locale"
            />
            <b-form-invalid-feedback id="structLocFeedback">
              La structure locale est obligatoire.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="mb-3 text-right">
          <b-button
            @click="submit"
            variant="success"
            :disabled="
              errors.any() || (isLegalChecked == 'false' && !user.validated)
            "
            >{{ submitTxt }}</b-button
          >
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["user", "submitTxt"],
  methods: {
    submit: function () {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$emit("submit");
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
  },
  async mounted() {
    await this.$store.dispatch("get_structures");
  },
  computed: {
    ...mapState(["structures"]),
    listeStructures() {
      var liste = this.structures;
      if (this.user.mail.indexOf(".gouv.fr") != -1) {
        return liste;
      } else {
        
        liste = this.structures.filter((str) => {
          var isMatch = true;
          isMatch =
            isMatch &
            (String(str.str_libellecourt) != "DS")
          return isMatch;
        });
        return liste;
      }
    },
  },
};
</script>

<style>
</style>

