import * as actions from './Actions';
import { store } from './../models/Store';
import { push } from 'connected-react-router';
import * as routes from './../constants/Routes';
import { Keys as localStorageKeys } from './../constants/LocalStorageConstants';

export const logOut = (): actions.LogOutAction => {
    localStorage.setItem(localStorageKeys.TOKEN, '');
    store.dispatch(push(routes.Routes.LOG_IN));
 
    return {
        type: actions.TypeKeys.LOG_OUT   
    };
};