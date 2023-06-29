import PouchDB from 'pouchdb-browser';
import Vue from 'vue';
import VuePouchDBLite from 'vue-pouchdb-lite';

Vue.use(VuePouchDBLite, {
    pouch: PouchDB,
    defaultDBName: 'mydb'
});

export default VuePouchDBLite;
