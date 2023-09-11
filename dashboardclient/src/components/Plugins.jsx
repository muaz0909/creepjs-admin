import React from 'react';

function Plugins(props) {
    const { userComponents } = props;
    const pluginsValue = userComponents?.plugins?.value || [];

    return (
        <div class="data my-3 py-5 px-5">
            <div class="row">
                <div class="col-6">
                    <strong>Plugins</strong>
                    <ul>
                        {pluginsValue.map((plugin, index) => (
                            <li key={index}>{plugin.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Plugins;
