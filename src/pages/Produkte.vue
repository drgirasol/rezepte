<template>
  <div>
    <h1>Gesammelte Produkte</h1>
    <ol>
      <li v-for="produkt in daten.produkte" :key="produkt._id">{{ produkt._id }}
        <button @click="remove(produkt._id)" disabled>Entfernen</button>
      </li>
    </ol>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute} from "vue-router";

const db = new PouchDB("Produkte");

export default {
  props: {},
  setup(props, ctx) {
    const daten = reactive({
      produkte: []
    });
    async function load() {
      try {
        const result = await db.allDocs({ include_docs: true });
        daten.produkte = result.rows.map(row => row.doc);
      } catch (error) {
        console.error("Fehler beim Abrufen des Produkts:", error);
      }
    }
    function remove(id) {
      const index = daten.produkte.findIndex((p) => p._id === id);
      if (index !== -1) {
        daten.produkte.splice(index, 1);
      }
      console.log("Produkt entfernen:", id);
    }
    onMounted(async () => {
      await load()
    })

    return {
      daten,
      remove
    }
  },
};
</script>

<style>

</style>