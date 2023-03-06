import React, { useState } from "react";
import "../public.css";
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
      content: <>
      <h3>소득자 등록</h3>

      거주구분 <select>
      <option value="value1" name="residence_status">0.거주</option>
      <option value="value2" name="residence_status">1.비거주</option>
      </select>
       
      <br/> 소득구분 <input type={"text"} value="배우" /><br/>
      내/외국인 <select>
      <option value="value1" name="is_native">0.내국인</option>
      <option value="value2" name="is_native">1.외국인</option>
      </select>
      <br/> 주민(외국인)등록번호 <input type={"text"} name="personal_no"/><br/>
      <br/> 주소 <input type={"text"} name="address1" size="4" maxlength="4"/> 
                 <input type={"text"}name="address2" />
      <>
      <button onClick={openModal}>주소검색</button>
       
        <Modal open={modalOpen} close={closeModal} header="주소검색">
        
        </Modal>
      </>
      <br/><input type={"text"} name="address3"  /><br/>
      전화번호 <input type={"text"} name="tel1" size="2" maxlength="2"/>-
              <input type={"text"} name="tel2" size="3" maxlength="3"/>-
              <input type={"text"} name="tel3" size="4" maxlength="4"/><br/>

      핸드폰번호 <input type={"text"} name="phone1" size="3" maxlength="3"/>-
              <input type={"text"} name="phone2" size="4" maxlength="4"/>-
              <input type={"text"} name="phone3" size="4" maxlength="4"/><br/>

      이메일 <input type={"text"} name="email" /><br/>

      학자금상환공제자여부 <select>
      <option value="value1" name="is_tuition">0.여</option>
      <option value="value2" name="is_tuition">1.부</option>
      </select>
      <br/> 학자금상환공제액<input type={"text"} name="deduction_amount" />원
      <br/> 비고<input type={"text"} name="etc" />
      </>
  
    },
  
    {
      title: "예술인",
      content:    <><h3>예술인 해당 사업소득자 등록</h3>
     예술인여부 <select>
  <option value="value1" name="is_artist">0.부</option>
  <option value="value2" name="is_artist">1.여</option>
  </select>

  <br/> 예술인유형 <select>
  <option value="value1" name="artist_type">1.일반예술인</option>
  </select>

  <br/> 예술인 고용보험 경감 <select>
  <option value="value1" name="ins_reduce">0.0</option>
  <option value="value2" name="ins_reduce">1.80</option>
  </select>

      </>
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
   
      <div>{currentItem.content}</div>
    </div>
  );
}