import { collection, getFirestore } from 'firebase/firestore'
import { app } from './firebase'

export const firestore = getFirestore(app);

// category
export const categoryCollection = collection(firestore, 'category')
