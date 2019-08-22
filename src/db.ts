import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCchrUcVYtzAoYNtes9ebKiomCEGyzIN5U',
  authDomain: 'projects-ts.firebaseapp.com',
  databaseURL: 'https://projects-ts.firebaseio.com',
  projectId: 'projects-ts',
  storageBucket: '',
  messagingSenderId: '57368039787',
  appId: '1:57368039787:web:400b1ffc8f5eb0d4',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
export const firebaseAuth = firebase.auth()
export const db = firebase.firestore()
// export const provider = new firebase.auth.GoogleAuthProvider()
