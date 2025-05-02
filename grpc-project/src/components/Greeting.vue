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
    // sayHello(name) {
    //   const request = new HelloRequest();
    //   request.setName(name);
    //
    //   this.client.sayHello(request, {}, (err, response) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     alert(response.getMessage());
    //   });
    // }
  },
  created() {
  }
}

</script>

<style scoped>

</style>