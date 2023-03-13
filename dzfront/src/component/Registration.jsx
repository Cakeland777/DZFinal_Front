import React, {useEffect, useState,useReducer } from "react";
import DaumPostcode from "react-daum-postcode";
import '../css/registration.css';
import Test2 from "./test2";
import Modal from "./Modal";
import FindAddr from "./FindAddr";
import DivCodeModal from "./DivCodeModal";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import DivCodeButton from "./util/DivCodeButton";

const  Registration=()=>{


  const [rowData, setRowData] = useState([{ code:"", name: "", personal_no: "", div:""}]);

 
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const handlePostcode = (data) => {
    setPostcode(data.zonecode);
    setAddress(`${data.address} ${data.buildingName}`);
    setIsModalOpen(false);
  };

  const handlePostcodeClick = () => {
    setIsModalOpen(true);
  };
  const onCellEditingStopped = (event) => {
    const newData = [...rowData];
    const { rowIndex } = event;
    const isLastRow = rowIndex === rowData.length - 1;
    const isAllCellsFilled = event.columnApi.getColumns().every((col) => {
      const newValue = event.node.data[col.field];
      return newValue !== '';
    });
  
    if (isLastRow && isAllCellsFilled) {
      const emptyRow = {code:'' ,name: '', personal_no: '', div: '' };
      newData.push(emptyRow);
      setRowData(newData);
    }
  };
  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (value.trim() !== '') {
      fetch('http://localhost:8080/earner_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patch_value: value,
          patch_param :name,
          worker_id:localStorage.getItem("worker_id"),
          earner_code:"000001"
        
        }),
      })
        .then((response) => {
          // handle response
        })
        .catch((error) => {
          // handle error
        });
    }
  };
 

  // useEffect(() => {
  //   const sendToServer = async () => {
  //     try {
  //       const response = await fetch('https://example.com/data', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(rowData)
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   sendToServer();
  // }, [rowData]);
  const [modalOpen, setModalOpen] = useState(false);


  
const openModal = () => {
  setModalOpen(true);
};
const closeModal = () => {
  setModalOpen(false);
};

function reducer(state,action){
  return{
    ...state,
    [action.name]:action.value
  };
}
const [state,dispatch]=useReducer(reducer,{
  residenceSelect:'',
  div:'',
  isNative:'',
  personalNo:'',
  tel1:'',
  tel2:'',
  tel3:'',
  phone1:'',
  phone2:'',
  phone3:'',
  email:'',
  isTuition:'',
  deducation:'',
  etc:'',
  isArtist:'',
  artistType:'',
  insReduce:'',
});
const{ residenceSelect,
  div,
  isNative,
  personalNo,
  tel1,
  tel2,
  tel3,
  phone1,
  phone2,
  phone3,
  email,
  isTuition,
  deducation,
  etc,
  isArtist,
  artistType,
  insReduce}=state;
