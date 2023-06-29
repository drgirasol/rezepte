import {createRouter, createWebHistory} from 'vue-router';
import Home from "./components/Home.vue";
import RezeptListe from "./components/RezeptListe.vue";
import EditorIndex from "./components/editor/EditorIndex.vue";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/liste',
        component: RezeptListe
    },
    {
        path: '/rezept/:id?',
        component: EditorIndex
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
    base: '/'
})

export default router;
