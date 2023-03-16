
import { useReducer } from 'react';

const EARNER_ACTION = {
    SET_LOGIN_ID : 1,
    LOAD_LIST_LOADED : 2,
    LOAD_LIST   : 3,
    EARNER_SELECTED : 4,
    EARNER_UPDATE  : 5,
};
Object.freeze(EARNER_ACTION);

function earnerReducer(state, action) {
    switch (action.type) {
        case EARNER_ACTION.SET_LOGIN_ID:
            return {...state, userid : action.userid};
        case EARNER_ACTION.LOAD_LIST_LOADED:
            return {...state, loaded : action.loaded};
        case EARNER_ACTION.LOAD_LIST:
            return {...state, earnerList : action.earnerList};
        case EARNER_ACTION.EARNER_SELECTED:
            return {...state, selectedEarner : action.selectedEarner};
        case EARNER_ACTION.EARNER_UPDATE:
            return {...state, 
                earnerList:state.earnerList.splice(
                    state.earnerList.findIndex(earner => earner.code === action.earner.code), 1, action.earner)
                    , selectedEarner : action.earner};
        default:
            return state;
    }
}

export default function Model () {
    const {state, dispatch} = useReducer(earnerReducer, {
        userid : '',
        loaded : false,
        earnerList : [],
        selectedEarner : null,
        register_earner : {
            residenceSelect:'',
            div:'',
            isNative:'',
            personal_no:'',
            tel1:'',tel2:'',tel3:'',
            phone1:'',phone2:'',phone3:'',
            email1:'',email2:'',
            deduction_amount:'',
            etc:'',
            artist_type:'',
            ins_reduce:'',
        }
    });

    //서버에 목록 얻기 
    const onLoadFromServer = (userid) => {

        fetch(`http://localhost:8080/earner_list/yuchan2`)
        .then(result => result.json())
        .then(rowData =>{ 
            dispatch({type:EARNER_ACTION.LOAD_LIST_LOADED, userid : userid});
            dispatch({type:EARNER_ACTION.LOAD_LIST_LOADED, loaded : true});
            dispatch({type:EARNER_ACTION.LOAD_LIST, earnerList : rowData.earner_list});
        });
    }

    const onSelectedEarner = (earner) => {
        dispatch({type:EARNER_ACTION.EARNER_SELECTED, selectedEarner : earner});
    }

    const onUpdateEarner = (earner) => {
        dispatch({type:EARNER_ACTION.EARNER_UPDATE, earner : earner});
    }

    return {state,
        onLoadFromServer,
        onSelectedEarner,
        onUpdateEarner
     }
}