<template>
  <div>
    <h1>Materialien-Fundus</h1>
    <ol>
      <li v-for="material in daten.materialien" :key="material._id">{{ material._id }}
        <button @click="remove(material._id)">Entfernen</button>
      </li>
    </ol>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute} from "vue-router";

const mdb = new PouchDB("Materialien");

export default {
  props: {},
  setup(props, ctx) {
    const $route = useRoute()
    const daten = reactive({
      materialien: []
    });
    async function load() {
      try {
        const result = await mdb.allDocs({ include_docs: true });
        daten.materialien = result.rows.map(row => row.doc);
      } catch (error) {
        console.error("Fehler beim Abrufen des Materials:", error);
      }
    }
    function remove(id) {
      const index = daten.materialien.findIndex((m) => m._id === id);
      if (index !== -1) {
        daten.materialien.splice(index, 1);
      }
      console.log("Material entfernen:", id);
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