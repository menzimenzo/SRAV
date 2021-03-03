import _ from 'lodash'

export default {
    methods: {
        has(object, path) {
            return _.has(object, path)
        },
        getObjectValue(item, path) {
            return _.get(item, path)
        },
        setObjectValue(item, path, value) {
            return _.set(item, path, value)
        },
        optionsValues(column) {
            if (_.isFunction(column.options)) {
                return column.options(this.clonedItem)
            }
            return column.options
        },
        isSpecialField(fieldName) {
            return fieldName ? fieldName.slice(0, 2) === '__' : false
        },
        fieldType(string) {
            return string ? string.split(':')[0] : ''
        },
        fieldPath(string) {
            return string ? string.split(':')[1] : ''
        },
        callInputsCallbacks(columns, item) {
            _.each(columns, column => {
                if (_.isArray(column)) {
                    _.each(column, col => {
                        if (_.has(col, 'inputCallback')) {
                            col.inputCallback(item)
                        }
                    })
                } else if (_.has(column, 'inputCallback')) {
                    column.inputCallback(item)
                } else if (_.has(column, 'fields')) {
                    _.each(column.fields, col => {
                        if (_.has(col, 'inputCallback')) {
                            col.inputCallback(item)
                        }
                    })
                }
            })
        }
    }
}
