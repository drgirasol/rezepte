import {createRouter, createWebHistory} from 'vue-router';
import Home from "./pages/Home.vue";
import RezeptListe from "./pages/Rezepte.vue";
import EditorIndex from "./pages/EditorIndex.vue";
import Materialien from "@/pages/Materialien.vue";
import Produkte from "@/pages/Produkte.vue";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/rezepte',
        component: RezeptListe
    },
    {
        path: '/rezept/:id?',
        component: EditorIndex
    },
    {
        path: '/materialien/:id?',
        component: Materialien
    },
    {
        path: '/produkte/:id?',
        component: Produkte
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
    base: '/'
})

export default router;
