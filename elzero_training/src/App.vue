<template>
  <div id="app">
    <WelcomeMessage msg="Welcome Bedawy"/>
  </div>
</template>

<script>
import WelcomeMessage from "@/components/welcomeMessage.vue";

export default {
  name: 'App',
  components: {
      WelcomeMessage,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
