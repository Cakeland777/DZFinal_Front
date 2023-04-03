import React,{useState} from 'react';
import EarnerGrid from './EarnerGrid';
import Registration from './Registration';

const RegistPage = (props) => {
    const [value,setValue]=useState('');
    const handleValueChange=(newValue)=>{
        setValue(newValue);
    }
    props.setTitle("사업소득자등록");
    return (
        <div>
           <div style={{padding:"50px"}}>
            <EarnerGrid value={value} onValueChange={handleValueChange}></EarnerGrid>
            
            <Registration value={value} ></Registration>
            </div>
        </div>
    );
};

export default RegistPage;