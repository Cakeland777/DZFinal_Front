import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, { useMemo, useRef, useState,useCallback ,useReducer,useEffect} from 'react';
import '../../css/IncomeInput2.css';
import ReactModal from "react-modal";
import { AgGridReact } from 'ag-grid-react';
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
const IncomeInput2 = () => {
  registerLocale("ko", ko);
  const bottomData = [
    {
      귀속년월: '합계',
      지급년월일: '',
      지급총액: '2,000,000',
      세율: '',
      소득세: '60,000',
      지방소득세: '6,000',
      세액계: '66,000',
      예술인경비: '',
      고용보험료: '',
      차인지급액: '1,934,000'
    },
  ];
  const earnerGridRef = useRef();
  const [earnerData,setEarnerData]=useState([]);
    const EarnerColumn = [
      { headerName: "Code", field: "earner_code",width:150 },
      { headerName: "소득자명", field: "earner_name", width:160 },
      { headerName: "내/외", field: "is_native", width:80 },
      { headerName: "주민등록번호", field: "personal_no", width:160 },
      { headerName: "소득구분명", field: "div_name", width:120 },
      { headerName: "구분코드", field: "div_code", width:130 },
    ];
    
   
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
  const LeftColumnDefs = [ 
    {headerName:"V",checkboxSelection: true,width:45},
    //{ headerName: "Code", field: "earner_code",editable:true,width:90},
    { headerName: "소득자명", field: "earner_name", editable: true,width:100,onCellClicked: () => setIsModalOpen(true)},

    {
      headerName: "주민(외국인)번호",
      children: [
          { headerName: "구분",field: 'is_native' ,editable:true,width:70,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
              values: ['내','외'],}},
          { headerName: "번호",field: 'personal_no',width:130,editable:true,colspan:2},
      ]
  },
  {

    headerName: '소득구분',
    children: [
        { headerName: "구분코드",field: 'div_code' ,editable:true,width:90},
        { headerName: "구분명",field: 'div_name',width:100,editable:true,colspan:2},
    ]
},

    ];
  
    const gridRef = useRef();
    const [earnerList, setEarnerList] = useState(JSON.parse(localStorage.getItem('earnerList')) || []);
    const onEarnerGridReady = useCallback((params) => {
   
    if(localStorage.getItem('earnerList')!=null){
      fetch('http://localhost:8080/input/get_earners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worker_id: 'yuchan2',
          earner_codes: JSON.parse(localStorage.getItem('earnerList'))
        }),
      })
      .then(response=>response.json())
      .then((data) => {
        data.earner_list.push({});
        setEarnerData(...earnerData,data.earner_list)

      }
        
  
        )
    }
    else{
      console.log('비었음');
      setEarnerData(['']);
    }
  
    }, []);
    
    const EarnerModalDoubleClicked = useCallback(() => {
      const selectedRows = gridRef.current.api.getSelectedRows();
      const newEarnerList = earnerList.concat(selectedRows[0].earner_code);
      
      setEarnerList(newEarnerList);
      setIsModalOpen(false);
      console.log(newEarnerList);
      localStorage.setItem('earnerList', JSON.stringify(newEarnerList));
      onEarnerGridReady();
      //const{search_value}='';
        
   
    }, [earnerList]);

    const addEmptyRow = () => {
      setEarnerData((prevData) => [...prevData, {}]);
    };
  
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
      setEarnerRowData(data.earner_list)}
      

      );
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [EarnerRowData, setEarnerRowData] = useState();
  const topGrid = useRef(null);
  const bottomGrid = useRef(null);
  
  
  

  const defaultColDef = {
        editable: true,
         sortable: true,
         resizable: true,
         flex: 1,
         minWidth: 100,
    };
 
  const columnDefs = [
      { field: '귀속년월', width: 200 },
      { field: '지급년월일', width: 150 },
      { field: '지급총액', width: 150 },
      { field: '세율', width: 120 },
      { field: '소득세', width: 150 },
      { field: '지방소득세', width: 150 },
      { field: '세액계', width: 100 },
      { field: '예술인경비', width: 100 },
      { field: '고용보험료', width: 100 },
      { field: '차인지급액', width: 100 }
    ];

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
  function onCellClicked(event) {
    const selectedRow = event.data;
    console.log('Selected Row Data:', selectedRow);
  }

  const onEarnerGridSelection = useCallback(() => {
    const selectedEarnerRow = earnerGridRef.current.api.getSelectedRows();
    console.log(selectedEarnerRow[0]);
  
  }, []);

