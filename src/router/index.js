import { createRouter, createWebHistory } from 'vue-router';

import AuthForm from '../components/AuthForm.vue'
import ProductList from '../components/ProductList.vue'
import CreateProduct from '../components/CreateProduct.vue'


const routes = [
    {path: '/', component: ProductList},
    {path: '/login', component: AuthForm},
    {path: '/create', component: CreateProduct}
];
export default createRouter({
    history: createWebHistory(),
    routes,
}
);