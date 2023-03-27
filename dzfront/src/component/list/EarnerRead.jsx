import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer
} from "react";
import { FaFile } from 'react-icons/fa';
import { BiCalendar } from "react-icons/bi";
import { Link } from "react-router-dom";
import { render } from "react-dom";
import ReactModal from "react-modal";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker from "react-datepicker";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    width:'1000px',
    height:'600px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const EarnerColumn = [
  { headerName: "Code", field: "earner_code",width:150 },
  { headerName: "소득자명", field: "earner_name", width:160 },
  { headerName: "내/외", field: "is_native", width:80 },
  { headerName: "주민등록번호", field: "personal_no", width:160 },
  { headerName: "소득구분명", field: "div_name", width:120 },
  { headerName: "구분코드", field: "div_code", width:130 },
];
const EarnerRead = () => {
  useEffect(() => {
    fetch('http://localhost:8080/input/earner_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        worker_id: 'yuchan2',
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
      setEarnerRowData(data.earner_list);
    
    }
      

      );
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState("");
  const [EarnerRowData, setEarnerRowData] = useState();
  const gridRef = useRef();

  const columnDefs =[
    { field: "earner_name", headerName: "소득자명", resizable: true },
    {
      field: "personal_no",
      headerName: "주민(외국인)등록번호",
      resizable: true,
    },
    { field: "div_name", headerName: "소득구분", resizable: true },
    { field: "accrual_ym", headerName: "귀속년월", resizable: true },
    { field: "payment_ym", headerName: "지급년월일", resizable: true },

    { field: "total_payment", headerName: "지급액", resizable: true },
    { field: "tax_rate", headerName: "세율(%)", resizable: true },
    { field: "tuition_amount", headerName: "학자금상환액", resizable: true },
    { field: "tax_income", headerName: "소득세", resizable: true },
    { field: "tax_local", headerName: "지방소득세", resizable: true },
    { field: "artist_cost", headerName: "예술인경비", resizable: true },
    { field: "ins_cost", headerName: "고용보험료", resizable: true },
    { field: "real_payment", headerName: "차인지급액", resizable: true },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));
 
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const [selectedOption, setSelectedOption] = useState("accrual_ym");

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [selected, setSelected] = useState("earner_code");

  const [earner, setEarner] = useState("");
  function handleSelect(event) {
    setSelected(event.target.value);
  }



  function handleEarner(event) {
    setEarner(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`http://localhost:8080/search_earner_code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id:"yuchan2",
        read_by:selectedOption,
        start_date:parseInt(format(startDate, "yyyyMM")),
        code_name:"earner_code",
        end_date:parseInt(format(endDate, "yyyyMM")),
        code_value:earner,
        order_by:selected
      }),
    })
      .then(result => result.json())
      .then(rowData => {
        console.log(rowData);
        setRowData(rowData.earnerInfo);
      });
  }
  function reducer(state,action){
    return{
      ...state,
      [action.name]:action.value
    };
  }
  const [state,dispatch]=useReducer(reducer,{
    search_value:''
  });
  const{ search_value}=state;
  const onChange=(e)=>{
    dispatch(e.target);
    const { value } = e.target;
    if (value.trim() !== '') {
      fetch('http://localhost:8080/input/earner_search',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worker_id: 'yuchan2',
          search_value:value
        }),
      })
      .then(response=>response.json())
      .then((data) => {
        setEarnerRowData(data.earner_list)}
        

        )
    };
  };
  return (
    <div>
      <Link to="/earnerRead">소득자별</Link> |{" "}
      <Link to="/earnDivRead">소득구분별</Link>
      <form style={{ border: "1px solid black" ,marginBottom:'20px'}} onSubmit={handleSubmit}>
        기준
        <select value={selectedOption} onChange={handleChange}>
          <option value="accrual_ym">1.귀속년월</option>
          <option value="payment_ym">2.지급년월</option>
        </select>
        <div style={{ position: "relative", zIndex: 800 }}>
          <label>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy.MM"
              showMonthYearPicker
            />
          </label>
        </div>{" "}
        ~
        <div style={{ position: "relative", zIndex: 800 }}>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy.MM"
            showMonthYearPicker
          />
        </div>
        소득자<input onChange={handleEarner} onClick={() => setIsModalOpen(true)} value={earner} type="text"></input>
        정렬
        <select onChange={handleSelect} value={selected}>
          <option value="earner_code">1.소득자명순</option>
          <option value="div_name">2.소득구분순</option>
          <option value="payment_ym">3.지급년월순</option>
          <option value="personal_no">4.주민(사업자)번호순</option>
        </select>
        <button type="submit" style={{marginLeft:"650px"}}>조회</button>
      </form>
      <div
        className="ag-theme-alpine"
        style={{ width: 2000, height: 800, zIndex: -100 }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          overlayLoadingTemplate="<FaFile /><b>데이터가 없습니다.</b>"
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
        />
      </div>
      <ReactModal style={customStyles} isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} >
  {
    
    <>  
    <h4 >사업소득자 코드도움</h4>
    <div className="ag-theme-alpine" style={{ height: 400, width:'900px' }}>
        <AgGridReact
          columnDefs={EarnerColumn}
          rowData={EarnerRowData}
          rowSelection={'single'}
          
          ref={gridRef}/>
        </div>
       
    <>
     
    <div style={{textAlign:"center"}}> 
            
          찾을 내용 <input type="text" name="search_value" style={{width:"500px",borderColor:'skyblue',outline:'none'}}value={search_value} onChange={onChange}></input>
           <br/>
            <button onClick={()=>setIsModalOpen(false)}>취소</button>
           
            </div>
          </></>
          }
</ReactModal>
    </div>
    
  );
};
export default EarnerRead;
