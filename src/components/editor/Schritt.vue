<template>
  <div class="p-2" id="stepForm">
    <div class="row gy-2">
      <div class="input-group">
        <input placeholder="Beschreibung" v-model="schritt.text" class="form-control">
      </div>
      <div class="input-group">
        <span class="input-group-text">Dauer</span>
        <input v-model="schritt.zeit.dauer" class="form-control" type="number" id="dauer" name="dauer" placeholder="Dauer in Minuten">
      </div>
      <div class="input-group">
        <span class="input-group-text">Typ</span>
        <select :value="schritt.zeit.typ" class="form-select" name="Typ" id="Gartyp">
          <option value="kochen">kochen</option>
          <option value="backen">backen</option>
        </select>
      </div>
      <div>
        Materialien: {{ schritt.materialien.map(m => m._id).join(", ") }}
      </div>

      <MaterialSelection :schritt="schritt"/>

      <div>
        Produkte: {{ schritt.produkte.map(p => p.produktId + ' (' + p.gewicht + 'g)').join(", ") }}
      </div>

      <ProduktSelection :schritt="schritt" @refresh="refresh"/>

    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from "pouchdb-browser";
import {useRoute} from "vue-router";
import MaterialSelection from "./MaterialSelection.vue";
import ProduktSelection from "./ProduktSelection.vue";

export default {
  components: {ProduktSelection, MaterialSelection},
  emits: ['refresh'],
  props: {
    schritt: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const $route = useRoute()
    onMounted(async () => {

    })
    return {
      refresh () {

        emit('refresh')
      }
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>