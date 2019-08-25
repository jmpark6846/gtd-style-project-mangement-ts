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

          if (payload.parent !== null) {
            await db
              .collection('documents')
              .doc(payload.parent)
              .update({ subdocs: state[payload.parent].subdocs })
          }
        } catch (error) {
          console.error('error adding document: ' + error)
        }
      }
      addDocumentApi()
      const newState = { ...state }
      newState[payload.id] = payload.document
      if (payload.parent !== null) {
        newState[payload.parent].subdocs = [...newState[payload.parent].subdocs, payload.id]
      }
      return newState
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
      const parentDoc = payload.parent && { ...state[payload.parent] }
      let deletedDocIds: string[] = [payload.id]
      for (let i = 0; i < deletedDocIds.length; i++) {
        deletedDocIds = [...deletedDocIds, ...state[deletedDocIds[i]].subdocs]
      }

      const deleteDocumentApi = async (): Promise<void> => {
        if (payload.parent) {
          await db
            .collection('documents')
            .doc(parentDoc.id)
            .update({ subdocs: parentDoc.subdocs.filter(id => id !== payload.id) })
        }
        // eslint-disable-next-line no-undef
        Promise.all(
          deletedDocIds.map(
            async docId =>
              await db
                .collection('documents')
                .doc(docId)
                .delete()
          )
        )
      }
      deleteDocumentApi()

      if (payload.parent) {
        newState[parentDoc.id] = {
          ...newState[parentDoc.id],
          subdocs: newState[parentDoc.id].subdocs.filter(id => id !== payload.id),
        }
      }
      deletedDocIds.forEach(id => delete newState[id])
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
