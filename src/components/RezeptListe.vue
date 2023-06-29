<template>
  <div>
    <h1>Rezept-Liste</h1>
    <ol>
      <li v-for="r of rezepte" :idx="r._id">
        <router-link :to="'/rezept/' + r._id">{{ r.name }}</router-link>
      </li>
    </ol>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import PouchDB from 'pouchdb-browser';

export default {
  setup(props, ctx) {
    const rezepte = new ref([])

    onMounted(async () => {
      const db = new PouchDB("Rezepte")
      const rDb = new PouchDB("https://apartofnature.info/rezepte", {
        auth: {
          username: "rezeptator",
          password: "IkolpingT2023"
        }
      })
      db.sync(rDb, {
        live: true,
        retry: true
      }).on('error', function (err) {
        console.log("Rezepte Sync Error")
      });
      try {
        const result = await db.allDocs({ include_docs: true });
        rezepte.value = result.rows.filter(row => !row.id.startsWith('_design/')).map(row => row.doc);
      } catch (error) {
        console.error('Error retrieving recipes:', error);
      }
    })

    return {
      rezepte,
    };
  },
};
</script>

<style>
/* Stile für die Komponente hier */
</style>