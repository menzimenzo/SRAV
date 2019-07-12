<template>
    <tr class="body-row" @click="rowClicked" data-test-row="editable">
        <td v-for="column in columns"
            :key="'body-col-' + column.title"
            class="text-center"
            :data-title="column.title">
            <div v-if="canEditColumn(column)">
                <div v-if="column.type === 'text'">
                    <input type="text"
                        v-model.trim="clonedItem[getPath(column.path)]"
                        v-validate="column.validation ? column.validation : ''"
                        :data-vv-name="getPath(column.path)"
                        :data-vv-as="column.title"
                        role="textbox"
                        class="form-control"
                        @change="has(column, 'inputCallback') ? column.inputCallback(clonedItem) : ''" />
                </div>
                <div v-else-if="column.type === 'number'">
                    <input type="number"
                        role="textbox"
                        class="form-control"
                        v-model.number="clonedItem[getPath(column.path)]"
                        v-validate="column.validation ? column.validation : ''"
                        :data-vv-name="getPath(column.path)"
                        :data-vv-as="column.title"
                        @change="has(column, 'inputCallback') ? column.inputCallback(clonedItem) : ''" />
                </div>
                <div v-else-if="column.type === 'checkbox'" class="checkbox">
                    <label>
                        <input type="checkbox"
                            role="checkbox"
                            v-model="clonedItem[getPath(column.path)]"
                            v-validate="column.validation ? column.validation : ''"
                            :data-vv-name="getPath(column.path)"
                            :data-vv-as="column.title"
                            @change="has(column, 'inputCallback') ? column.inputCallback(clonedItem) : ''" />
                    </label>
                </div>
                <div v-else-if="column.type === 'select'">
                    <select class="form-control"
                        v-model="clonedItem[getPath(column.path)]"
                        v-bind:key="column.id"
                        v-validate="column.validation ? column.validation : ''"
                        :data-vv-name="getPath(column.path)"
                        :data-vv-as="column.title"
                        role="listbox"
                        @change="setMe(column)" >
                        <option role="option"
                            v-for="option in optionsValues(column)"
                            :key="'option-' + has(option, 'value') ? option.value : option"
                            :value="has(option, 'value') ? option.value : option">
                            {{ has(option, 'lib') ? option.lib : option }}
                        </option>
                    </select>
                </div>
                <div v-else-if="column.type === 'date'">

                   <!-- <datepicker style="display: block;"
                        :data-vv-as="column.title"
                        :name="getPath(column.path)"
                        :placeholder="column.title"
                        class="form-control datepicker"
                        :aria-label="column.title"
                        role="textbox"
                        v-validate="column.validation ? column.validation : ''"
                        @input="has(column, 'inputCallback') ? column.inputCallback(clonedItem) : ''"
                        v-model="clonedItem[getPath(column.path)]"
                        format="dd/MM/yyyy"
                        :language="$options.fr">
                    </datepicker>-->
                </div>
                <template v-else-if="isSpecialField(column.type)">
                    <template v-if="fieldType(column.type) === '__slot' && can(column)">
                        <slot :name="fieldPath(column.type)"></slot>
                    </template>
                </template>
                <input-validation-errors
                    v-if="column.validation"
                    :name="getPath(column.path)"
                ></input-validation-errors>
            </div>
            <div v-else>
                <template v-if="has(column, 'path')">
                    <template v-if="column.type === 'checkbox'">
                        <span 
                            :class="['glyphicon', getObjectValue(item, getPath(column.path)) ? 'glyphicon-ok' : 'glyphicon-remove']"
                            :data-test-checked="getObjectValue(item, getPath(column.path)) ? true : false"
                            aria-hidden="true">
                        </span>
                    </template>
                    <template v-else>
                        <template v-if="getObjectValue(item, getPath(column.path)) !== undefined && column.filter">
                            <span v-html="$options.filters[column.filter](getObjectValue(item, getPath(column.path)))"></span>
                        </template>
                        <template v-else>
                            <span>{{ getObjectValue(item, getPath(column.path)) }}</span>
                        </template>
                        <template v-if="getObjectValue(item, getPath(column.path)) && column.suffix">{{ column.suffix }}</template>
                    </template>
                </template>
                <template v-else-if="has(column, 'callback')">
                    <template v-if="column.type === 'checkbox'">
                        <span :data-test-checked="column.callback(item)"
                            :class="['glyphicon', column.callback(item) ? 'glyphicon-ok' : 'glyphicon-remove']"
                            aria-hidden="true"></span>
                    </template>
                    <template v-else>
                        <template v-if="column.callback(item) && column.filter">
                            {{ column.callback(item) | dynamicFilter(column.filter) }}
                        </template>
                        <template v-else>{{ column.callback(item) }}</template>
                        <template v-if="column.callback(item) && column.suffix">{{ column.suffix }}</template>
                    </template>
                </template>
            </div>
        </td>
        <td class="actions text-center"
            aria-label="Actions"
            data-title="Actions">
            <div class="btn-group" role="group">
                <a class="btn-bg-primarycolor btn-rounded btn-shadow"
                    role="button"
                    aria-label="Enregistrer l'élément"
                    data-test-link="editable-save"
                    @click="validate"
                    title="Enregistrer">
                    <btnEnregistrer color="#fff"></btnEnregistrer>
                </a>
                <a class="btn-remove btn-rounded btn-shadow no-margin-left"
                    role="button"
                    aria-label="Annuler les modifications"
                    data-test-link="editable-cancel"
                    @click="$emit('clean')"
                    title="Annuler">
                    <btnAnnuler></btnAnnuler>
                </a>
            </div>
        </td>
    </tr>
