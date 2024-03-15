import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/store";
import Login from "@/components/login/Login";
import Home from "@/components/home/Home";
import Work from "@/components/work/Work";
import Datasets from "@/components/datasets/Datasets";
import Dataset from "@/components/dataset/Dataset";
import Docs from "@/components/docs/Docs";
import Users from "@/components/users/Users";
import Course from "@/components/course/Course";
import Courseware from "@/components/courseware/Courseware";
import Device from "@/components/device/Device";

Vue.use(VueRouter)


const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/work',
            name: 'work',
            component: Work
        },
        {
            path: '/datasets',
            name: 'datasets',
            component: Datasets
        },
        {
            path: '/dataset',
            name: 'dataset',
            component: Dataset
        },
        {
            path: '/docs',
            name: 'docs',
            component: Docs
        },
        {
            path: '/users',
            name: 'users',
            component: Users
        },
        {
            path: '/course',
            name: 'course',
            component: Course
        },
        {
            path: '/courseware',
            name: 'courseware',
            component: Courseware
        },
        {
            path: '/device',
            name: 'device',
            component: Device
        }
    ]
})

router.beforeEach((to, from, next)=>{
    if (to.path ==='/' || to.path ==='/login'){
        next()
    }else {
        if (!store.getters.token){
            next({path:'/login'})
        }else {
            next()
        }
    }

});


export default router