<template>
  <div>
    <Header/>
    <nuxt/>
    <Footer/>
  </div>
</template>

<script>
import Header from '~/components/header.vue'
import Footer from '~/components/footer.vue'
export default {
  components: {
    Header, Footer
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
</style>

<style lang="css">
@import 'assets/css/main.css';
</style>
