import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import PouchDB from 'pouchdb-browser';
import PouchAuthentication from "pouchdb-authentication";
PouchDB.plugin(PouchAuthentication);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

const app = createApp(App)
app.use(router, {
    pouch: PouchDB
})
app.mount('#app')