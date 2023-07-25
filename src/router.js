import {createRouter, createWebHistory} from 'vue-router';
import Home from "./pages/Home.vue";
import Rezepte from "./pages/Rezepte.vue";
import EditorIndex from "./pages/EditorIndex.vue";
import Materialien from "@/pages/Materialien.vue";
import Produkte from "@/pages/Produkte.vue";
import Material from "@/pages/Material.vue";

/*
    @Robin: Alle hier verwendeten Komponenten stellen Seiten dar (siehe Verzeichnis "pages") und sind über die entsprechenden Routen (path) erreichbar.
    ":id" ist ein Attribut, welches aus der Route (also der Adresse, die man im Browser eingibt) ausgelesen wird und der Komponente über $route.params.id zur Verfügung gestellt wird.
 */
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/rezepte',
        component: Rezepte
    },
    {
        path: '/rezept/:id?',
        component: EditorIndex
    },
    {
        path: '/materialien',
        component: Materialien
    },
    {
        path: '/material/:id?',
        component: Material
    },
    {
        path: '/produkte',
        component: Produkte
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
    base: '/'
})

export default router;
