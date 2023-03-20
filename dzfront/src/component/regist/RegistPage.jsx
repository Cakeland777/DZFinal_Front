import React,{useState} from 'react';
import EarnerGrid from './EarnerGrid';
import Registration from './Registration';

const RegistPage = () => {
    const [value,setValue]=useState('');
    const handleValueChange=(newValue)=>{
        setValue(newValue);
    }
    return (
        <div>
            <EarnerGrid value={value} onValueChange={handleValueChange}></EarnerGrid>
            <Registration value={value}></Registration>
        </div>
    );
};

export default RegistPage;