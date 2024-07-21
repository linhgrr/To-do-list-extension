import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import Login from '../../components/Login.vue'
import Home from '../../components/Home.vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: Login },
        { path: '/home', component: Home },
    ]
});

const app = createApp(App)

app.use(router);
app.component('login', Login);
app.component('home', Home);
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

export default router;