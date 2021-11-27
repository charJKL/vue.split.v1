import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import records from './store/records'
import ui from './store/ui';
import './lib/Map.prototype';

const store = createStore({ modules: {records, ui}});
const app = createApp(App);
		app.use(store);
		app.mount('#app');
