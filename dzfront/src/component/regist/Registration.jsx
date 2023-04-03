import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import ReactModal from "react-modal";
import '../../css/registration.css';

const  Registration=(props)=>{

  const [preCode,setPreCode]=useState(props.value||"");
  const [earner,setEarner]=useState({});
  const info =useRef();
  useEffect(()=>{
    console.log(props.value);
    if(preCode!==props.value&&props.value!==""){
      fetch('http://localhost:8080/regist/get_earner',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id:localStorage.getItem("worker_id"),
          earner_code: props.value
        }),
      })
      .then(result => result.json())
      .then(data => {
        info.current=data.earner_info;
        setEarner(data.earner_info);
        console.log("데이터가져옴:",data.earner_info);
       console.log("ref", info.current);
       document.querySelector("#div_name").value = (info.current && info.current.div_name) || "";
       document.querySelector("#residence_status").value = (info.current && info.current.residence_status) || "";
       document.querySelector("#is_native").value = (info.current && info.current.is_native) || "";
       document.querySelector("#personal_no").value = (info.current && info.current.personal_no) || "";
       document.querySelector("#email1").value = (info.current && info.current.email1) || "";
       document.querySelector("#email2").value = (info.current && info.current.email2) || "";
    
       document.querySelector("#etc").value = info.current && info.current.etc ? info.current.etc : "";       
       document.querySelector("#address_detail").value = (data.earner_info && data.earner_info.address_detail) || "";
       document.querySelector("#is_tuition").value = (info.current && info.current.is_tuition) || "";
       document.querySelector("#is_artist").value = (info.current && info.current.is_artist) || "";
       document.querySelector("#artist_type").value = (info.current && info.current.artist_type) || "";
       document.querySelector("#occupation_code").value = (info.current && info.current.occupation_code) || "";
       document.querySelector("#rate_coefficient").value = (info.current && info.current.rate_coefficient) || "";
       document.querySelector("#sworker_reduce").value = (info.current && info.current.sworker_reduce) || "";
       document.querySelector("#workinjury_reduce").value = (info.current && info.current.workinjury_reduce) || "";
       
        
      });
    
    }

    else{
        setEarner({});

    }
    setPreCode(props.value);
  },[props.value, preCode])
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code",width:180 },
    { headerName: "소득구분명", field: "div_name", width:160 },
              
  ];
  const specialColumn=[
    { headerName: "Code", field: "occupation_code",width:80 },
    { headerName: "업종", field: "occupation_name", width:150 },
    { headerName: "경비공제율\n(~22.06)", field: "deduction_rate_before_2207", width:100 },
    { headerName: "경비공제율\n(~22.07)", field: "deduction_rate_after_2207", width:100 },
    { headerName: "고용정액\n(~22.06)", field: "fixed_amount_before_2207", width:100 },
    { headerName: "고용정액\n(~22.07)", field: "fixed_amount_after_2207", width:100 },
    { headerName: "산재보수\n(~22.06)", field: "workinjury_compensation_before_2207", width:100 },
    { headerName: "산재보수\n(~22.07)", field: "workinjury_compensation_after_2207", width:100 },

  ]
  const [specialRowData,setSpecialRowData]= useState();
  const [divRowData, setDivRowData] = useState();
  const onGridReady = useCallback((params) => {
    fetch('http://localhost:8080/regist/list_divcode')
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [PostModalOpen,setPostModalOpen]=useState(false);
  const [specialModalOpen,setSpecialModalOpen] =useState(false);
  
  const gridRef = useRef();
 
  const handlePostcode = (data) => {
    setEarner({...earner, zipcode : data.zonecode,address:`${data.address} ${data.buildingName}`});
    document.querySelector("#zipcode").value =  data.zonecode;     
    document.querySelector("#address").value = `${data.address} ${data.buildingName}`;
    fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: data.zonecode,
        param_name: "zipcode",
        worker_id:localStorage.getItem("worker_id"),
        earner_code:props.value
      
      }),
    })  
    .then( fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: `${data.address} ${data.buildingName}`,
        param_name: "address",
        worker_id:localStorage.getItem("worker_id"),
        earner_code:props.value
      
      }),
    })  
    .then(response => response.json()))
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
const earnerInfo = {
  residence_status: '',
  div: '',
  isNative: '',
  personal_no: '',
  tel1: '',
  tel2: '',
  tel3: '',
  phone1: '',
  phone2: '',
  phone3: '',
  email1: '',
  email2: '',
  deduction_amount: '',
  etc: '',
  artist_type: '',
  ins_reduce: ''
};
const [state,dispatch]=useReducer(reducer,earnerInfo);
const{residence_status,
div,
isNative,
personal_no,
tel1,
tel2,
tel3,
phone1,
phone2,
phone3,
email1,
email2,
deduction_amount,
etc,
artist_type,
ins_reduce}=state;
  const [ isTuition, setIsTuition] = useState('');
  const [inputEnabledT, setInputEnabledT] = useState(false);
  const [ isArtist, setIsArtist] = useState('');
  const [inputEnabled, setInputEnabled] = useState(earner.is_artist === "Y");
  const [specialEnabled,setSpecialEnabled] = useState(false);
  

  function onArtistChange(event) {
    const value = event.target.value;
    setIsArtist(value);


    setInputEnabled(value === 'Y');
  }
  function handleTuitionChange(event) {
    const value = event.target.value;
    setIsTuition(value);
    setInputEnabledT(value === 'Y');
  }
