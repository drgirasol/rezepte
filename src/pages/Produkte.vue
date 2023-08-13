<template>
  <div class="pb-2">
    <router-link to="/"><i class="bi bi-house"></i> Home</router-link>&nbsp;
    <span><i class="bi bi-card-list"></i> Gesammelte Produkte</span>&nbsp;
  </div>
  <div>
    <div class="accordion" id="produkteAccordion">
        <div v-for="(produkt, idx) in daten.produkte" :key="idx" class="accordion-item">
          <h2 class="accordion-header" :id="'heading-' + idx">
            <button
                :class="'accordion-button' + (idx === 0 ? '' : ' collapsed')"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse-' + idx"
                :aria-expanded="idx === 0 ? 'true' : 'false'"
                :aria-controls="'collapse-' + idx"
            >
              {{ produkt._id }}
            </button>
          </h2>
          <div
              :id="'collapse-' + idx"
              :class="'accordion-collapse collapse' + (idx === 0 ? ' show' : '')"
              :aria-labelledby="'heading-' + idx"
              data-bs-parent="#produkteAccordion"
          >
            <div class="accordion-body">
              <p>Qualität: {{ produkt.qualitaet }}</p>
              <p>Herkunft: {{ produkt.herkunft }}</p>
              <p>Verpackung: {{ produkt.verpackung }}</p>
              <p>Haltbarmachung: {{ produkt.haltbarmachung }}</p>
              <p>Kategorie: {{ produkt.kategorie }}</p>
              <p>Verarbeitungsgrad: {{ produkt.verarbeitungsgrad }}</p>
              <button class="btn btn-primary" type="button" @click="navigateTo('/produkt/' + produkt._id)">
                <i class="bi bi-pen"></i> Bearbeiten
              </button>
              <button class="btn btn-warning" type="button" @click="remove(produkt._id)" disabled>
                <i class="bi bi-trash3"></i> Entfernen
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import {onMounted, reactive, computed, ref} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute, useRouter} from "vue-router";

const db = new PouchDB("Produkte");

export default {
  props: {},
  setup(props, ctx) {
    const $router = useRouter()
    const daten = reactive({
      produkte: []
    });
    async function load() {
      try {
        const result = await db.allDocs({ include_docs: true });
        daten.produkte = result.rows.map(row => row.doc);
      } catch (error) {
        console.error("Fehler beim Abrufen der Produkte:", error);
      }
    }
    function remove(id) {
      const index = daten.produkte.findIndex(p => p._id === id);
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
      remove,
      navigateTo(route) {
        $router.push(route)
      },
    }
  },
};
</script>

<style>

</style>