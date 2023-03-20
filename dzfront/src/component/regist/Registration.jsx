import React, {useEffect,useRef, useState,useReducer,useCallback} from "react";
import DaumPostcode from "react-daum-postcode";
import '../../css/registration.css';
import EarnerGrid from "./EarnerGrid";
import { AgGridReact,AgGridColumn } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal, { contextType } from "react-modal";

const  Registration=(props)=>{

  const [preCode,setPreCode]=useState(props.value);
  const [earner,setEarner]=useState('');
  useEffect(()=>{
    if(preCode!==props.value){
      fetch('http://localhost:8080/regist/get_earner',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id:"yuchan2",
          earner_code: props.value
        }),
      })
      .then(result => result.json())
      .then(data => {
        
        setEarner(data.earner_info);
        
      });
    
    }
    setPreCode(props.value);
  },[props.value, preCode, earner])
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code",width:180 },
    { headerName: "소득구분명", field: "div_name", width:160 },
              
  ];
  const [divRowData, setDivRowData] = useState();
  const onGridReady = useCallback((params) => {
    fetch('http://localhost:8080/regist/list_divcode')
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);
  const [rowData, setRowData] = useState([{ code:"", name: "", personal_no: "", div:""}]);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [PostModalOpen,setPostModalOpen]=useState(false);
  const[selectValue, setSelectValue]=useState("");
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
    document.querySelector('#div_name').innerHTML =
      selectedRows.length === 1 ? selectedRows[0].div_code : '';
      
  }, []);
  const gridRef = useRef();
 
  const handlePostcode = (data) => {
    setPostcode(data.zonecode);
    setAddress(`${data.address} ${data.buildingName}`);
    setPostModalOpen(false);
  };

  const handlePostcodeClick = () => {
    setPostModalOpen(true);
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
  personal_no:'',
  tel1:'',tel2:'',tel3:'',
  phone1:'',phone2:'',phone3:'',
  email1:'',email2:'',
  deduction_amount:'',
  etc:'',
  artist_type:'',
  ins_reduce:'',
});
const{ residenceSelect,
  div,
  isNative,
  personal_no,
  tel1,tel2,tel3,
  phone1,phone2,phone3,
  email1,email2,
  deduction_amount,
  etc,
  artist_type,
  ins_reduce}=state;
  const [ isTuition, setIsTuition] = useState('');
  const [inputEnabledT, setInputEnabledT] = useState(false);
  const [ isArtist, setIsArtist] = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);

  function handleArtistChange(event) {
    const value = event.target.value;
    setIsArtist(value);
    setInputEnabled(value === 'Y');
  }
  function handleTuitionChange(event) {
    const value = event.target.value;
    setIsTuition(value);
    setInputEnabledT(value === 'Y');
  }
