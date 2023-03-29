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
           <div style={{padding:"50px"}}>
            <EarnerGrid value={value} onValueChange={handleValueChange}></EarnerGrid>
            
            <Registration value={value}></Registration>
            </div>
        </div>
    );
};

export default RegistPage;