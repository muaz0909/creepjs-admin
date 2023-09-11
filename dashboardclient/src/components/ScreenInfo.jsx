import React, { useEffect } from 'react';
import { reformatArrayToString } from '../constants/constants';


function ScreenInfo(props) {
    useEffect(() => {
        console.log("ScreenInfo : ", reformatArrayToString(props.userComponents?.screenFrame?.value));
    }, [])
    return (
        <div class="data my-3 py-5 px-5">
            <div class="row">
                <div class="col-6">
                    <strong>Screen</strong>
                    <div>ScreenFrame: {reformatArrayToString(props.userComponents?.screenFrame?.value)}</div>
                    <div>ScreenResolution: {props.userComponents?.screenResolution?.value}</div>
              
                </div>
            </div>
        </div>
    );
}

export default ScreenInfo;
