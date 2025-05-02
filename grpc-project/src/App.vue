<template>
  <div id="app">
    <h1>gRPC-Web Example</h1>
    <input v-model="name" placeholder="Enter your name" />
    <button @click="sendRequest()">Send</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { HelloRequest } from './protos/greet_pb';
import { useClient } from './useClient';

const name = ref('');
const client = useClient();

const sendRequest = () => {
  const request = new HelloRequest();
  request.setName(name.value);

  client.sayHello(request, {}, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    alert(response.getMessage());
  });
};
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