const onChange=e=>{dispatch(e.target);
  const { name, value } = e.target;
  if (value.trim() !== '') {
    fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: value,
        param_name:name,
        worker_id:"yuchan2",
        earner_code:props.value
      
      }),
    })  
    .then((response) => response.json())
      .catch((error) => {
        // handle error
      });
  }
};
const selectDivCode=()=>{

   

}
const handleBlur = (event) => {
  const { name, value } = event.target;
  if (value.trim() !== '') {
    fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: value,
        param_name :name,
        worker_id:"yuchan2",
        earner_code:props.value
      
      }),
    })
      .then((response) => {
    
      })
      .catch((error) => {
    
      });
  }
};
const handleClick = () => {
  setIsModalOpen(true);
};
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const customPostStyles = {
  content: {
    top: '50%',
    left: '50%',
    width:'700px',
   height:'500px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
  const Tab = [
    {
      title: "기본사항",
      content: <>
      <h3>소득자 등록</h3>
      <div style={{border:"1px solid black"}}>
      거주구분 <select value={residenceSelect} name="residence_status" onBlur={handleBlur} onChange={onChange} readOnly disabled> 
      <option value="거주" >0.거주</option>
      <option value="비거주">1.비거주</option>
      </select>
       
      <br/> 소득구분 <input type="text"  id="div_name" name= "div_name"value={div} onBlur={handleBlur} onChange={onChange} onClick={handleClick} /><br/>
      내/외국인 <select value={isNative} name="is_native" onBlur={handleBlur} onChange={onChange}>
      <option value="내" >0.내국인</option>
      <option value="외">1.외국인</option>
      </select>
      <br/> 주민(외국인)등록번호 <input type="text" onChange={onChange} value={personal_no} name="personal_no" onBlur={handleBlur}/><br/>
      <br/>   <div className="address-form">
      <div>
        <label>우편번호</label>
        <input type="text" name="zipcode"value={postcode}  onBlur={handleBlur} readOnly />
        <button onClick={handlePostcodeClick}>주소 검색</button>
      </div>
      <div>
        <label>주소</label>
        <input type="text"name="address" value={address} readOnly />
      </div>
      <div>
        <label>상세주소</label>
        <input type="text" name="address_detail" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} onBlur={handleBlur}
        />
      </div>
      <ReactModal style={customPostStyles} isOpen={PostModalOpen} onRequestClose={() => setPostModalOpen(false)} >
  {
    
    <>  
   <DaumPostcode onComplete={handlePostcode} autoClose={true}
    
        className="daum-postcode"
      />
       
   </>
          }
</ReactModal>
    </div>
      전화번호 <input type="text" name="tel1" onBlur={handleBlur} onChange={onChange} value={tel1}  size="3" maxlength="3"/>-
              <input type="text" name="tel2" onBlur={handleBlur} onChange={onChange} value={tel2}  size="4" maxlength="4"/>-
              <input type="text" name="tel3"  onBlur={handleBlur} onChange={onChange} value={tel3}  size="4" maxlength="4"/><br/>
      핸드폰번호 <input type="text" name="phone1" onBlur={handleBlur} onChange={onChange} value={phone1} size="3" maxlength="3"/>-
              <input type="text" name="phone2" onBlur={handleBlur} onChange={onChange} value={phone2}size="4" maxlength="4"/>-
              <input type="text" name="phone3" onBlur={handleBlur} onChange={onChange} value={phone3}size="4" maxlength="4"/><br/>
      이메일 <input type="text" name="email1" onBlur={handleBlur} onChange={onChange} value={email1} />@
      <input type="text" name="email2" onBlur={handleBlur} onChange={onChange} value={email2} /><br/>
      학자금상환공제자여부 <select name="is_tuition" value={isTuition} onBlur={handleBlur} onChange={handleTuitionChange} >
      <option value="N" >0.부</option>
      <option value="Y" >1.여</option>
      </select>
      <br/> 학자금상환공제액<input type="number" name="deduction_amount" value={deduction_amount} onBlur={handleBlur} onChange={onChange}  disabled={!inputEnabledT}  />원
      <br/> 비고<input type="text" name="etc" value={etc} onBlur={handleBlur} onChange={onChange}  />
      </div>
      </>
    },
  
    {
      title: "예술인",
      content:    <><h3>예술인 해당 사업소득자 등록</h3>
      <div style={{border:"1px solid black"}}>
     예술인여부 <select name="is_artist" value={isArtist} onBlur={handleBlur} onChange={handleArtistChange}>
  <option value="N" >0.부</option>
  <option value="Y" >1.여</option>
  </select>

  <br/> 예술인유형 <select name="artist_type" value={artist_type} disabled={!inputEnabled} onBlur={handleBlur} onChange={onChange}>
  <option value=""> </option>
  <option value="일반" >1.일반예술인</option>
  </select>

  <br/> 예술인 고용보험 경감 <select name="ins_reduce" value={ins_reduce} disabled={!inputEnabled}  onBlur={handleBlur}onChange={onChange}  >
  <option value=""> </option>
  <option value="0" >0.0</option>
  <option value="0.8" >1.80</option>
  </select>

  <p style={{color:"blue"}}>※고용보험료를 징수하는 예술인일 경우 예술인 여부를 '여' 체크합니다.</p>
  </div>
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
      <div style={{float:"left" ,marginLeft:"50px"}}>
        {Tab.map((e, index) => (
          <button key={index} onClick={e => changeItem(index)}>
            {e.title}
          </button>
        ))}
     {currentItem.content}</div>
     <ReactModal style={customStyles} isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} >
  {
    
    <>  
    <h4>소득구분코드 도움</h4>
    <div className="ag-theme-alpine" style={{ float:"left" ,height: 400, width: 400 }}>
        <AgGridReact
          columnDefs={divColumn}
          rowData={divRowData}
          onGridReady={onGridReady}
          rowSelection={'single'}
          onCellDoubleClicked
          onSelectionChanged={onSelectionChanged}
          
          ref={gridRef}

        />
        </div>
       
    <>
    <br/>   <div style={{textAlign:"center"}}>
    <h5>선택 코드: {selectValue.div_code}</h5>
    <h5>구분명:{selectValue.div_name}</h5>
            <button onClick={{}}>확인</button>
            <button onClick={()=>setIsModalOpen(false)}>취소</button>
            </div>
          </></>
          }
</ReactModal>;
     <p>{props.value}</p>
    </div>
  );
}


export default Registration;