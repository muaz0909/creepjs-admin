import React from 'react';

function WebGLExtensions(props) {
    const webGLExtensions = props.userComponents?.webGlExtensions || {};

    return (
        <div className="data my-3 py-5 px-5">
            <div className="row">
                <div className="col-6">
                    <strong>WebGL Extensions</strong>
                    {/* <div>Context Attributes:</div>
                    <ul>
                        {webGLExtensions.value?.contextAttributes.map((attribute, index) => (
                            <li key={index}>{attribute}</li>
                        ))}
                    </ul> */}
                    {/* <div>Parameters:</div> */}
                    {/* <ul>
                        {webGLExtensions.value?.parameters.map((parameter, index) => (
                            <li key={index}>{parameter}</li>
                        ))}
                    </ul>
                    <div>Shader Precisions:</div>
                    <ul>
                        {webGLExtensions.value?.shaderPrecisions.map((precision, index) => (
                            <li key={index}>{precision}</li>
                        ))}
                    </ul> */}
                    <div>Extensions:</div>
                    <ul>
                        {webGLExtensions.value?.extensions.map((extension, index) => (
                            <li key={index}>{extension}</li>
                        ))}
                    </ul>
                    
                    <div>Duration: {webGLExtensions.duration}</div>
                </div>
            </div>
        </div>
    );
}

export default WebGLExtensions;
