<template>
  <div class="pb-2">
    <router-link to="/"><i class="bi bi-house"></i> Home</router-link>&nbsp;
    <router-link to="/materialien"><i class="bi bi-card-list"></i> Materialien</router-link>&nbsp;
  </div>
  <div class="p-2">
    <div class="row gy-2">
      <div class="input-group">
        <input placeholder="Name" :disabled="newMaterial" v-model="name" class="form-control" aria-describedby="nameSaveAddon">
        <button v-if="material._id !== name" class="btn btn-success" type="button" id="nameSaveAddon" @click="save"><i class="bi bi-save"></i></button>
      </div>
      <div class="input-group">
        <input placeholder="Beschreibung" v-model="desc" class="form-control" aria-describedby="descSaveAddon">
        <button v-if="material.desc !== desc" class="btn btn-success" type="button" id="descSaveAddon" @click="save"><i class="bi bi-save"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PouchDB from "pouchdb-browser";
const db = new PouchDB("Materialien");

export default {
  components: {},
  setup(props, { emit }) {
    const $route = useRoute()
    const $router = useRouter()
    const name = ref(null)
    const desc = ref(null)
    const newMaterial = computed(() => {
      return !($route.params.id === "")
    })
    const material = reactive({
      _id: "",
      desc: "",
    })
    async function load() {
      if ($route.params.id) {
        try {
          const entry = await db.get($route.params.id)
          for (const key of Object.keys(entry)) {
            material[key] = entry[key]
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    onMounted(async () => {
      await load()
      name.value = material._id
      desc.value = material.desc
    })
    return {
      newMaterial,
      material,
      name,
      desc,
      async save() {
        if (!material._id) {
          material._id = name.value
        }
        material.desc = desc.value
        try {
          const result = await db.put(material)
          console.debug(result)
          await $router.push("/material/" + result.id)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>