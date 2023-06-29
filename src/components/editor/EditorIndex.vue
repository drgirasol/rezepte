<template>
  <div class="p-2">
    <div>
      <div class="pb-2">
        <router-link to="/liste">Rezepte</router-link>
      </div>
      <div class="input-group">
        <span class="input-group-text">Rezeptname</span>
        <input v-model="state.rezept.name" class="form-control" placeholder="Name" @change="checkIfRezeptExists()">
      </div>

      <Anleitung :rezept="state.rezept" @add-step="addStep" @refresh="refresh"/>

      <button type="button" class="btn btn-outline-success btn-sm" @click="addStep()">Schritt hinzufügen</button>
      <div v-if="state.rezept._id">
        <!--          <div ref="fotoListe" v-scope="fotoListKomponente({ rezept: state.rezept, self: this })"></div>-->
        <!--          <div ref="fotoUploadForm" v-scope="fotoFormKomponente({ pdb: PouchDB, self: this })"-->
        <!--               @save="saveAttachments" @finished="attachmentsHinzugefuegt" @canceled=""></div>-->
      </div>
      <button class="btn btn-primary" type="submit" :disabled="!state.rezept.name || exists" @click="saveRezept()">Speichern
      </button>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from "pouchdb-browser";
import {useRoute, useRouter} from "vue-router";
import Anleitung from "./Anleitung.vue";

export default {
  components: {Anleitung},
  setup() {
    const $route = useRoute()
    const $router = useRouter()
    const db = new PouchDB("Rezepte")
    let state = reactive({
      rezept: {
        _id: "",
        name: "",
        anleitung: {
          schritte: [{
            nr: 1,
            text: "",
            zeit: {
              dauer: "",
              typ: "",
            },
            materialien: [],
            produkte: [],
          }],
        }
      }
    });
    const exists = new ref(false)
    async function refresh() {
      await loadRezept()
    }
    async function loadRezept() {
      try {
        state.rezept = await db.get($route.params.id)
      } catch (error) {
        console.error('Error retrieving recipes:', error)
      }
    }
    onMounted(async () => {

      if ($route.params.id) {
        console.debug($route.params.id)
        await loadRezept()
      } else {

      }
    })
    return {
      state,
      exists,
      refresh,
      loadRezept,
      addStep () {
        state.rezept.anleitung.schritte.push({
          nr: state.rezept.anleitung.schritte.length+1,
          text: "",
          zeit: {
            dauer: "",
            typ: "",
          },
          materialien: [],
          produkte: [],
        })
      },
      async saveRezept() {
        if (state.rezept._id) {
          try {
            const curRezept = await db.get(state.rezept._id)
            state.rezept._rev = curRezept._rev
          } catch (err) {
            console.error(err)
          }
          try {
            const response = await db.put(state.rezept)
            console.log("Rezept aktualisiert", response)
          } catch (err) {
            console.error(err)
          }
        } else {
          try {
            const response = await db.post(state.rezept)
            console.log("Neues Rezept gespeichert", response)
            state.rezept._id = response.id
            $router.push("/rezept/" + response.id)
          } catch (err) {
            console.error(err)
          }
        }
      },
      async checkIfRezeptExists() {
        // if (rezept.name.length > 1) {
        //   try {
        //     const result = await db.find($route.params.id)
        //     console.debug(result)
        //     rezept = reactive(result)
        //   } catch (error) {
        //     console.error('Error retrieving recipes:', error)
        //   }
        //   console.log("rezeptExists: ", exists, rezept.name)
        // }
      },
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>