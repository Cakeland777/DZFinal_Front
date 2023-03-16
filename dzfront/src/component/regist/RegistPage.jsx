import React from 'react';
import EarnerGrid from './EarnerGrid';
import Model from './Model';
import Registration from './Registration';

const RegistPage = () => {
    const model = Model('yuchan2');

    return (
        <div>
            <EarnerGrid model={model}></EarnerGrid>
            <Registration model={model}></Registration>
        </div>
    );
};

export default RegistPage;