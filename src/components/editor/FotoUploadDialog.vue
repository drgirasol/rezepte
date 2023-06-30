<template>
  <div v-if="isOpen" class="dialog-overlay">
    <div class="dialog-content">
      <h4>Foto hochladen</h4>
      <div class="p-2">
        <form method="post" enctype="multipart/form-data">
          <div class="pb-2">
            <label for="fotosToProcess">Fotos auswählen</label>
            <input class="form-control" type="file" id="fotosToProcess"
                   accept="image/png, image/jpeg">
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-primary" type="button" @click="processFotos">Hochladen</button>
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-primary" @click="$emit('closeDialog')">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import PouchDB from 'pouchdb-browser';
import {useRoute} from "vue-router";

export default defineComponent({
  emits: ['closeDialog'],
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const $route = useRoute()
    const imgs = ref([])
    let rezept, db
    watch(
        () => props.isOpen,
        (newVal, oldValue) => {
          if (newVal) {
            // produkt._id = ""
          }
        }
    );
    onMounted(async () => {
      db = new PouchDB("Rezepte")
      if ($route.params.id) {
        try {
          rezept = await db.get($route.params.id, { attachments: true });
        } catch (error) {
          console.error('Error retrieving recipes:', error);
        }
      }
    })

    return {
      imgs,
      async processFotos() {
        const input = document.getElementById('fotosToProcess');
        for (const file of input.files) {
          if (file) {
            const response = await db.putAttachment(rezept._id, file.name, rezept._rev, file, file.type)
            console.log(response)
            emit('closeDialog')
          }
        }
      }
    };
  },
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