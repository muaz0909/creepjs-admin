import React from 'react';

function WebGLBasics(props) {
    const webGLBasics = props.userComponents?.webGlBasics || {};

    return (
        <div className="data my-3 py-5 px-5">
            <div className="row">
                <div className="col-6">
                    <strong>WebGL Basics</strong>
                    <div>Version: {webGLBasics.value?.version}</div>
                    <div>Renderer: {webGLBasics.value?.renderer}</div>
                    <div>Shading Language Version: {webGLBasics.value?.shadingLanguageVersion}</div>
                    <div>Vendor: {webGLBasics.value?.vendor}</div>
                    <div>Duration: {webGLBasics.duration}</div>
                </div>
            </div>
        </div>
    );
}

export default WebGLBasics;