const onChange=e=>{dispatch(e.target);
  const { name, value } = e.target;
  if (value.trim() !== '') {
    fetch('http://localhost:8080/earner_update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patch_value: value,
        patch_param :name,
        worker_id:localStorage.getItem("worker_id"),
        earner_code:"000001"
      
      }),
    })
      .then((response) => {
        // handle response
      })
      .catch((error) => {
        // handle error
      });
  }
};

  const Tab = [
    {
      title: "기본사항",
      content: <>
      <h3>소득자 등록</h3>
      
      거주구분 <select value={residenceSelect} name="residence_status" onBlur={handleBlur} onChange={onChange} readOnly disabled> 
      <option value="거주" >0.거주</option>
      <option value="비거주">1.비거주</option>
      </select>
       
      <br/> 소득구분 <input type="text"  name= "div_name"value={div} onBlur={handleBlur} onChange={onChange} /><br/>
      내/외국인 <select value={isNative} name="is_native" onBlur={handleBlur} onChange={onChange}>
      <option value="내" >0.내국인</option>
      <option value="외">1.외국인</option>
      </select>
      <br/> 주민(외국인)등록번호 <input type="text" onChange={onChange} value={personalNo} name="personal_no" onBlur={handleBlur}/><br/>
      <br/>   <div className="address-form">
      <div>
        <label>우편번호</label>
        <input type="text" name="zipcode"value={postcode}  onBlur={handleBlur} readOnly />
        <button onClick={handlePostcodeClick}>주소 검색</button>
      </div>
      <div>
        <label>주소</label>
        <input type="text" value={address} readOnly />
      </div>
      <div>
        <label>상세주소</label>
        <input
          type="text"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <DaumPostcode
        onComplete={handlePostcode}
        autoClose={true}
        style={{
          display: isModalOpen ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        className="daum-postcode"
      />
    </div>
      <br/><input type={"text"} name="address3"  /><br/>
      전화번호 <input type="text" name="tel1" onBlur={handleBlur} onChange={onChange} value={tel1} size="3" maxlength="3"/>-
              <input type="text" name="tel2" onBlur={handleBlur} onChange={onChange} value={tel2}  size="4" maxlength="4"/>-
              <input type="text" name="tel3"  onBlur={handleBlur} onChange={onChange} value={tel3}  size="4" maxlength="4"/><br/>

      핸드폰번호 <input type="text" name="phone1" onBlur={handleBlur} onChange={onChange} value={phone1} size="3" maxlength="3"/>-
              <input type="text" name="phone2" onBlur={handleBlur} onChange={onChange} value={phone2}size="4" maxlength="4"/>-
              <input type="text" name="phone3" onBlur={handleBlur} onChange={onChange} value={phone3}size="4" maxlength="4"/><br/>

      이메일 <input type="email" name="email" onBlur={handleBlur} onChange={onChange} value={email} /><br/>

      학자금상환공제자여부 <select name="is_tuition" value={isTuition} onBlur={handleBlur} onChange={onChange} >
      <option value="Y" >0.여</option>
      <option value="N" >1.부</option>
      </select>
      <br/> 학자금상환공제액<input type="text" name="deduction_amount" value={deducation} onBlur={handleBlur} onChange={onChange}  disabled />원
      <br/> 비고<input type="text" name="etc" value={etc} onBlur={handleBlur} onChange={onChange}  />
      </>
  
    },
  
    {
      title: "예술인",
      content:    <><h3>예술인 해당 사업소득자 등록</h3>
     예술인여부 <select name="is_artist" value={isArtist} onBlur={handleBlur} onChange={onChange}>
  <option value="N" >0.부</option>
  <option value="Y" >1.여</option>
  </select>

  <br/> 예술인유형 <select name="artist_type" value={artistType}  onBlur={handleBlur} onChange={onChange}>
    
  <option value="일반" >1.일반예술인</option>
  </select>

  <br/> 예술인 고용보험 경감 <select name="ins_reduce" value={insReduce} onBlur={handleBlur}onChange={onChange} >
  <option value="0" >0.0</option>
  <option value="0.8" >1.80</option>
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
  const [code,setCode] = useState("");
  const handleInputChange = (inputValue) => {
    console.log(inputValue);
    setCode(inputValue);
    // 모달에서 입력한 값이 출력됩니다.
  }
  
  const { currentItem, changeItem } = useTab(0, Tab);
  return (  
    <div>
      <button onClick={openModal}>C</button>
       <DivCodeModal open={modalOpen} close={closeModal} onInputChange={handleInputChange} header="사업소득코드보기">   
       </DivCodeModal>
      {/* <div className="ag-theme-alpine" style={{ width:650, height: 800 ,float:"left"}}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellEditingStopped={onCellEditingStopped}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        suppressCellSelection={true}
        suppressKeyboardEvent={true}
      />
    </div> */}
    <Test2 ></Test2>
      <div style={{float:"left"}}>
        {Tab.map((e, index) => (
          <button key={index} onClick={e => changeItem(index)}>
            {e.title}
          </button>
        ))}
     {currentItem.content}</div>
    </div>
  );
}


export default Registration;