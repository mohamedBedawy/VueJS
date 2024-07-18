<template lang="pug">
  div
    h2
      | gRPC Web with Vue 3

</template>

<script>
export default {
  name: `Greeting`,
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  created() {
  }
}

</script>

<style scoped>

</style>