</template>

<script>
import { fr } from 'vuejs-datepicker/dist/locale'


import _ from 'lodash'
import Vue from 'vue'
import table from '~/lib/mixins/table'

//import Datepicker from 'vuejs-datepicker'
import inputValidationErrors from './input-validation-errors'
import btnEnregistrer from './svg-enregistrer'
import btnAnnuler from './svg-annuler'

export default {
    $_veeValidate: {
        validator: 'new'
    },
    mixins: [table],
    props: {
        columns: {
            type: Array,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        newItem: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            required: true
        }
    },
    fr,
    data() {
        return {
            clonedItem: _.cloneDeep(this.item)
        }
    },
    components: {
        inputValidationErrors,
        btnEnregistrer,
        btnAnnuler
        //Datepicker
    },
    watch: {
        item(item) {
            this.clonedItem = _.cloneDeep(item)
            this.callInputsCallbacks(this.columns, this.clonedItem)
        }
    },
    methods: {
        validate(e) {
            e && e.stopImmediatePropagation && e.stopImmediatePropagation()
            return this.$validator.validate()
                .then(valid => {
                    if (!valid) return
                    this.$emit('save', {item: this.clonedItem, index: this.index})
                })
        },
        getPath(path) {
            return this.isSpecialField(path) ? this.fieldPath(path) : path
        },
        rowClicked(e) {
            e && e.stopImmediatePropagation && e.stopImmediatePropagation()
            !this.newItem && this.$parent.$emit('rowClicked', this.clonedItem)
        },
        canEditColumn(column) {
            const editable = this.item.options && this.item.options.editable || {}
            return this.newItem || this.has(column, 'type') && (editable && editable[column.path] || (editable[column.path] === undefined && column.editable))
        },
        can(column) {
            const action = column.path.split(':')[1]
            return this.item.options === undefined || this.item.options[action] === undefined || this.item.options[action]
        },
        setMe(column) {
            Vue.set(this.clonedItem, this.getPath(column.path), this.clonedItem[this.getPath(column.path)])
            this.has(column, 'inputCallback') ? column.inputCallback(this.clonedItem) : ''
        }
    }
}
</script>

<style lang="scss" scoped>
    tr.body-row {
        background-color:#FFF;
    }
    .btn-group .btn + .btn {
        margin-left: 0 !important;
    }

    @media screen and (min-width: 981px) and (max-width: 1425px) {
        .no-margin-left {
            margin-left: 0 !important;
        }
    }
    
    .vdp-datepicker {
        position: static;
        .vdp-datepicker__calendar {
            position: fixed;
            top: 50%;
            left: 5%;
            margin-top: -25%;
            width: 90%;
            z-index: 2000;
            outline: rgba(0, 0, 0, 0.5) solid 9999px;
        }
    }
</style>
