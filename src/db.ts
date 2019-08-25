import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCSHv1PNlI58TMdMcnrl6evwDSW2QfjXYY',
  authDomain: 'projects-ts-6c119.firebaseapp.com',
  databaseURL: 'https://projects-ts-6c119.firebaseio.com',
  projectId: 'projects-ts-6c119',
  storageBucket: '',
  messagingSenderId: '674323375320',
  appId: '1:674323375320:web:c14aac330ce6fc7b',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
export const firebaseAuth = firebase.auth()
export const db = firebase.firestore()
// export const provider = new firebase.auth.GoogleAuthProvider()
