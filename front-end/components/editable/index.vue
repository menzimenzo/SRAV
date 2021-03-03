<template>
    <div class="editable">
        <Clip-Loader v-if="loading" :loading="loading" :color="primaryColor" />
        <div  v-if="!loading && data && data.length === 0 && noDataLabel" class="alert alert-info" role="alert">
            {{ noDataLabel }}
        </div>
        <div :style="!pagination ? {maxHeight: tableMaxHeight, overflowY: 'auto'} : {}">
            <table v-if="!loading && data && data.length > 0 || newItem" class="table table-hover">
                <thead>
                    <tr>
                        <th v-for="column in columns"
                            :key="'header-col-' + column.title"
                            @click="toggleSort(column)"
                            :class="{ 'cursor-pointer': column.sortable, 'text-center': true }">
                            <slot :name="'header-' + column.path">
                                {{ column.title }}
                            </slot>
                            <span v-if="sortField && column.path == sortField.key"
                                aria-hidden="true"
                                :class="{
                                    'glyphicon': true,
                                    'glyphicon-triangle-bottom': sortField.order == 'desc',
                                    'glyphicon-triangle-top': sortField.order == 'asc'
                                }" />
                        </th>
                        <th v-if="creableComputed || editable || removableComputed" key="header-col-action" class="text-center">
                        Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, i) in pagination ? paginationData : sortedData">
                        <reading-row
                            v-show="editingIndex !== i"
                            :scope="scope"
                            :key="'row-' + i"
                            :ref="'row' + i"
                            :item="item"
                            :columns="columns"
                            :editable="item.options && typeof item.options.editable === 'boolean' ? item.options.editable : editable"
                            :creable="creableComputed"
                            :removable="isItemRemovable(item)"
                            :class="rowClassValue(item)"
                            :editByLine="editByLine"
                            :index="i"
                            :data-test-key="getObjectValue(item, trackBy)"
                            data-test-editing="false"
                            @edit="edit"
                            @remove="confirmRemove">
                            <template v-for="column in columns">
                                <template v-if="fieldType(column.path) === '__slot'" :slot="fieldPath(column.path)">
                                    <slot :name="fieldPath(column.path)" :data="item" :onEdit="false" />
                                </template>
                            </template>
                        </reading-row>
                        <editing-row 
                            v-if="editingIndex === i"
                            :key="'editing-row-' + i"
                            :ref="'row' + i"
                            :item="item"
                            :columns="columns"
                            :class="rowClassValue(item)"
                            :index="i"
                            :data-test-key="getObjectValue(item, trackBy)"
                            data-test-editing="true"
                            @save="save"
                            @clean="clean">
                            <template v-for="column in columns">
                                <template v-if="fieldType(column.path) === '__slot'" :slot="fieldPath(column.path)">
                                    <slot :name="fieldPath(column.path)" :data="item" :onEdit="true" />
                                </template>
                            </template>
                        </editing-row>
                    </template>
                    <editing-row  
                        v-if="newItem"
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
                        data-test-editing="true">
                        <template v-for="column in columns">
                            <template v-if="fieldType(column.type) === '__slot'" :slot="fieldPath(column.type)">
                                <slot :name="fieldPath(column.type)" :data="newItem" :onEdit="true" />
                            </template>
                        </template>
                    </editing-row>
                </tbody>
                <tfoot class="table-footer" v-if="pagination">
                    <tr>
                        <td :colspan="columns.length">
                            <ul class="pagination"  v-if="pages.length > 1">
                                <li class="page-item" :class="{disabled: selectedPage == 1}">
                                    <a class="page-link" @click.prevent="setPaginationData(selectedPage - 1)">
                                    Précédent
                                    </a>
                                </li>
                                <li v-for="i in pages" :key="i" class="page-item page-number"
                                    @click.prevent="setPaginationData(i)">
                                    <a class="page-link" :class="{ highlight: i == selectedPage }">{{ i }}</a>
                                </li>
                                <li class="page-item" :class="{disabled: selectedPage == pages.le}">
                                    <a class="page-link" @click.prevent="setPaginationData(selectedPage + 1)">
                                    Suivant
                                    </a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <div v-if="sortedData.length && sortedData.length > minEntries" class="select-custom col-3 pagination-entries">
                            <span>
                                Nombre d'entrées affichées:
                            </span>
                            <select 
                                class="form-control"
                                v-model="paginationEntries"
                                @change="setPaginationData(1)">
                                <option selected :value="minEntries">{{ minEntries }}</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option data-pagination="all" :value="-1">Tout</option>
                            </select>
                        </div> 
                    </tr>
                </tfoot>
            </table>
        </div>
        <div v-if="creableComputed && !loading" 
            class="text-center">
            <a 
                type="button"
                role="button"
                :class="['btn-add', !createLabel ? 'btn-bg-primarycolor' : '', !createLabel ? 'btn-shadow' : '']"
                @click="add()"
                :aria-label="createLabel"
                data-test-link="editable-add">
                <div class="btn-label" v-if="createLabel">{{ createLabel }}</div>
                <btn-ajouter v-else />
            </a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import table from '~/lib/mixins/table'

