import React, { useState } from "react";
import "../public.css";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import FindAddr from "./FindAddr";





export default function Registration() {
   
  const [modalOpen, setModalOpen] = useState(false);

const openModal = () => {
  setModalOpen(true);
};
const closeModal = () => {
  setModalOpen(false);
};
  const Tab = [
    {
      title: "기본사항",
      content: <>거주구분 <input type={"text"} />
      <br/> 소득구분 <input type={"text"} /><br/>
      내/외국인 <input type={"text"} />
      <br/>
      <>
      <button onClick={openModal}>주소검색</button>
       
        <Modal open={modalOpen} close={closeModal} header="주소검색">
        
         
        </Modal>
      </>
      
      </>
  
    },
  
    {
      title: "예술인",
      content: <input type={"text"}/>
    }
  ];
  
  const useTab = (idx, Tabs) => {
    if (!Tabs || !Array.isArray(Tabs)) {
      return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentIdx, setCurrentIdx] = useState(idx);
    return {
      currentItem: Tabs[currentIdx],
      changeItem: setCurrentIdx
    };
  };
 
  const { currentItem, changeItem } = useTab(0, Tab);
  return (
    <div>
    
      <div >
        {Tab.map((e, index) => (
          <button key={index} onClick={e => changeItem(index)}>
            {e.title}
          </button>
        ))}
      </div>
      <h3>사업소득자등록</h3>
      <div>{currentItem.content}</div>
    </div>
  );
}