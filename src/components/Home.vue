<template>
  <div>
    <h1>Home</h1>
    <ul>
      <li><router-link to="/liste">Rezepte</router-link></li>
      <li><router-link to="/rezept">Neues Rezept</router-link></li>
      <li><button class="btn btn-link" @click="openNewProduktDialog">Neues Produkt</button></li>
    </ul>
    <NewProduktDialog :is-open="newProduktDialogOpen" @close-dialog="closeNewProduktDialog"/>
    <!-- Weitere Komponenten und Inhalt hier -->
  </div>
</template>

<script>
import NewProduktDialog from "@/components/editor/NewProduktDialog.vue";
import {ref} from "vue";

export default {
  components: {NewProduktDialog},
  setup(props, { emit }) {
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
      closeNewProduktDialog
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>