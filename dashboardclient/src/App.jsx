import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {useEffect, useState} from "react";
import {
    checkMediaDevices,
    db, getBrowserInfo,
    getIpInfo,
    reformatArrayOfObjectsToString,
    reformatArrayToString
} from "./constants/constants.js";
import LocationInfo from "./components/LocationInfo.jsx";
import Header from "./components/Header.jsx";
import {Container} from "reactstrap";
import BasicInfo from "./components/BasicInfo.jsx";
import ScreenInfo from "./components/ScreenInfo.jsx";
import WebGLBasics from "./components/WebGLBasics.jsx";
import WebGLExtensions from "./components/WebGLExtensions.jsx";
import DevicesList from "./components/DevicesList.jsx";
import Plugins from "./components/Plugins.jsx";
import {doc, setDoc} from "firebase/firestore";
import moment from "moment";


function App() {
    const [userHash, setUserHash] = useState(null);
    const [ipInfoCurrent,setIpInfoCurrent] = useState(null);
    const [fingerPrint, setFingerPrint] = useState(null);
    const [userComponents, setUserComponents] = useState(null);
    useEffect(() => {
            async function getUserHash() {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                setFingerPrint(result)
                setUserComponents(result?.components)
                console.log({
                    ...result
                })

                console.log("user Components : ", result?.components)
                const visitorId = result.visitorId;
                setUserHash(visitorId);

                const ipInfo = await getIpInfo();


                setIpInfoCurrent(ipInfo)

                const item = doc(db, "users", visitorId);
                const mediaDevices = await checkMediaDevices();
                const data = {
                    ...result, ...ipInfo, mediaDevices: mediaDevices
                }
                console.log("data : ", data)
                await setDoc(item, {
                    location: {...ipInfo}, visitorId: visitorId, userComponents: {
                        applePay: {...result?.components?.applePay},
                        architecture: {...result?.components?.architecture},
                        audio: {...result?.components?.audio},
                        canvas: {
                            value: {...result?.components?.canvas?.value}, duration: result?.components?.canvas?.duration,
                        },
                        colorDepth: {...result?.components?.colorDepth},
                        colorGamut: {...result?.components?.colorGamut},
                        contrast: {
                            value: result?.components?.contrast?.value ? result?.components?.contrast?.value : "Not Available",
                            duration: result?.components?.contrast?.duration,
                        },
                        cookiesEnabled: {
                            value: result?.components?.cookiesEnabled?.value ? result?.components?.cookiesEnabled?.value : "Not Available",
                            duration: result?.components?.cookiesEnabled?.duration,
                            cpuClass: {
                                value: result?.components?.cpuClass.value ? result?.components?.cpuClass.value : "Not Available",
                                duration: result?.components?.cpuClass.duration,
                            },
                            deviceMemory: {
                                value: result?.components?.deviceMemory?.value ? result?.components?.deviceMemory?.value : "Not Available",
                                duration: result?.components?.deviceMemory?.duration,
                            },
                            domBlockers: {
                                value: result?.components?.domBlockers?.value ? result?.components?.domBlockers?.value : "Not Available",
                                duration: result?.components?.domBlockers?.duration,
                            },
                            fontPreferences: {
                                value: {...result?.components?.fontPreferences?.value},
                                duration: result?.components?.fontPreferences?.duration,
                            },
                            fonts: {
                                value: reformatArrayToString(result?.components?.fonts?.value),
                                duration: result?.components?.fonts?.duration,
                            },
                            forcedColors: {...result?.components?.forcedColors},
                            hardwareConcurrency: {...result?.components?.hardwareConcurrency},
                            hdr: {...result?.components?.hdr},
                            indexedDb: {...result?.components?.indexedDB},
                            invertedColors: {
                                value: result?.components?.invertedColors?.value ? result?.components?.invertedColors?.value : "Not Available",
                                duration: result?.components?.invertedColors?.duration,
                            },
                            languages: {
                                value: reformatArrayToString(result?.components?.languages?.value),
                                duration: result?.components?.languages?.duration,
                            },
                            localStorage: {...result?.components?.localStorage},
                            math: {
                                value: {...result?.components?.math?.value}, duration: result?.components?.math?.duration,
                            },
                            monochrome: {...result?.components?.monochrome},
                            openDatabase: {...result?.components?.openDatabase},
                            osCPU: {
                                value: result?.components?.osCpu?.value ? result?.components?.osCpu?.value : "Not Available",
                                duration: result?.components?.osCpu?.duration,
                            },
                            pdfViewerEnabled: {...result?.components?.pdfViewerEnabled},
                            platform: {...result?.components?.platform},
                            plugins: {
                                value: reformatArrayOfObjectsToString(result?.components?.plugins?.value),
                                duration: result?.components?.plugins?.duration,
                            },
                            privateClickMeasurement: {
                                value: result?.components?.privateClickMeasurement?.value ? result?.components?.privateClickMeasurement?.value : "Not Available",
                                duration: result?.components?.privateClickMeasurement?.duration,
                            },
                            reducedMotion: {...result?.components?.reducedMotion},
                            screenFrame: {
                                value: reformatArrayToString(result?.components?.screenFrame?.value),
                                duration: result?.components?.screenFrame?.duration,
                            },
                            screenResolution: {
                                value: reformatArrayToString(result?.components?.screenResolution?.value),
                                duration: result?.components?.screenResolution?.duration,
                            },
                            sessionStorage: {...result?.components?.sessionStorage},
                            timezone: {
                                value: result?.components?.timezone?.value ? result?.components?.timezone?.value : "Not Available",
                                duration: result?.components?.timezone?.duration,
                            },
                            touchSupport: {
                                value: {...result?.components?.touchSupport?.value},
                                duration: result?.components?.touchSupport?.duration,
                            },
                            vendor: {...result?.components?.vendor},
                            vendorFlavors: {
                                value: reformatArrayToString(result?.components?.vendorFlavors?.value),
                                duration: result?.components?.vendorFlavors?.duration,
                            },
                            webGLBasics: {
                                value: {...result?.components?.webGlBasics?.value},
                                duration: result?.components?.webGlBasics?.duration,
                            },
                            webGLExtensions: {
                                value: {...result?.components?.webGlExtensions?.value},
                                duration: result?.components?.webGlExtensions?.duration,
                            }
                        },
                        devicesInfo: {
                            ...mediaDevices
                        }
                    },
                    browser: getBrowserInfo() ? getBrowserInfo() : "Not Available",
                    created_at: moment().unix(),
                    confidence: {
                        score: result?.confidence?.score, comment: result?.confidence?.comment,
                    },
                })
            }

            getUserHash().then(() => {
                console.log(getBrowserInfo())
            });
        }

        , [])


    return (<>
        <Container fluid>
            <Header fpId={fingerPrint?.visitorId}/>
            <BasicInfo
                userComponents={userComponents}
                fingerPrint={fingerPrint}
            />
            <ScreenInfo
             userComponents={userComponents}
            />
            <DevicesList/>

            <Plugins userComponents={userComponents}
            />
            <LocationInfo ipInfoCurrent={ipInfoCurrent}/>
            <WebGLBasics userComponents={userComponents}
            />
            <WebGLExtensions  userComponents={userComponents}
            />
        </Container>
    </>)
}

export default App
