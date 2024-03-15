import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        username: '',
        userlevel: 0,
        appName: '智能系统积木化组装平台',
        appDesc: '智能系统积木化组装平台是由个人分享积木化智能编程的平台，仅用作学生间交流使用'
    },

    getters:{
        token(state){
            if (state.token){
                return state.token
            }
            let token = sessionStorage.getItem('token');
            if (token){
                state.token = token;
                return token
            }
            return '';
        },

        username(state){
            if (state.username){
                return state.username
            }
            let username = sessionStorage.getItem('username');
            if (username){
                state.username = username;
                return username
            }
            return '';
        },

        userlevel(state){
            if (state.userlevel){
                return state.userlevel
            }
            let userlevel = sessionStorage.getItem('userlevel');
            if (userlevel){
                state.userlevel = userlevel;
                return userlevel
            }
            return 0;
        }
    },

    mutations: {
        saveToken (state,value) {
            state.token = value
            sessionStorage.setItem("token",value)
        },

        saveUsername (state,value) {
            state.username = value
            sessionStorage.setItem("username",value)
        },

        saveUserlevel (state,value) {
            state.userlevel = value
            sessionStorage.setItem("userlevel",value)
        }
    },


})
