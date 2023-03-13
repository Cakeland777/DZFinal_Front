import React from 'react';
import { useState } from 'react';
import DivCodeModal from '../DivCodeModal';
const DivCodeButton = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [code,setCode] = useState("");

    const handleInputChange = (inputValue) => {
        console.log(inputValue);
        setCode(inputValue);
        // 모달에서 입력한 값이 출력됩니다.
      }
const openModal = () => {
  setModalOpen(true);
};
const closeModal = () => {
  setModalOpen(false);
};
    return (
        <div>
            <button onClick={openModal}>C</button>
       
       <DivCodeModal open={modalOpen} close={closeModal} onInputChange={handleInputChange}  header="사업소득코드보기">
      
       </DivCodeModal>
        </div>
    );
};

export default DivCodeButton;