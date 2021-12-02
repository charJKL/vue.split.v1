import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import records from './store/records';
import blueprints from './store/blueprints';
import ui from './store/ui';
import ManagerCropping from './managers/ManagerCropping';
import './lib/RegExp.prototype';

const store = createStore({ modules: {records, blueprints, ui}, plugins: [ManagerCropping]});
const app = createApp(App);
		app.use(store);
		app.mount('#app');