const props = {}
const computed = {}

if (process.env.enable_pagination == 'true') {
    props.pagination = {
        type: Boolean,
        default: true
    }
} else {
    computed.pagination = () => true
}

export default {
    inject: ['$validator'],
    components: {
        editingRow: () => import('./editing-row'),
        readingRow: () => import('./row'),
        btnAjouter: () => import('./svg-ajouter'),
        ClipLoader: () => import('~/node_modules/vue-spinner/src/ClipLoader.vue')
    },
    mixins: [table],
    props: {
        ...props,
        noDataLabel: {
            type: String,
            default: 'Aucun résultat trouvé.'
        },
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            default: () => ([])
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
            type: String,
            default: ''
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
            default: 'Êtes-vous sûr(e) de vouloir supprimer cet élément ?'
        },
        defaultSortField: {
            type: Object,
            default: () => ({})
        },
        scope: {
            type: String,
            default: ''
        },
        defaultEditingIndex: {
            type: Number,
            default: null
        },
        minEntries: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            sortField: this.defaultSortField,
            editingIndex: this.defaultEditingIndex,
            newItem: null,
            selectedPage: 1,
            paginationEntries: this.minEntries
        }
    },
    computed: {
        ...computed,
        ...mapGetters(['primaryColor']),
        creableComputed() {
            return this.creable !== undefined ? this.creable : this.editable
        },
        removableComputed() {
            return this.removable !== undefined ? this.removable : this.editable
        },
        sortedData() {
            if (!this.sortField) {
                return this.data || []
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
        },
        maxPage() {
            return (!this.data || this.data.length === 0 || this.paginationEntries === -1) ? 1 : Math.trunc((this.data.length - 1) / (this.paginationEntries)) + 1
        },
        pages() {
            let pages
            if (this.maxPage > 5) {
                pages =  _.uniq([1, 2, 3, this.selectedPage - 1, this.selectedPage, this.selectedPage + 1, this.maxPage - 2, this.maxPage - 1, this.maxPage]).filter(p => p > 0 && p <= this.maxPage)
                pages.sort((a, b) => a - b)
            } else {
                pages =  _.range(1, this.maxPage + 1)
            }
            return pages
        },
        paginationData() {
            if (this.paginationEntries === -1) {
                return this.sortedData
            }
            const begin = this.paginationEntries * (this.selectedPage - 1)
            const end = begin + this.paginationEntries
            if( end > this.sortedData.length ) {
                return this.sortedData.slice(begin)
            }
            return this.sortedData.slice( begin, end )
        }
    },
    watch: {
        maxPage() {
            this.selectedPage = 1
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
        isItemRemovable(item) { 
            if (item.options && typeof item.options.removable === 'boolean') {
                return item.options.removable
            }  else if (typeof item.removable === 'boolean') {
                return item.removable
            } else {
                return this.removableComputed 
            }
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
            this.editingIndex = null
            this.newItem = null
            // this.$refs.newItem && this.$refs.newItem.close()
        },
        add() {
            const paths = _.filter(_.map(this.columns, 'path'), path => !this.isSpecialField(path))
            if (this.editByLine) {
                this.newItem = _.zipObjectDeep(paths, [])
                this.editingIndex = -1
            } else {
                this.$emit('add', {})
            }
        },
        save({ index, item }) {
            const event = index === -1 ? 'create' : 'update'
            if (event === 'create') {
                this.$emit(event, item)
                this.newItem = null
            }
            if (event === 'update') {
                const globalIndex = (this.paginationEntries * (this.selectedPage - 1)) + index
                this.$emit(event, { item, index: globalIndex })
                this.editingIndex = null
            }
        },
        edit({ index }) {
            if (this.editByLine) {
                this.editingIndex = index
                this.newItem = null
            } else {
                const globalIndex = (this.paginationEntries * (this.selectedPage - 1)) + index
                this.$emit('edit', this.data[globalIndex])
            }
        },
        setPaginationData(page) {
            if(page >= 1 && page <= this.maxPage) {
                this.selectedPage = page
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
        tfoot {  
            .pagination {
                cursor: pointer;
                display: flex;
                margin-left: 10px;
            }
        .select-custom {
            position: absolute;
            bottom: 15px;
            right: 30px;
            width: 300px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .positionbottom {
                bottom: 0;
                color: red;
            }
            select {
                width: 70px;
                }
            span {
                font-size: 14px;
                font-weight: 600;
                }
            }
        }
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
    .highlight {
        color: white;
        background-color: $primary-color;
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
