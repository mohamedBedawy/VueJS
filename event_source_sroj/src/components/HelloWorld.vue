<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Event Source Training </h3>
    <h2 v-if="reportError"></h2>
    <ul v-for="item in messagesData" :key="item.timestamp">
      <li>{{item}}</li>
    </ul>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      message: null,
      eventSource: null,
      messagesData: [],
      reportError: ''
    }
    },
  mounted() {
    // this.startEventSource();
  },
  methods: {
    GetEventSourceTraining() {
      if(typeof(EventSource) !== "undefined") {
        var source = new EventSource("https://localhost:44370/api/Sse/stream");
        source.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('EventSource parsed data',data);
          this.messagesData.push(data.message);
          console.log('messagesData data',this.messagesData);

        };
        source.onerror = () => {
          debugger
          console.error('EventSource failed.');
        };
      } else {
        this.reportError ="Sorry, your browser does not support server-sent events...";
      }
    },
    // startEventSource() {
    //   debugger
    //   this.eventSource = new EventSource("https://localhost:44370/api/Sse/stream");
    //
    //   this.eventSource.onmessage = (event) => {
    //     this.message = event.data;
    //   };
    //
    //   this.eventSource.onerror = (error) => {
    //     console.error('EventSource failed:', error);
    //     this.closeEventSource();
    //   };
    // },
    // closeEventSource() {
    //   if (this.eventSource) {
    //     this.eventSource.close();
    //     this.eventSource = null;
    //   }
    // },
  },
  created() {
    this.GetEventSourceTraining();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
