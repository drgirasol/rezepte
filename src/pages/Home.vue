<template>
  <div>
    <h1><i class="bi bi-house"></i> Home</h1>
    <div class="container">
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="button" @click="navigateTo('/rezepte')"><i class="bi bi-card-list"></i> Rezepte</button>
        <button class="btn btn-primary" type="button" @click="navigateTo('/rezept')"><i class="bi bi-file-earmark-plus-fill"></i> Neues Rezept</button>
        <button class="btn btn-primary" type="button" @click="navigateTo('/produkte')"><i class="bi bi-card-list"></i> Produkte</button>
        <button class="btn btn-primary" type="button" @click="openNewProduktDialog"><i class="bi bi-cart-plus"></i> Neues Produkt</button>
        <button class="btn btn-primary" type="button" @click="navigateTo('/materialien')"><i class="bi bi-card-list"></i> Materialien</button>
        <button class="btn btn-primary" type="button" @click="navigateTo('/material')"><i class="bi bi-card-list"></i> Neues Material</button>
      </div>
    </div>
    <NewProduktDialog :is-open="newProduktDialogOpen" @close-dialog="closeNewProduktDialog"/>
    <!-- Weitere Komponenten und Inhalt hier -->
  </div>
</template>

<script>
/*
  @Robin: Zwecks besserer Übersicht und weil es pflegeleichter ist, hab ich Listen für Material und Produkte als separate Komponenten angelegt.
  Auch habe ich die Darstellung der Materialliste beispielhaft verändert.
  Bei den Produkten wäre es hilfreich, wenn man da gleich sieht, welche Attribute bereits einen Wert haben und welche nicht.
  Du kannst z.B. dort ein Bootstrap Accordion (https://getbootstrap.com/docs/5.1/components/accordion/) verwenden.
  Die einzelnen Produkte sind dann "accordion-item"s. (also anstatt <li v-for...> <div class="accordion-item" v-for...>)
  Der "accordion-header" ist der Name des Produkts.
  Der "accordion-body" enthält die anderen Attribute und einen edit button
 */
import NewProduktDialog from "@/components/NewProduktDialog.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

export default {
  components: {NewProduktDialog},
  setup(props, { emit }) {
    const $router = useRouter()
    const newProduktDialogOpen = ref(false); // Zustand zur Steuerung des Dialogs
    const openNewProduktDialog = () => {
      newProduktDialogOpen.value = true; // Öffnet den Dialog
    };
    const closeNewProduktDialog = async () => {
      newProduktDialogOpen.value = false; // Schließt den Dialog
      //await loadProducts()
      //emit('refresh')
    };
    return {
      newProduktDialogOpen,
      openNewProduktDialog,
      closeNewProduktDialog,
      navigateTo(route) {
        $router.push(route)
      }
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>