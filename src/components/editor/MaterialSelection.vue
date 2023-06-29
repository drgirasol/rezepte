<template>
  <div class="input-group">
    <select v-model="selection" class="form-select" required @change="addMaterial">
      <option value="" disabled hidden>Material auswählen</option>
      <option v-for="m of materialien" :key="m._id">
        {{ m._id }}
      </option>
      <option label="Neues Material hinzufügen" :value="0"/>
    </select>
  </div>
</template>

<script>
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import PouchDB from "pouchdb-browser";

export default {
  props: {
    schritt: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const db = new PouchDB("Materialien")
    const rDb = new PouchDB("https://apartofnature.info/materialien", {
      auth: {
        username: "rezeptator",
        password: "IkolpingT2023"
      }
    })
    db.sync(rDb, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log("Materialien Sync Error")
    });
    const selection = new ref('')
    const materialien = reactive([])
    const state = reactive({
      allMat: []
    })
    function updateMaterialSelection() {
      materialien.splice(0, materialien.length)
      if (props.schritt.materialien.length > 0) {
        materialien.push(...state.allMat.filter(m => props.schritt.materialien.map(sm => sm._id).findIndex(sm => sm === m._id) === -1))
      } else {
        materialien.push(...state.allMat)
      }
      console.debug(materialien)
    }
    onBeforeMount(async () => {
      try {
        const result = await db.allDocs({ include_docs: true });
        state.allMat = result.rows.filter(row => !row.id.startsWith('_design/')).map(row => row.doc)
        updateMaterialSelection()
      } catch (error) {
        console.error('Error retrieving materials:', error)
      }
    })
    return {
      selection,
      materialien,
      addMaterial() {
        props.schritt.materialien.push(materialien.find(m => m._id === selection.value))
        selection.value = ''
        updateMaterialSelection()
      }
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>