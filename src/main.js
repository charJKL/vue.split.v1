import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import store from './store.js'

const stosre = createStore(store);
const app = createApp(App);
		app.use(stosre);
		app.mount('#app');
