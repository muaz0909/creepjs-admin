import React from 'react';

function BasicInfo(props) {
    return (
        <div class="data my-3 py-5 px-5">
            <div class="row">
                <div class="col-6">
                    <strong>Basic Info</strong>
                    <div>Confidence Score: {props.fingerPrint?.confidence?.score}</div>
                    <div>applePay: {props.userComponents?.applePay?.value}</div>
                    <div>Platform: {props.userComponents?.platform?.value}</div>
                    <div>Timezone: {props.userComponents?.timezone?.value}</div>
                </div>
            </div>
        </div>
    );
}

export default BasicInfo;
