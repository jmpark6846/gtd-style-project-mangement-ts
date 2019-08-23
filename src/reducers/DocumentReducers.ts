import { Documents } from '../types/Documents'
import { db } from '../db'
import { Document } from '../types/Document'

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
    case 'SET_DOCUMENTS': {
      return payload
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
            .update({ subdocs: { ...state[payload.parent].subdocs, [payload.id]: true } })
        } catch (error) {
          console.error('error adding document: ' + error)
        }
      }
      addDocumentApi()
      return {
        ...state,
        [payload.parent]: {
          ...state[payload.parent],
          subdocs: {
            ...state[payload.parent].subdocs,
            [payload.id]: true,
          },
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
