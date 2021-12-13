import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import records from './store/records';
import blueprints from './store/blueprints';
import ui from './store/ui';
import ManagerLoading from './managers/ManagerLoading';
import ManagerCropping from './managers/ManagerCropping';
import ManagerOcr from './managers/ManagerOcr';
import './lib/RegExp.prototype';

const store = createStore({ 
	modules: {records, blueprints, ui}, 
	plugins: [ManagerLoading, ManagerCropping, ManagerOcr],
	strict: true,
	});
const app = createApp(App);
		app.use(store);
		app.mount('#app');
