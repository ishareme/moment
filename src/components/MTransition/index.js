import navigator from "./navigator"
import MTransition from "./MTransition"
export default {
    install(Vue,router){
        navigator(router);
        Vue.component('m-transition',MTransition);
    }
}
