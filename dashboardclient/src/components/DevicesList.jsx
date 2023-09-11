import React, { useEffect, useState } from 'react';

function DeviceCheck() {
    const [hasAudioDevice, setHasAudioDevice] = useState(false);
    const [hasVideoDevice, setHasVideoDevice] = useState(false);

    useEffect(() => {
        async function checkMediaDevices() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasAudio = devices.some((device) => device.kind === 'audioinput');
                const hasVideo = devices.some((device) => device.kind === 'videoinput');

                setHasAudioDevice(hasAudio);
                setHasVideoDevice(hasVideo);
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }
        }

        checkMediaDevices();
    }, []);

    return (
        <div class="data my-3 py-5 px-5">
            <div class="row">
                <div class="col-6">
                    <strong>Available Devices</strong>
                    {hasAudioDevice && <div>Audio device is available.</div>}
                    {hasVideoDevice && <div>Webcam (video) device is available.</div>}
                </div>
            </div>
        </div>
    );
}

export default DeviceCheck;