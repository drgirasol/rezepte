<template>

  <div v-if="rezept.anleitung && rezept.anleitung.schritte.length > 0" class="p-2">
    <p class="h4 pt-3">Anleitung</p>

    <Schritt v-for="schritt of rezept.anleitung.schritte" :schritt="schritt" :key="schritt.nr" @refresh="$emit('refresh')"/>

  </div>

</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import Schritt from "./Schritt.vue";

export default {
  components: {Schritt},
  emits: ['addStep', 'refresh'],
  props: {
    rezept: {
      type: Object,
      required: true
    }
  },
  setup(props, {emit}) {
    const $route = useRoute()
    onMounted(async () => {})
    return {
      async addStep() {
        emit('addStep')
      },
    }
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>