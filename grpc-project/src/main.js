import App from './App.vue'
import vuetify from './plugins/vuetify'
import {createApp} from "vue"; // Import the plugin

import { GreeterClient } from './protos/greet_grpc_web_pb';


const app = createApp(App)

// app.config.globalProperties.$client = new GreeterClient('http://localhost:44307');
app.provide('client', new GreeterClient('https://localhost:44307'));

app.use(vuetify)

app.mount('#app')