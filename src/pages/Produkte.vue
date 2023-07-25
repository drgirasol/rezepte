<template>
  <Index/>
</template>

<script>
import {ref} from "vue";
import {useRouter} from "vue-router";
import Index from "@/components/produkte/Index.vue";

export default {
  components: {Index},
  setup(props, { emit }) {
    return {}
  }
};
</script>

<style>
/* Stile für die Komponente hier */
</style>