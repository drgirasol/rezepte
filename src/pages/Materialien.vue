<template>
  <div class="pb-2">
    <router-link to="/"><i class="bi bi-house"></i> Home</router-link>&nbsp;
    <span><i class="bi bi-card-list"></i> Materialien</span>&nbsp;
  </div>
  <div>
    <div
        v-for="material in daten.materialien"
        :key="material._id"
        class="card mb-2"
        style="width: 18rem;"
    >
      <div class="card-body">
        <h5 class="card-title">{{ material._id }}</h5>
        <div class="card-subtitle mb-2 text-body-secondary">{{ material.desc }}</div>
        <div class="btn-group">
          <button class="btn btn-primary" type="button" @click="navigateTo('/material/' + material._id)"><i class="bi bi-pen"></i> Bearbeiten</button>
          <button class="btn btn-warning" type="button" @click="remove(material._id)"><i class="bi bi-card-list"></i> Entfernen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute, useRouter} from "vue-router";

const mdb = new PouchDB("Materialien");

export default {
  props: {},
  setup(props, ctx) {
    const $router = useRouter()
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
      remove,
      navigateTo(route) {
        $router.push(route)
      }
    }
  },
};
</script>

<style>

</style>