import Vue from 'vue'
import moment from 'moment'


Vue.filter('number', function(value) {
    return numeral(parseInt(value, 10)).format('0,0')
})

Vue.filter('capitalize', function(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : string
})

Vue.filter('uppercase', function(string) {
    return string ? string.toUpperCase() : string
})

Vue.filter('date', function(value) {
    if (!!value && moment(value).isValid()) {
        return moment(value).format('DD/MM/YYYY')
    } else {
        return '-'
    }
})

Vue.filter('timestamp', function(value) {
    if (!!value && moment(value).isValid()) {
        return moment(value).format('DD/MM/YYYY HH[h]mm')
    } else {
        return '-'
    }
})

Vue.filter('dateFromTimestamp', function(value) {
    if (moment(value).isValid()) {
        return moment(value).format('DD/MM/YYYY')
    } else {
        return '-'
    }
})
