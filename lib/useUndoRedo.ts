import { Reducer, useReducer } from "react";
import { mutate } from "swr";

export interface FetchParams {
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  mutateString: string
}

export enum ReducerActionType {
  UNDO,
  REDO,
  SET_STATE,
  INITIALIZE
}

export type UndoRedo = {
  past: FetchParams[]
  present: FetchParams
  future: FetchParams[]
}

export type UndoRedoAction = {
  type: ReducerActionType.UNDO | ReducerActionType.REDO
}

export type SetStateAction = {
  type: ReducerActionType.SET_STATE | ReducerActionType.INITIALIZE
  payload: FetchParams
}

export type ReducerAction = UndoRedoAction | SetStateAction;

const undoRedoReducer: Reducer<UndoRedo, ReducerAction> = (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case ReducerActionType.INITIALIZE:
      return {
        past: [],
        present: action.payload,
        future: []
      };
    case ReducerActionType.SET_STATE:
      return {
        past: [...past, present],
        present: action.payload,
        future: []
      };
    case ReducerActionType.UNDO:
      if (past.length == 0) {
        return state
      }

      const previous: FetchParams = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      fetch(previous.input, previous.init).then(() => {
        mutate(previous.mutateString)
      })

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case ReducerActionType.REDO:
      if (future.length == 0) {
        return state
      }

      const next: FetchParams = future[0]
      const newFuture = future.slice(1)

      fetch(next.input, next.init).then(() => {
        mutate(next.mutateString)
      })

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    default:
      throw new Error();
  }
};

const useUndoRedo = (initialState: any) => {
  const [state, dispatch] = useReducer(undoRedoReducer, {
    past: [],
    present: initialState,
    future: []
  });

  const { past, present, future } = state;

  const setState = (newState: any) => dispatch({ type: ReducerActionType.SET_STATE, payload: newState });
  const undo = () => dispatch({ type: ReducerActionType.UNDO });
  const redo = () => dispatch({ type: ReducerActionType.REDO });
  const isUndoPossible = past && past.length > 0;
  const isRedoPossible = future && future.length > 0;

  const setInitialState = (state: any) => {
    dispatch({ type: ReducerActionType.INITIALIZE, payload: state })
  }

  return {
    state: present,
    setState,
    setInitialState,
    undo,
    redo,
    isUndoPossible,
    isRedoPossible
  };
};

export default useUndoRedo;