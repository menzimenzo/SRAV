<template>
    <div class="editable">
        <Clip-Loader v-if="loading" :loading="loading" :color="primaryColor" />
        <div  v-if="!loading && data && data.length === 0 && noDataLabel" class="alert alert-info" role="alert">
            <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
            {{ noDataLabel }}
        </div>
        <div :style="`max-height: ${tableMaxHeight}; overflow-y: auto;`"> 
            <table v-if="!loading && data && data.length > 0 || newItem"
                class="table table-hover">
                <thead>
                    <tr>
                        <th v-for="column in columns"
                            :key="'header-col-' + column.title"
                            @click="toggleSort(column)"
                            :class="{ 'cursor-pointer': column.sortable, 'text-center': true }">
                            {{ column.title }}
                            <span v-if="sortField && column.path == sortField.key"
                                aria-hidden="true"
                                :class="{
                                    'glyphicon': true,
                                    'glyphicon-triangle-bottom': sortField.order == 'desc',
                                    'glyphicon-triangle-top': sortField.order == 'asc'
                                }">
                            </span>
                        </th>
                        <th key="header-col-action" class="text-center" v-if="creableComputed || editable || removableComputed">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, i) in sortedData">
                        <reading-row
                            v-show="editingIndex !== i"
                            :scope="scope"
                            :key="'row-' + i"
                            :ref="'row' + i"
                            :item="item"
                            :columns="columns"
                            :editable="item.options && typeof item.options.editable === 'boolean' ? item.options.editable : editable"
                            :creable="creableComputed"
                            :removable="item.options && typeof item.options.removable === 'boolean' ? item.options.removable : removableComputed"
                            :class="rowClassValue(item)"
                            :editByLine="editByLine"
                            :index="i"
                            :data-test-key="getObjectValue(item, trackBy)"
                            data-test-editing="false"
                            @edit="edit"
                            @remove="confirmRemove"
                            >
                            <template v-for="column in columns">
                                <template v-if="fieldType(column.path) === '__slot'" :slot="fieldPath(column.path)">
                                    <slot :name="fieldPath(column.path)" :data="item" :onEdit="false"></slot>
                                </template>
                            </template>
                        </reading-row>
                        <editing-row v-if="editingIndex === i"
                            :key="'editing-row-' + i"
                            :ref="'row' + i"
                            :item="item"
                            :columns="columns"
                            :class="rowClassValue(item)"
                            :index="i"
                            :data-test-key="getObjectValue(item, trackBy)"
                            data-test-editing="true"
                            @save="save"
                            @clean="clean"
                            >
                            <template v-for="column in columns">
                                <template v-if="fieldType(column.path) === '__slot'" :slot="fieldPath(column.path)">
                                    <slot :name="fieldPath(column.path)" :data="item" :onEdit="true"></slot>
                                </template>
                            </template>
                        </editing-row>
                    </template>
                    <editing-row  v-if="newItem"
                        ref="newItem"
                        :item="newItem"
                        :columns="columns"
                        :class="rowClassValue(newItem)"
                        :editByLine="editByLine"
                        :newItem="true"
                        :index="-1"
                        :removable="false"
                        @save="save"
                        @clean="clean"
                        data-test-key="newItem"
                        data-test-editing="true"
                        >
                        <template v-for="column in columns">
                            <template v-if="fieldType(column.type) === '__slot'" :slot="fieldPath(column.type)">
                                <slot :name="fieldPath(column.type)" :data="newItem" :onEdit="true"></slot>
                            </template>
                        </template>
                    </editing-row>
                </tbody>
            </table>
        </div>
        <div v-if="creableComputed && !loading" 
            class="text-center">
            <a type="button"
                role="button"
                :class="['btn-add', !createLabel ? 'btn-bg-primarycolor' : '', !createLabel ? 'btn-shadow' : '']"
                @click="add()"
                :aria-label="createLabel"
                data-test-link="editable-add">
                <div class="btn-label" v-if="createLabel">{{ createLabel }}</div>
                <btn-ajouter v-else></btn-ajouter>
            </a>
        </div>
    </div>
</template>

<script>


import { mapGetters } from 'vuex'
import _ from 'lodash'
import table from '~/lib/mixins/table'

import editingRow from './editing-row'
import readingRow from './row'
import btnAjouter from './svg-ajouter'
import ClipLoader  from '~/node_modules/vue-spinner/src/ClipLoader.vue' 