const onChange=e=>{
  
  dispatch(e.target);
  const { name, value } = e.target;
 if(name==="is_artist"){
  setIsArtist(value);
  setInputEnabled(value === 'Y');
  
 }
    fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: value,
        param_name:name,
        worker_id:localStorage.getItem("worker_id"),
        earner_code:props.value
      
      }),
    })  
    .then(response => response.json())
    .then(jsonData => {
      setEarner({...earner, [name] : value });


      
    })
      
};

const handleBlur = (event) => {
  const { name, value } = event.target;

    fetch('http://localhost:8080/regist/earner_update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        param_value: value,
        param_name :name,
        worker_id:localStorage.getItem("worker_id"),
        earner_code:props.value
      }),
    })
      .then((response) => {
    
      })
      .then(jsonData => {
        setEarner({...earner, [name] : value });
   
  
      })
      .catch((error) => {
    
      });
    
  
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
    width:'800px',
   height:'600px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const specialStyles={
  content:{
  top: '50%',
    left: '50%',
    width:'800px',
   height:'700px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }

}
  const Tab = [
    {
      title: "기본사항",
      content: <>
      <h3>소득자 등록</h3>
  
        <div style={{width:"1000px",float:"left"}}>
      <table >
        <tbody>
        <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>거주구분</td>
<td style={{textAlign:"left"}}><select  id="residence_status" name="residence_status" onBlur={handleBlur} onChange={onChange} readOnly disabled> 
      <option value="거주" >0.거주</option>
      <option value="비거주">1.비거주</option>
      </select></td>
        </tr>
        <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>소득구분</td>
<td style={{textAlign:"left"}}> <input type="text"  id="div_name" name= "div_name" onBlur={handleBlur} onChange={onChange}/><br/>
</td>
        </tr>
        <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>내/외국인</td>
<td style={{textAlign:"left"}}><select  name="is_native" id ="is_native" onBlur={handleBlur} onChange={onChange}>
      <option value="내" >0.내국인</option>
      <option value="외">1.외국인</option>
      </select></td>
        </tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>주민(외국인)등록번호</td>
  <td style={{textAlign:"left"}}> <input type="text" onChange={onChange}  name="personal_no" id="personal_no" onBlur={handleBlur} />
</td>
</tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>우편번호</td>
  <td colSpan={2} style={{textAlign:"left"}}> <input type="text" name="zipcode" id="zipcode" value={earner.zipcode||""} />
  <button onClick={handlePostcodeClick}>주소 검색</button>
</td>

</tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>주소</td>
  <td style={{textAlign:"left"}}>  <input type="text" name="address" id="address" value={earner.address||""} />
</td>
</tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>상세주소</td>
<td style={{textAlign:"left"}}> <input type="text" name="address_detail" id="address_detail"  onChange={onChange} onBlur={handleBlur}/></td>
</tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>전화번호</td>
<td style={{textAlign:"left"}} colSpan={3}>
<input type="text" name="tel1" id="tel1" onBlur={handleBlur} onChange={onChange} value={earner.tel1||''} style={{width:"40px"}} size="3"maxLength="3"/>-
<input type="text" name="tel2" id="tel2" onBlur={handleBlur} onChange={onChange}   value={earner.tel2||''}  style={{width:"40px"}} size="4" maxLength="4"/>-
 <input type="text" name="tel3" id="tel3" onBlur={handleBlur} onChange={onChange}   value={earner.tel3||''}   style={{width:"40px"}} size="4" maxLength="4"/>

</td>
</tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>핸드폰번호 </td>
  <td style={{textAlign:"left"}} colSpan={3}>
    <input type="number" name="phone1" id="phone1" onBlur={handleBlur} onChange={onChange}  value={earner.phone1||''} style={{width:"40px"}} size="3" maxLength="3"/>-
<input type="number" name="phone2" id="phone2" onBlur={handleBlur} onChange={onChange}   value={earner.phone2||''} style={{width:"40px"}} size="4" maxLength="4"/>-
  <input type="number" name="phone3" id="phone3" onBlur={handleBlur} onChange={onChange}  value={earner.phone3||''} style={{width:"40px"}} size="4" maxLength="4"/></td>
</tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>이메일</td>
<td style={{textAlign:"left"}} colSpan={2}><input type="text" name="email1" id="email1"  value={earner.email1||''} onBlur={handleBlur} onChange={onChange}  />@
      <input type="text" name="email2" onBlur={handleBlur} onChange={onChange}  value={earner.email2||''} /></td>

</tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>학자금상환공제자여부</td>
<td style={{textAlign:"left"}}><select name="is_tuition" id="is_tuition"  onBlur={handleBlur} onChange={onChange} >
      <option value="N" >0.부</option>
      <option value="Y" >1.여</option>
      </select></td>
</tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>학자금상환공제액</td>
  <td style={{textAlign:"left"}}><input type="number" id="deduction_amount" name="deduction_amount"  onBlur={handleBlur} onChange={onChange}  disabled={!inputEnabledT}  />원
</td>
</tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>비고</td>
  <td style={{textAlign:"left"}}><input type="text" name="etc" id="etc" onBlur={handleBlur} onChange={onChange}  /></td>
  </tr>
        </tbody></table>
  
  
      <ReactModal style={customPostStyles} isOpen={PostModalOpen} onRequestClose={() => setPostModalOpen(false)} > 
      {
        <>
   <DaumPostcode onComplete={handlePostcode} autoClose={true} className="daum-postcode" style={{height:500,marginTop:50}}/>  
   </>
      }    
</ReactModal>
    </div>
   
      </>
    },
  
    {
      title: "예술/노무(특고) 등록",
      content:    <><h3>예술인 해당 사업소득자 등록</h3>
      <div style={{width:"1000px"}}>
      <table >
        <tbody>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 예술인여부</td>
<td style={{textAlign:"left"}}><select name="is_artist" id="is_artist"  onBlur={handleBlur} onChange={onChange} value={earner.is_artist} >
  <option value="N" >0.부</option>
  <option value="Y" >1.여</option>
  </select></td></tr>
  <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 예술인유형</td>
<td style={{textAlign:"left"}}><select name="artist_type" id="artist_type"  value={earner.artist_type} disabled={!inputEnabled} onBlur={handleBlur} onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="일반" >1.일반예술인</option>
  <option value="단기" >2.단기예술인</option>
  </select></td></tr>
  <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 예술인 고용보험 경감</td>
<td style={{textAlign:"left"}}><select name="ins_reduce" id="ins_reduce"  disabled={!inputEnabled}  onBlur={handleBlur}onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="0" >0.0</option>
  <option value="0.8" >1.80</option>
  </select></td></tr>

      </tbody></table>
  <p style={{color:"blue"}}>※고용보험료를 징수하는 예술인일 경우 예술인 여부를 '여' 체크합니다.</p>
  </div>
  <h3>노무제공자(특고) 해당 사업소득자 등록</h3>
      <div style={{width:"1000px"}}>
      <table >
        <tbody>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 노무제공자(특수형태근로자)여부</td>
<td style={{textAlign:"left"}}><select name="is_sworker" id="is_sworker"  onBlur={handleBlur} onChange={onChange}>
  <option value="N" >0.부</option>
  <option value="Y" >1.여</option>
  </select></td></tr>
  <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 특고인유형</td>
<td style={{textAlign:"left"}} colSpan={3}><select name="sworker_type" id="sworker_type"  disabled={!inputEnabled} onBlur={handleBlur} onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="일반" >1.일반특고인</option>
  <option value="단기" >2.단기특고인</option>
  </select>
  고용보험 여부
  <select name="sworker_type" id="sworker_type"  disabled={!inputEnabled} onBlur={handleBlur} onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="N" >0.부</option>
  <option value="Y" >1.여</option>
  </select>
 
  
  </td></tr>
  <tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 특고직종코드</td>
<td style={{textAlign:"left"}}><input type="text" name="occupation_code" id="occupation_code" readOnly onClick={()=>setSpecialModalOpen(true)}></input>
</td></tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 경비공제율</td>
<td style={{textAlign:"left"}} colspan={4}>
2022.07이전<input type="text" style={{width:"30px"}}/> 2022.07이후 <input type="text" style={{width:"30px"}}/>
</td></tr>
<tr>
<td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 특고인 고용보험 경감 </td>
<td style={{textAlign:"left"}} >
<select name="sworker_reduce" id="sworker_reduce"  disabled={!inputEnabled}  onBlur={handleBlur}onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="0" >0.0</option>
  <option value="0.8" >1.80</option>
  </select></td></tr>
  <tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}> 산재기준보수월액 </td>
<td style={{textAlign:"left"}} >
2022.07이전<input type="text"/></td></tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7"}}> </td>
<td style={{textAlign:"left"}} colspan={2} >
2022.07이후<input type="text" style={{width:"30px"}}/>
요율 <input type="text" style={{width:"30px"}}/>%</td></tr>
<tr>
  <td style={{textAlign:"right",backgroundColor:"#F7F7F7",fontWeight:"bold"}}>산재보험 경감 </td>
<td style={{textAlign:"left"}} colspan={2} >
<select name="workinjury_reduce" id="workinjury_reduce"  disabled={!inputEnabled}  onBlur={handleBlur}onChange={onChange} defaultValue={""}>
  <option value=""> </option>
  <option value="0" >0.0</option>
  <option value="0.8" >1.80</option>
  </select></td></tr>
      </tbody></table>
   

  <p style={{color:"red"}}>※산재보험은 사업주와 종사자가 1/2씩 부담합니다.</p>
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
      
      <div style={{float:"left" ,marginLeft:"50px",marginTop:'30px'}}>
        {Tab.map((e, index) => (
          <button key={index} onClick={e => changeItem(index)} style={{width:"170px"}}>
            {e.title}
          </button>
        ))}
     {currentItem.content}</div>
<ReactModal style={specialStyles} isOpen={specialModalOpen} onRequestClose={() => setSpecialModalOpen(false)} >
  {
    
    <>  
    <h4>특고 직종코드 코드도움</h4>
    <div className="ag-theme-alpine" style={{ float:"left" ,height: 500, width: 800 }}>
        <AgGridReact
          columnDefs={specialColumn}
          rowData={specialRowData}

        />
        </div>
       
    <>
    <br/>   <div style={{textAlign:"center"}}>
    찾을 내용
                  <input
                    type="text"
                    name="search_value"
                    style={{
                      width: "600px",
                      borderColor: "skyblue",
                      outline: "none",
                    }}
                    value={""}
                    onChange={onChange}
                  ></input>
                  <br />
    <button onClick={()=>setSpecialModalOpen(false)}>취소</button>
            <button onClick={{}}>확인</button>
            </div>
          </></>
          }
</ReactModal>
    </div>
  );
}


export default Registration;