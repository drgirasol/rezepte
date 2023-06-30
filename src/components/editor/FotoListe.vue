<template>
  <div>
    <ol>
      <li v-for="img of bilder" :idx="img.name">
        <img class="thumbnail" :src="img.url" alt="bild">
      </li>
    </ol>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute} from "vue-router";

export default {
  props: {
    bilder: {
      type: Array,
      required: true
    }
  },
  setup(props, ctx) {
    const $route = useRoute()
    onMounted(async () => {})

    return {

    };
  },
};
</script>

<style>
.thumbnail {
  max-width: 150px;  /* Die maximale Breite des Thumbnails */
  max-height: 150px; /* Die maximale Höhe des Thumbnails */
  width: auto;      /* Die Breite wird automatisch angepasst */
  height: auto;     /* Die Höhe wird automatisch angepasst */
}
</style>