export default {
    inject: ['$validator'],
    mixins: [table],
    props: {
        noDataLabel: {
            type: String,
            default: 'Aucun résultat trouvé.'
        },
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array
        },
        rowClass: {
            type: [String, Function],
            default: ''
        },
        editByLine: {
            type: Boolean,
            default: false
        },
        creable: {},
        editable: {
            type: Boolean,
            required: true
        },
        removable: {},
        loading: {
            type: Boolean,
            default: false
        },
        trackBy: {
            type: String,
            default: 'id'
        },
        createLabel: {
            type: String
        },
        tableMaxHeight: {
            type: String,
            default: '450px'
        },
        confirmRemoveTitle: {
            type: String,
            default: 'Confirmer la suppression'
        },
        confirmRemoveText: {
            type: String,
            default: 'Êtes-vous sur de vouloir supprimer cet élément ?'
        },
        defaultSortField: {
            type: Object
        },
        scope: {
            type: String
        }
    },
    components: {
        readingRow, editingRow,
        btnAjouter,
        ClipLoader
    },
    computed: {
        ...mapGetters(['primaryColor']),
        creableComputed() {
            return this.creable !== undefined ? this.creable : this.editable
        },
        removableComputed() {
            return this.removable !== undefined ? this.removable : this.editable
        },
        sortedData() {
            if (!this.sortField) {
                return this.data
            }
            const sortedData = JSON.parse(JSON.stringify(this.data))
            sortedData.sort((el1, el2) => {
                if (this.sortField.order == 'desc') {
                    [el1,el2] = [el2,el1]
                }
                if (el1[this.sortField.key] < el2[this.sortField.key]) {
                    return -1
                } else if (el1[this.sortField.key] > el2[this.sortField.key]) {
                    return 1
                }
                return 0
            })
            return sortedData
        }
    },
    data() {
        return {
            sortField: this.defaultSortField,
            editingIndex: null,
            newItem: null
        }
    },
    methods: {
        toggleSort(column){
            if (!column.sortable) {
                return
            }

            if (this.sortField && this.sortField.key == column.path && this.sortField.order == 'desc') {
                this.sortField = null
            } else if (this.sortField && this.sortField.key == column.path && this.sortField.order == 'asc') {
                this.sortField.order = 'desc'
            } else {
                this.sortField = { key: column.path, order: 'asc' }
            }

        },
        rowClassValue(item) {
            if (_.isFunction(this.rowClass)) {
                return this.rowClass(item)
            }
            return this.rowClass
        },
        confirmRemove(item) {
            this.$modal.show('dialog', {
                title: this.confirmRemoveTitle,
                text: this.confirmRemoveText,
                buttons: [
                    {
                        title: '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp; Oui, supprimer cet élément',
                        handler: () => {
                            this.$emit('remove', item)
                            this.$modal.hide('dialog')
                        }
                    },
                    { title: '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp; Annuler' }
                ]
            })
        },
        clean() {
            log.i('clean')
            this.editingIndex = null
            this.newItem = null
            // this.$refs.newItem && this.$refs.newItem.close()
        },
        add() {
            log.i('add')
            const paths = _.filter(_.map(this.columns, 'path'), path => !this.isSpecialField(path))
            if (this.editByLine) {
                this.newItem = _.zipObjectDeep(paths, [])
                this.editingIndex = -1
            } else {
                this.$emit('add', {})
            }
        },
        save({ index, item }) {
            log.i('save')
            const event = index === -1 ? 'create' : 'update'
            if (event === 'create') {
                this.$emit(event, item)
                this.newItem = null
            }
            if (event === 'update') {
                this.$emit(event, { item, index })
                this.editingIndex = null
            }
        },
        edit({ index }) {
            log.i('edit')
            if (this.editByLine) {
                this.editingIndex = index
                this.newItem = null
            } else {
                this.$emit('edit', this.data[index])
            }
        }
    }
}
</script>

<style lang="scss">
@import '~assets/css/_variable.scss';

.editable {
    position: relative;
    margin-bottom: 5px;
    display: block;
    table {
        margin-bottom: 0;
    }
    .btn-add {
        margin-top: 15px;
        margin-bottom: 15px;
        .btn-label {
            background-color: $primary-color;
            color: #FFF;
            line-height: 32px;
            padding: 5px;
            border-radius: 30px;
            margin: 0 auto;
            width: 200px;
        }
        svg {
            border-radius: 50px;
            background-color: $primary-color;
        }
    }
}
@media
only screen and (max-width: 980px),
(min-device-width: 768px) and (max-device-width: 1024px)  {
    .editable {
        td:before { content: attr(data-title); }
        table,
        thead,
        tbody,
        th,
        td,
        tr {
            display: block;
        }

        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }
        tr {
            border: 1px solid #ccc;
            margin-bottom: 10px;
        }
        td {
            position: relative;
            // border: 0px solid transparent;
            padding-left: 50% !important;
            // white-space: normal;
            text-align:left;
            min-height:40px;
        }
        td:before {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 45%;
            padding: 0 15px 0 15px;
            height:100%;
            line-height: 3rem;
            white-space: nowrap;
            text-overflow: ellipsis !important;
            overflow:hidden !important;
            text-align:right;
            font-weight: bold;
            padding:2px;
        }
    }
}
</style>