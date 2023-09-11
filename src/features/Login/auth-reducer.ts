import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    setInitializedAC,
    SetInitializedActionType
} from '../../app/app-reducer'
import {auth} from "../../api/todolists-api";
import {FormType} from "./Login";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodosDataAC, clearTodosDataActionType} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: FormType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await auth.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            //залогинь пользователя
            dispatch(setAppStatusAC('succeeded'))
            //убираем крутилку
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as { message: string }), dispatch)
    }
}

export const logOut = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await auth.logOut()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            //вылогинь пользователя
            dispatch(setAppStatusAC('succeeded'))
            //убираем крутилку
            dispatch(clearTodosDataAC())
            //удаляем данные из стора
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as { message: string }), dispatch)
    }
}

export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await auth.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            //залогинь пользователя
            dispatch(setAppStatusAC('succeeded'))
            //убираем крутилку
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as { message: string }), dispatch)
    } finally {
        dispatch(setInitializedAC(true))
    }
}
//после перезагрузки будет лететь me запрос

// types
export type ActionsType = ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetInitializedActionType
    | clearTodosDataActionType


