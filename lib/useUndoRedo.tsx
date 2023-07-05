import { Reducer, createContext, useContext, useReducer } from "react";

export interface FetchParams {
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  mutateString: string
}

export enum ReducerActionType {
  UNDO,
  REDO,
  SET_STATE,
  INITIALIZE,
  RESET
}

export type UndoRedo = {
  past: FetchParams[]
  present: FetchParams | null
  future: FetchParams[]
}

export type UndoRedoAction = {
  type: ReducerActionType.UNDO | ReducerActionType.REDO | ReducerActionType.RESET
}

export type SetStateAction = {
  type: ReducerActionType.SET_STATE | ReducerActionType.INITIALIZE
  payload: FetchParams
}

export type ReducerAction = UndoRedoAction | SetStateAction

const undoRedoReducer: Reducer<UndoRedo, ReducerAction> = (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case ReducerActionType.RESET:
      return {
        past: [],
        present: null,
        future: []
      };
    case ReducerActionType.INITIALIZE:
      return {
        past: [],
        present: action.payload,
        future: []
      };
    case ReducerActionType.SET_STATE:
      return {
        past: [...past, present as FetchParams],
        present: action.payload,
        future: []
      };
    case ReducerActionType.UNDO:
      if (past.length == 0) {
        return state
      }

      const previous: FetchParams = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present as FetchParams, ...future]
      };
    case ReducerActionType.REDO:
      if (future.length == 0) {
        return state
      }

      const next: FetchParams = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present as FetchParams],
        present: next,
        future: newFuture
      };
    default:
      throw new Error();
  }
}

export const useCustomReducer = (initialState: any) => {
  const [state, dispatch] = useReducer(undoRedoReducer, {
    past: [],
    present: initialState,
    future: []
  })

  const { past, present, future } = state;

  const reset = () => {
    dispatch({ type: ReducerActionType.RESET })
  }

  const setState = (newState: any) => {
    dispatch({ type: ReducerActionType.SET_STATE, payload: newState });
  }

  const setInitialState = (newState: any) => {
    dispatch({ type: ReducerActionType.INITIALIZE, payload: newState })
  }

  const undo = () => dispatch({ type: ReducerActionType.UNDO })
  const redo = () => dispatch({ type: ReducerActionType.REDO })
  const isUndoPossible = past && past.length > 0
  const isRedoPossible = future && future.length > 0
  const isInitialized = past.length != 0 || future.length != 0

  return {
    state: present,
    setState,
    setInitialState,
    isInitialized,
    undo,
    redo,
    reset,
    isUndoPossible,
    isRedoPossible
  }
}

interface UndoRedoContextType {
  state: FetchParams | null
  setState: (newState: any) => void
  setInitialState: (newState: any) => void
  undo: () => void
  redo: () => void
  reset: () => void
  isUndoPossible: boolean
  isRedoPossible: boolean
}

export const UndoRedoContext = createContext<UndoRedoContextType | null>(null)

export const useUndoRedo = () => {
  const ctx = useContext(UndoRedoContext)
  if (!ctx) {
    throw Error("No UndoRedoContext")
  }

  return ctx
}