import React, {useEffect} from 'react';
import {getBrowserInfo} from "../constants/constants.js";

function BasicInfo(props) {
    let browserName  = navigator.appName;
    const [browser, setBrowser] = React.useState(browserName);
    useEffect(() => {
        setBrowser(getBrowserInfo())
    }, []);


    return (
        <div class="data my-3 py-5 px-5">
            <div class="row">
                <div class="col-6">
                    <strong>Basic Info</strong>
                    <div>Browser : {browser}</div>
                    <div>applePay: {props.userComponents?.applePay?.value}</div>
                    <div>Platform: {props.userComponents?.platform?.value}</div>
                    <div>Timezone: {props.userComponents?.timezone?.value}</div>
                </div>
            </div>
        </div>
    );
}

export default BasicInfo;
