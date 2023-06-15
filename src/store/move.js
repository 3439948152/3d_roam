import Vuex from "vuex";

const roam_fun=new Vuex.Store({
    state:{
        move:null,
    },
    mutations:{
        initMove(state,move){
            state.move=move;
        },
    },
});

export default roam_fun;