const [paymentDate, setPaymentDate] = useState("");
const dateSubmit = (event) => {
  event.preventDefault();
 setPaymentDate(parseInt(format(paymentDate, "yyyyMM")));
  console.log(paymentDate);
}

  return (
    <div id="container">
      <button>삭제</button>
         <div id="header" >
         <form style={{ padding: "10",border: "1px solid black"}} onSubmit={dateSubmit}>
          <span style={{width:"150px"}}>지급년월</span>
          <DatePicker
              selected={paymentDate}
              onChange={(date) => setPaymentDate(date)}
              dateFormat="yyyy.MM"
              showMonthYearPicker
              locale={'ko'}
            />
            <button type="submit"> 조회</button>
        </form>
   
          
      </div>

    <div id="content" >
      <div id="left">

      <div id="leftTop" className="ag-theme-alpine" style={{ 
        width: "600px",height:'700px'
        }}>
          <AgGridReact 
          columnDefs={LeftColumnDefs} 
          rowData={earnerData}
          onGridReady={onEarnerGridReady}
          suppressRowClickSelection = {true}
          rowSelection={'multiple'}
          onSelectionChanged={onEarnerGridSelection}
          onCellClicked={onCellClicked}
          ref={earnerGridRef}
          />
      </div>

      <div id="leftBottom">
      <table style={{ border: "1px solid black",width: "400px" }}>
        <thead>
        </thead>
        <tbody>
         <tr>
            <td rowSpan="8" >총 계</td>
         </tr>

          <tr>
            <th scope="row">인원[건수]</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">지급액</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">학자금상환액</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">소득세</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">지방소득세</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">고용보험료</th>
            <td>1</td>
            <td>원</td>
          </tr>
          <tr>
            <th scope="row">차인지급액</th>
            <td>1</td>
            <td>원</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
      
      <div id="right"
          style={{ display: 'flex', flexDirection: 'column',flexWrap:"wrap",height:'800px' }}
          className="ag-theme-alpine">
      
              <div style={{ flex: '1 1 auto' }}>
                  <AgGridReact
                      ref={topGrid}
                      alignedGrids={bottomGrid.current ? [bottomGrid.current] : undefined}
                      rowData={rowData}
                      overlayLoadingTemplate="<b>데이터가 없습니다.</b>"
                      defaultColDef={defaultColDef}
                      columnDefs={columnDefs}
                      suppressHorizontalScroll />
              </div>

              <div style={{  height: '100px' }}>
                  <AgGridReact
                      ref={bottomGrid}
                      alignedGrids={topGrid.current ? [topGrid.current] : undefined}
                      rowData={bottomData}
                      defaultColDef={defaultColDef}
                      columnDefs={columnDefs}
                      headerHeight="0"
                      rowStyle={{ fontWeight: 'bold' }} />
              </div>

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
          onCellDoubleClicked={EarnerModalDoubleClicked}
          ref={gridRef}/>
        </div>
       
    <>
     
    <div style={{textAlign:"center"}}> 
            
          찾을 내용 <input type="text" name="search_value" style={{width:"500px",borderColor:'skyblue',outline:'none'}}value={search_value} onChange={onChange}></input>
           <br/>
            <button onClick={()=>setIsModalOpen(false)}>취소</button>
            <button onClick={EarnerModalDoubleClicked}>확인</button>
            </div>
          </></>
          }
</ReactModal>
     </div>
     
      
   
    
      </div>
          
  );
};
export default IncomeInput2;