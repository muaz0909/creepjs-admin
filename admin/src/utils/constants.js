import {initializeApp} from "firebase/app";

import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const constants = {
    apiKey: "AIzaSyABUaQwEDbCHLuYB-1w_FRyK76Em49YXHQ",
    authDomain: "creepjs-admin-staging.firebaseapp.com",
    projectId: "creepjs-admin-staging",
    storageBucket: "creepjs-admin-staging.appspot.com",
    messagingSenderId: "982086444148",
    appId: "1:982086444148:web:5f2947b1e0cc6e28861d21"
};



const app = initializeApp(constants);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);


export const base_url = "https://us-central1-fashion-duels---pomp.cloudfunctions.net";



export const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3"
]


export const reformatArrayToString = (array) => {
    let result = ''
    if (!array) return result;
    array.forEach((item) => {
        result += item + ','
    })
    return result
}

export const reformatArrayOfObjectsToString = (array) => {
    let result = ''
    if (!array) return result;
    array.forEach((item) => {
        result += item.name + ','
    })
    return result
}


// iterate over all the keys in the object and return a key value pair in string
// reformat as {key:value,key:value}

export const reformatObjectToString = (object) => {
    let result = ''
    if (!object) return result;
    Object.keys(object).forEach((key) => {
        result += key + ':' + object[key] + ','
    })
    return result
}