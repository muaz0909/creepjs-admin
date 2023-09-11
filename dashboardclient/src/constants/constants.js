import axios from 'axios'
import {initializeApp} from 'firebase/app'
import {getFirestore } from 'firebase/firestore'

export const getIpInfo = async () => {
    return axios.get('https://ipinfo.io?token=e5cc45f901573f').then((res) => {
        return res.data
    })
}

const firebaseConfig = {
    apiKey: "AIzaSyABUaQwEDbCHLuYB-1w_FRyK76Em49YXHQ",
    authDomain: "creepjs-admin-staging.firebaseapp.com",
    projectId: "creepjs-admin-staging",
    storageBucket: "creepjs-admin-staging.appspot.com",
    messagingSenderId: "982086444148",
    appId: "1:982086444148:web:5f2947b1e0cc6e28861d21"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)



export const reformatArrayToString = (elements) => {
    // console.log(array);
    let result = ''
    if(!elements) return result;
    elements.forEach((item) => {
        result += item + ','
    })
    console.log(result,elements)
    return result
}

export const reformatArrayOfObjectsToString = (elements) => {
    let result = ''
    if(elements.length === 0) return result;

    elements.forEach((item) => {
        result += item.name + ','
    })
    return result
}


export const  checkMediaDevices= async ()=> {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudio = devices.some((device) => device.kind === 'audioinput');
        const hasVideo = devices.some((device) => device.kind === 'videoinput');
        return {
            hasAudio:hasAudio,hasVideo:hasVideo
        }
    } catch (error) {
        console.error('Error enumerating devices:', error);
    }
}
