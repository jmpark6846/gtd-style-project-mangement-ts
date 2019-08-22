import { Documents } from '../types/Documents'
import { db } from '../db'

export interface Action {
  type: string
  payload: any
}

const documentReducer = (state: Documents, action: Action): Documents => {
  const { type, payload } = action
  switch (type) {
    case 'SET_DOCUMENTS': {
      return payload
    }
    case 'ADD_DOCUMENT': {
      const addProjectApi = async (): Promise<void> => {
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
          console.error('error adding project: ' + error)
        }
      }
      addProjectApi()
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
    default:
      return state
  }
}

export default documentReducer
