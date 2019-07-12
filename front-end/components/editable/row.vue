<template>
    <tr class="body-row" @click="rowClicked" data-test-row="editable">
        <td v-for="column in columns"
            :key="'body-col-' + column.title"
            class="text-center"
            :data-title="column.title">
            <template v-if="isSpecialField(column.path)">
                <template v-if="fieldType(column.path) === '__slot' && can(column)">
                    <slot :name="fieldPath(column.path)"></slot>
                </template>
            </template>
            <template v-else>
                <div>
                    <template v-if="has(column, 'path')">
                        <input v-show="false" v-model="item[getPath(column.path)]"
                            v-validate="(editableColumn(column) && column.validation) ? column.validation : ''"
                            :data-vv-scope="scope"
                            :data-vv-name="getPath(column.path) + '_' + index"
                            :data-vv-as="column.title"
                            :data-test-checked="getObjectValue(item, getPath(column.path)) ? true : false"
                        />
                        <template v-if="column.type === 'checkbox'">
                            <span 
                                :class="['glyphicon', getObjectValue(item, getPath(column.path)) ? 'glyphicon-ok' : 'glyphicon-remove']"
                                aria-hidden="true">
                            </span>
                        </template>
                        <template v-else>
                            <template>
                                <span v-html="getObjectValue(item, getPath(column.path)) !== undefined && column.filter ? $options.filters[column.filter](getObjectValue(item, getPath(column.path))) : getObjectValue(item, getPath(column.path))"
                                ></span>
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
                    <input-validation-errors
                        v-if="column.validation"
                        :name="getPath(column.path) + '_' + index"
                        :scope="scope"
                    ></input-validation-errors>
                </div>
            </template>
        </td>
        <td class="actions text-center"
            aria-label="Actions"
            data-title="Actions">
            <div class="btn-group" role="group"
                v-if="creable || editable || removable">
                <a class="btn-editer btn-rounded btn-shadow"
                    v-if="editable && isFieldsEditable"
                    role="button"
                    aria-label="Modifier l'élément"
                    data-test-link="editable-edit"
                    @click="edit"
                    title="Modifier">
                    <btnEditer color="#fff"></btnEditer>
                </a>
                <a class="btn-remove btn-rounded btn-shadow no-margin-left"
                    v-if="removable"
                    role="button"
                    aria-label="Supprimer cet élément"
                    @click="remove"
                    title="Supprimer"
                    data-test-link="editable-delete">
                    <btnSupprimer></btnSupprimer>
                </a>
            </div>
        </td>
    </tr>
</template>

<script>


import _ from 'lodash'
import Vue from 'vue'
import table from '~/lib/mixins/table'

import inputValidationErrors from './input-validation-errors'
import btnSupprimer from './svg-supprimer'
import btnEditer from './svg-editer'

export default {
    inject: ['$validator'],
    mixins: [table],
    props: {
        scope: {
            type: String
        },
        columns: {
            type: Array,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        editByLine: {
            type: Boolean,
            required: true
        },
        newItem: {
            type: Boolean,
            default: false
        },
        creable: {
            type: Boolean,
            required: true
        },
        editable: {
            type: Boolean,
            required: true
        },
        removable: {
            type: Boolean,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    components: {
        inputValidationErrors,
        btnSupprimer,
        btnEditer
    },
    computed: {
        editingScope() {
            return this.scope + '-' + this.index
        },
        isFieldsEditable() {
            if (!this.editByLine) {
                return true
            }
            return _.includes(_.uniq(_.map(this.columns, 'editable')), true)
        }
    },
    methods: {
        remove(e) {
            e && e.stopImmediatePropagation && e.stopImmediatePropagation()
            this.$emit('remove', this.item)
        },
        edit(e) {
            e && e.stopImmediatePropagation && e.stopImmediatePropagation()
            this.$emit('edit', { index: this.index, item: this.item })
        },
        getPath(path) {
            return this.isSpecialField(path) ? this.fieldPath(path) : path
        },
        rowClicked(e) {
            e && e.stopImmediatePropagation && e.stopImmediatePropagation()
            !this.newItem && this.$parent.$emit('rowClicked', this.item)
        },
        editableColumn(column) {
            const editable = this.item.options && this.item.options.editable || {}
            return editable && editable[column.path] || (editable[column.path] === undefined && column.editable)
        },
        can(column) {
            const action = column.path.split(':')[1]
            return this.item.options === undefined || this.item.options[action] === undefined || this.item.options[action]
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
</style>
