import { db } from '../db'
import { Documents } from '../types/Documents'

export interface Action {
  type: string
  payload: any
}

const putDocumentApi = async (state: Documents, id: string, changed: any): Promise<void> => {
  try {
    await db
      .collection('documents')
      .doc(id)
      .update(changed)
  } catch (error) {
    console.error('error changing document: ' + error)
  }
}

const documentReducer = (state: Documents, action: Action): Documents => {
  const { type, payload } = action
  switch (type) {
    case 'UPDATE_DOCUMENTS': {
      return { ...state, ...payload }
    }
    case 'ADD_DOCUMENT': {
      const addDocumentApi = async (): Promise<void> => {
        try {
          await db
            .collection('documents')
            .doc(payload.id)
            .set(payload.document)

          await db
            .collection('documents')
            .doc(payload.parent)
            .update({ subdocs: [...state[payload.parent].subdocs, payload.id] })
        } catch (error) {
          console.error('error adding document: ' + error)
        }
      }
      addDocumentApi()
      return {
        ...state,
        [payload.parent]: {
          ...state[payload.parent],
          subdocs: [...state[payload.parent].subdocs, payload.id],
        },
        [payload.id]: payload.document,
      }
    }
    case 'CHANGE_DOCUMENT': {
      const { id, ...changed } = payload
      putDocumentApi(state, id, changed)
      return {
        ...state,
        [id]: {
          ...state[id],
          ...changed,
        },
      }
    }
    case 'DELETE_DOCUMENT': {
      const newState = { ...state }
      const parentDoc = { ...state[payload.parent] }
      const deleteDocumentApi = async (): Promise<void> => {
        await db
          .collection('documents')
          .doc(parentDoc.id)
          .update({ subdocs: parentDoc.subdocs.filter(id => id !== payload.id) })
        await db
          .collection('documents')
          .doc(payload.id)
          .delete()
      }
      deleteDocumentApi()
      newState[parentDoc.id] = {
        ...newState[parentDoc.id],
        subdocs: newState[parentDoc.id].subdocs.filter(id => id !== payload.id),
      }
      delete newState[payload.id]
      return newState
    }
    case 'CHECK_TODO': {
      const changed = { done: !state[payload.id].done }
      putDocumentApi(state, payload.id, changed)
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          ...changed,
        },
      }
    }
    default:
      return state
  }
}

export default documentReducer
