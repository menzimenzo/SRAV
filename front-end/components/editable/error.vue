<template>
    <span :key="'error-' + tag"
        :data-test-error="'error-' + tag"
        class="text-danger">{{ error }}</span>
</template>

<script>
export default {
    props: {
        tag: {
            type: String,
            required: true
        },
        error: {
            type: String,
            required: true
        }
    }
}
</script>
