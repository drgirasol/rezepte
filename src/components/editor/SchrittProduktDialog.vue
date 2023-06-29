<template>
  <div v-if="isOpen" class="dialog-overlay">
    <div class="dialog-content">
      <h4>Produktangaben anpassen</h4>
      <div class="p-2">
        <div class="pb-2">
          <label for="prodName">Name</label>
          <input readonly placeholder="Name" class="form-control" type="text" v-model="schrittProdukt.produktId"
                 required>
        </div>
        <div class="pb-2">
          <label for="prodName">Preis</label>
          <input v-model="schrittProdukt.preis" class="form-control" type="number" placeholder="Preis in Cent">
        </div>
        <div class="pb-2">
          <label for="prodName">Gewicht</label>
          <input v-model="schrittProdukt.gewicht" class="form-control" type="number"
                 placeholder="Gewicht in Gramm">
        </div>
        <div class="row">
          <button class="col btn btn-primary" type="submit" @click="applySchritt">Übernehmen</button>
          <button class="col btn btn-primary" @click="$emit('closeDialog')">Abbrechen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import PouchDB from "pouchdb-browser";
import {useRoute} from "vue-router";

export default defineComponent({
  emits: ['closeDialog'],
  props: {
    schritt: {
      type: Number,
      required: true
    },
    produkt: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, {emit}) {
    const $route = useRoute()
    const db = new PouchDB("Rezepte")
    let rezept
    let schritt
    const schrittProdukt = reactive({
      produktId: "",
      preis: 0,
      gewicht: 0
    })
    watch(
        () => props.isOpen,
        async (newVal, oldValue) => {
          if (newVal) {
            await updateData()
          }
        }
    );
    async function updateData () {
      try {
        rezept = await db.get($route.params.id);
        schritt = rezept.anleitung.schritte[props.schritt - 1]
        if (schritt) {
          const sProdukt = schritt.produkte.find(p => p.produktId === props.produkt)
          if (sProdukt) {
            schrittProdukt.produktId = sProdukt.produktId
            schrittProdukt.preis = sProdukt.preis
            schrittProdukt.gewicht = sProdukt.gewicht
          } else {
            schrittProdukt.produktId = props.produkt
            schrittProdukt.preis = 0
            schrittProdukt.gewicht = 0
          }
        } else {
          console.error("Schritt nicht gefunden", props.schritt - 1)
          emit('closeDialog')
        }
      } catch (error) {
        console.error('Error retrieving products:', error)
        emit('closeDialog')
      }
    }
    onMounted(async () => {
      if ($route.params.id) {
        await updateData()
      }
    })
    return {
      schrittProdukt,
      async applySchritt() {
        const idx = schritt.produkte.findIndex(p => p.produktId === props.produkt)
        if (idx > -1) {
          rezept.anleitung.schritte[props.schritt - 1].produkte.splice(idx, 1, schrittProdukt)
        } else {
          rezept.anleitung.schritte[props.schritt - 1].produkte.push(schrittProdukt)
        }
        try {
          rezept = await db.put(rezept);
        } catch (error) {
          console.error('Error saving rezept:', error)
        }
        //
        emit('closeDialog')
      }
    }
  }
});
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  z-index: 9999;
}
</style>