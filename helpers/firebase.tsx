import React, {createContext} from 'react';
import firebase, { FirebaseApp } from 'firebase/app';
import app from './firebaseConfig';

//create the firebase context for the app
export const FirebaseContext = createContext<FirebaseApp>(app);

interface IFirebaseProvider {
  children: React.ReactNode;
}
const FirebaseProvider = ({children}: IFirebaseProvider) => {
  return (
    <FirebaseContext.Provider value = {app}>{children}</FirebaseContext.Provider>
  )
};

export default FirebaseProvider;