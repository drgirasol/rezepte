<template>
  <div class="p-2">
    <div>
      <div class="pb-2">
        <router-link to="/">Home</router-link>&nbsp;
        <router-link to="/liste">Rezepte</router-link>
      </div>
      <div class="input-group">
        <span class="input-group-text">Rezeptname</span>
        <input v-model="state.rezept.name" class="form-control" placeholder="Name" @change="checkIfRezeptExists()">
      </div>

      <div v-if="state.rezept.anleitung && state.rezept.anleitung.schritte.length > 0" class="p-2">
        <p class="h4 pt-3">Anleitung</p>
        <Schritt v-for="schritt of state.rezept.anleitung.schritte" :schritt="schritt" :key="schritt.nr" @refresh="$emit('refresh')"/>
      </div>

      <button type="button" class="btn btn-outline-success btn-sm" @click="addStep()">Schritt hinzufügen</button>

      <div v-if="state.rezept._id">
        <FotoListe :bilder="state.bilder"/>
        <button class="btn btn-secondary" @click="fotoUploadDialogOpen=true">Foto hinzufügen</button>
        <FotoUploadDialog :is-open="fotoUploadDialogOpen"  @close-dialog="closeFotoUploadDialog"/>
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
import FotoListe from "@/components/editor/FotoListe.vue";
import FotoUploadDialog from "@/components/editor/FotoUploadDialog.vue";
import Schritt from "@/components/editor/Schritt.vue";
import NewProduktDialog from "@/components/editor/NewProduktDialog.vue";

export default {
  components: {NewProduktDialog, Schritt, FotoUploadDialog, FotoListe},
  setup(props, { emit }) {
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
      },
      bilder: []
    });
    const exists = new ref(false)
    const fotoUploadDialogOpen = ref(false); // Zustand zur Steuerung des Dialogs
    const closeFotoUploadDialog = async () => {
      fotoUploadDialogOpen.value = false; // Schließt den Dialog
      // await loadProducts()
      await refresh()
    };
    async function refresh() {
      await loadRezept()
      setBilder()
    }
    function setBilder() {
      const bilder = []
      if (state.rezept._attachments && Object.keys(state.rezept._attachments).length) {
        for (const name of Object.keys(state.rezept._attachments)) {
          console.log(state.rezept._attachments[name])
          bilder.push({
            name: name,
            url: 'data:' + state.rezept._attachments[name].content_type + ';base64,' + state.rezept._attachments[name].data
          })
        }
        state.bilder = bilder
      }
    }
    async function loadRezept() {
      try {
        state.rezept = await db.get($route.params.id, { attachments: true })
        setBilder()
      } catch (error) {
        console.error('Error retrieving recipes:', error)
      }
    }
    onMounted(async () => {

      if ($route.params.id) {
        console.debug($route.params.id)
        await loadRezept()
        setBilder()
      } else {

      }
    })
    return {
      state,
      exists,
      fotoUploadDialogOpen,
      closeFotoUploadDialog,
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