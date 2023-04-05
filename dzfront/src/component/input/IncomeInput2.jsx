import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import Calendar from "../Calendar";
import "../../css/IncomeInput2.css";
import ReactModal from "react-modal";
import { AgGridReact } from "ag-grid-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
const IncomeInput2 = (props) => {
  //datepicker관련
  props.setTitle("사업소득자료입력");
  registerLocale("ko", ko);
  const [workDate,setWorkDate] = useState([]);
  const [bottomData,setBottomData]= useState([]);
  const earnerGridRef = useRef();
  const [earnerData, setEarnerData] = useState([]);
  const EarnerColumn = [
    { headerName: "Code", field: "earner_code", width: 150 },
    { headerName: "소득자명", field: "earner_name", width: 160 },
    { headerName: "내/외", field: "is_native", width: 80 },
    { headerName: "주민등록번호", field: "personal_no", width: 160 },
    { headerName: "소득구분명", field: "div_name", width: 120 },
    { headerName: "구분코드", field: "div_code", width: 130 },
  ];

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "1000px",
      height: "600px",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const LeftColumnDefs = [
    { headerName: "V", checkboxSelection: true, width: 45 },
    //{ headerName: "Code", field: "earner_code",editable:true,width:90},
    {
      headerName: "소득자명",
      field: "earner_name",
      editable:false,
      width: 100,
      onCellClicked: (event) => {
        if(!event.data.earner_name){
        setIsModalOpen(true)}},
    },

    {
      headerName: "주민(외국인)번호",
      children: [
        {
          headerName: "구분",
          field: "is_native",
          editable: false,
          width: 70,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["내", "외"],
          },
        },
        {
          headerName: "번호",
          field: "personal_no",
          width: 130,
          editable: false,
          colspan: 2,
        },
      ],
    },
    {
      headerName: "소득구분",
      children: [
        {
          headerName: "구분코드",
          field: "div_code",
          editable: false,
          width: 90,
        },
        {
          headerName: "구분명",
          field: "div_name",
          width: 100,
          editable: false,
          colspan: 2,
        },
      ],
    },
  ];
  const [selectedDate, setSelectedDate] = useState("");
  const startDate = useRef('');
  const selectedCode = useRef('');
  const taxId = useRef('');
  const [sumTask,setSumTask] = useState({});
  const [earnerCount,setEarnerCount] = useState("");
  
  
  

  const setDate = () => {
   
    console.log(startDate.current);
    setSelectedDate(startDate.current);
    fetch("http://localhost:8080/input/get_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.task_list != null) {
          data.task_list.push({});
          setEarnerCount(data.task_count);
          setEarnerData(data.task_list);
          setRowData([]);
        }

        else{setBottomData([]);}
        fetch("http://localhost:8080/input/sum_task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            worker_id: "yuchan2",
            payment_ym: parseInt(format(startDate.current, "yyyyMM")),
          }),
        }).then((response) => response.json())
        .then((data)=>{
          if(data.sum_task!=null){
          console.log(data.sum_task);
          setSumTask(data.sum_task);
          
        }

        else{
          setSumTask({});

        }
        })
      });
  };
  const gridRef = useRef();
  const taxGridRef =useRef();
  const [earnerList, setEarnerList] = useState(
    JSON.parse(localStorage.getItem("earnerList")) || []
  );

  const EarnerModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log(selectedRows[0]);
    console.log(parseInt(format(startDate.current, "yyyyMM")));
    fetch("http://localhost:8080/input/task_insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        earner_code: selectedRows[0].earner_code,
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
      }),
    }).then((response) => {response.json();
      setDate();
    })

    setIsModalOpen(false);
    //const{search_value}='';
  }, []);

  const [checkedValues, setCheckedValues] = useState([]);
  console.log(checkedValues);
  function handleRowSelected(event) {
    const selectedRows = event.api.getSelectedRows();
    const newCheckedValues = selectedRows.map((row) => row.earner_code);
    setCheckedValues((prevCheckedValues) => [...prevCheckedValues, ...newCheckedValues]);
  }

  function handleRowDeselected(event) {
    const deselectedRows = event.api.getSelectedRows();
    const deselectedValues = deselectedRows.map((row) => row.earner_code);
    setCheckedValues((prevCheckedValues) => prevCheckedValues.filter(
      (value) => !deselectedValues.includes(value)
    ));
  }
  useEffect(() => {
   
    fetch("http://localhost:8080/input/earner_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
       search_value:""
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setEarnerRowData(data.earner_list);
      });



  }, []);
  function onRightCellClicked(event) {
    const { data, colDef } = event;
    const { field } = colDef;
    if (event.colDef.field === "accrual_ym") {
      console.log(selectedDate);
      
      event.node.setDataValue("accrual_ym", parseInt(format(startDate.current, "yyyyMM")));
      event.node.setDataValue("payment_ym", parseInt(format(startDate.current, "yyyyMM")));
    }
  }
  let rightGridApi;
  function onRightGridReady(params) {
    rightGridApi = params.api;
    const gridColumnApi = params.columnApi;
  }
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [EarnerRowData, setEarnerRowData] = useState();
  const topGrid = useRef(null);
  const bottomGrid = useRef(null);

  const defaultColDef = {
    editable: true,
    sortable: true,
    resizable: false,
    flex: 1,
  
  };
  const totalValueGetter = (params) => {
      let total=0;
    if(params.data.artist_cost + params.data.sworker_cost>0){
        total=params.data.artist_cost + params.data.sworker_cost;
    }
    else{
      total = null;}
    return total;
  };
  const totalInsValueGetter = (params) => {
    let insTotal=0;
  if((params.data.ins_cost + params.data.sworker_ins)>0){
      insTotal=params.data.ins_cost + params.data.sworker_ins;
  }
  else{
    insTotal = null;
  }
  return insTotal;
};
  const rightGridOptions = {
 

    rowData: rowData,
    onCellClicked: onRightCellClicked,
    onCellValueChanged: onRightCellValueChanged,
  };
  const columnDefs = [
    {headerName:"ID",field :"tax_id",width:50,hide:true},
    { headerName: "귀속년월",field: "accrual_ym", maxWidth:140 , cellStyle: { textAlign: 'right' }},
    { headerName: "지급년월", field: "payment_ym" ,maxWidth: 140,editable:false, cellStyle: { textAlign: 'right' }  },
    { headerName: "일", field: "payment_date" ,maxWidth: 60, cellStyle: { textAlign: 'right' } },
    { headerName: "지급총액", field: "total_payment",width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "세율",field: "tax_rate", maxWidth: 70 , cellStyle: { textAlign: 'right' }},
    { headerName: "학자금상환액",field: "tuition_amount", minWidth: 130,cellStyle:getCellStyle},
    { headerName: "소득세",field: "tax_income", width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "지방소득세",field: "tax_local", width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "세액계",field: "tax_total", width: 100 ,cellStyle: { textAlign: 'right' }},
    {field:"artist_cost",hide:true},
    {field:"sworker_cost",hide:true},
    {field:"ins_cost",hide:true},
    {field:"sworker_ins",hide:true},
    { headerName: "예술인/특고인경비", field: "total", minWidth: 150,valueGetter: totalValueGetter ,cellStyle:getCellStyle},
    { headerName: "고용보험료",field: "ins_total", width: 100 ,valueGetter: totalInsValueGetter,cellStyle:getCellStyle},
    { headerName: "산재보험료", field: "workinjury_ins",width: 100 , cellStyle: { textAlign: 'right' }},
    { headerName: "차인지급액", field: "real_payment",width: 100 , cellStyle: { textAlign: 'right' }}
  ];


 
  function reducer(state, action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  function getCellStyle(params) {
    if (params.value ===0) {
      return { backgroundColor: 'lightgrey',color:"transparent" };
    }
    else{

      return {textAlign: 'right' }
    } 
  }
  
  const [state, dispatch] = useReducer(reducer, {
    search_value: "",
  });
  const { search_value } = state;
  const onChange = (e) => {
    dispatch(e.target);
    const { value } = e.target;
    if (value.trim() !== "") {
      fetch("http://localhost:8080/input/earner_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: "yuchan2",
          search_value: value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setEarnerRowData(data.earner_list);
        });
    }
  };
  function onCellClicked(event) {
    const selectedRow = event.data;
    selectedCode.current=selectedRow.earner_code;
    console.log(selectedCode.current);
    console.log("Selected Row Data:", selectedRow);
    if(selectedCode.current===undefined){

      setBottomData([]);
    }
    fetch("http://localhost:8080/input/get_tax", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        earner_code:selectedRow.earner_code,
        payment_ym:selectedRow.payment_ym
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.tax_list.push({});
        setWorkDate(data.select_date);
        setRowData(data.tax_list); 
      })
    
      fetch("http://localhost:8080/input/sum_tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: "yuchan2",
          earner_code:selectedRow.earner_code,
          payment_ym:selectedRow.payment_ym
        }),
      })
      .then((response) => response.json())
      .then((data) => {
       
        console.log(data);
        if(data.sum_tax!==null){
          data.sum_tax.accrual_ym = "합계";
        setBottomData([data.sum_tax]);}
        else{
          setBottomData([]);
        }
       
      });
  }
  function onRightCellValueChanged(event) {
    const { data, colDef } = event;
    const { field } = colDef;
   
    if(field==="payment_date" && event.data.accrual_ym&&event.data.payment_ym){
      const newRowData = {};
      topGrid.current.api.applyTransaction({ add: [newRowData] });
      fetch("http://localhost:8080/input/update_taxdate", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:event.data.tax_id,
            payment_date:parseInt(data.payment_date),
            accrual_ym:event.data.accrual_ym
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((datas)=>{ 
        event.node.setDataValue("payment_date", parseInt(data.payment_date));


       })


    }
    if (field === "payment_ym" && data.accrual_ym && data.payment_ym ) {
    
      fetch("http://localhost:8080/input/tax_insert", {
        method: "POST",
        body: JSON.stringify({
          payment_ym:data.payment_ym,
            worker_id:'yuchan2',
            earner_code:selectedCode.current}),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
        .then((data) => {
          console.log(data.tax_id);
          event.node.setDataValue("tax_id", data.tax_id);
          taxId.current = data.tax_id; 

        })
        .then(
      fetch("http://localhost:8080/input/update_taxdate", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:taxId.current,
            payment_date:1,
            accrual_ym:data.accrual_ym
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
          )
    };
    if (field === "tax_rate" && data.total_payment&&data.tax_rate){

      fetch("http://localhost:8080/input/update_taxinfo", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:data.tax_id,
            total_payment:parseInt(data.total_payment),
            tax_rate:parseFloat(data.tax_rate)
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
        .then((data) => {
          console.log(data.earner_tax);
          event.node.setDataValue("tax_rate", data.earner_tax.tax_rate);
          event.node.setDataValue("tax_income", data.earner_tax.tax_income);
          event.node.setDataValue("total_payment", data.earner_tax.total_payment);
          event.node.setDataValue("tax_local", data.earner_tax.tax_local);
          event.node.setDataValue("tax_total", data.earner_tax.tax_total);
          event.node.setDataValue("artist_cost", data.earner_tax.artist_cost);
          event.node.setDataValue("ins_cost", data.earner_tax.ins_cost);
          event.node.setDataValue("sworker_cost", data.earner_tax.sworker_cost);
          event.node.setDataValue("sworker_ins", data.earner_tax.sworker_ins);
          event.node.setDataValue("workinjury_ins", data.earner_tax.workinjury_ins);
          event.node.setDataValue("real_payment", data.earner_tax.real_payment);
          event.node.setDataValue("tuition_amount", data.earner_tax.tuition_amount);
          event.node.setDataValue("tax_id",data.earner_tax.tax_id);

        })

    }
   
    if (field === "total_payment" ){

      
      fetch("http://localhost:8080/input/update_taxinfo", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:data.tax_id,
            total_payment:parseInt(data.total_payment),
            tax_rate: 3
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
        .then((data) => {
          console.log(data.earner_tax);
          event.node.setDataValue("tax_rate", data.earner_tax.tax_rate);
          event.node.setDataValue("tax_income", data.earner_tax.tax_income);
          event.node.setDataValue("total_payment", data.earner_tax.total_payment);
          event.node.setDataValue("tax_local", data.earner_tax.tax_local);
          event.node.setDataValue("tax_total", data.earner_tax.tax_total);
          event.node.setDataValue("artist_cost", data.earner_tax.artist_cost);
          event.node.setDataValue("ins_cost", data.earner_tax.ins_cost);
          event.node.setDataValue("sworker_cost", data.earner_tax.sworker_cost);
          event.node.setDataValue("sworker_ins", data.earner_tax.sworker_ins);
          event.node.setDataValue("workinjury_ins", data.earner_tax.workinjury_ins);
          event.node.setDataValue("real_payment", data.earner_tax.real_payment);
          event.node.setDataValue("tuition_amount", data.earner_tax.tuition_amount);
          event.node.setDataValue("tax_id",data.earner_tax.tax_id);
  

        })
        .catch((error) => {
          console.error(error);
          // Show an error message to the user
        });


    }
   

      


    
  }
  const onEarnerGridSelection = useCallback(() => {
    const selectedEarnerRow = earnerGridRef.current.api.getSelectedRows();
    console.log(selectedEarnerRow[0]);
  }, []);
  const Tab = [

    {
      title: "자료입력",
      content:
      <div
          id="right"
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: "900px",
            marginLeft:"30px"
          }}
          className="ag-theme-alpine"
        >
          
          <div style={{ flex: "1 1 auto" }}>
            <AgGridReact
              ref={topGrid}
              alignedGrids={
                bottomGrid.current ? [bottomGrid.current] : undefined
              }
             
              gridOptions={rightGridOptions}
              rowData={rowData}
              onGridReady={onRightGridReady}
              overlayLoadingTemplate={
                '<span style="padding: 10px;">데이터가 없습니다</span>'
              }
              overlayNoRowsTemplate={
                '<span style="padding: 10px;">데이터가 없습니다</span>'
              }
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
             
            />
          </div>

          <div style={{ height: "45px" }}>
            <AgGridReact
              ref={bottomGrid}
              alignedGrids={topGrid.current ? [topGrid.current] : undefined}
              rowData={bottomData}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              overlayLoadingTemplate={
                '<span style="padding: 10px;"></span>'
              }
              overlayNoRowsTemplate={
                '<span style="padding: 10px;"></span>'
              }
              headerHeight="0"
              rowStyle={{ backgroundColor: "#ABCCF8", fontWeight: "bold" }}
            />
          </div>
        </div>
    
    },
    {
      title: "단기예술/특고",
      content:    <div style={{width:"2000px", marginLeft:"100px"}
      }>
    <Calendar payment_ym={format(startDate.current||new Date(),"yyyyMM")}
              worker_id = {localStorage.getItem("worker_id")} earner_code={selectedCode.current} 
              workDate ={workDate}  />
      </div>

      
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
    <div id="container">
    
      <div id="header">
      <div style={{ border: "1px solid black", display: "flex", alignItems: "center" ,marginTop:"10px"}}>
  <span style={{ width: "150px",marginLeft:"1rem" }}>지급년월</span>
  <DatePicker
    showIcon
    placeholderText="2022."
    selected={selectedDate}
    onChange={(date) => {
      startDate.current=date;
      setSelectedDate(startDate.current);
      console.log(startDate.current);
    }}
    minDate={new Date(2022, 0, 1)}
    maxDate={new Date(2022, 11, 31)}
    dateFormat="yyyy.MM"
    showMonthYearPicker
    locale={"ko"}
  />
  <button onClick={setDate} style={{marginRight:"2rem"}}> 조회</button>
</div>
      </div>

      <div id="content">
        <div id="left">
          <div
            id="leftTop"
            className="ag-theme-alpine"
            style={{
              width: "600px",
              height: "700px",
              padding:"10px",
              marginLeft:40,
             
            }}
          >
            <AgGridReact
              columnDefs={LeftColumnDefs}
              rowData={earnerData}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              onSelectionChanged={onEarnerGridSelection}
              onCellClicked={onCellClicked}
              overlayLoadingTemplate={
                '<span style="padding: 10px">데이터가 없습니다</span>'
              }
              overlayNoRowsTemplate={
                '<span style="padding: 10px">데이터가 없습니다</span>'
              }
              ref={earnerGridRef}
              onRowSelected={handleRowSelected}
              onRowDeselected={handleRowDeselected}
            />
          </div>

          <div id="leftBottom">
            <table style={{ border: "1px solid black", width: "580px" ,marginLeft:"20",height:"300px"}}>
              <thead></thead>
              <tbody>
                <tr>
                  <td rowSpan="9">총 계</td>
                </tr>
                <tr>
                  <th scope="row">인원[건수]</th>
                  <td>{(earnerCount)||'0'}[{(sumTask.count)||'0'}]</td>
                  <td>명</td>
                </tr>
                <tr>
                  <th scope="row">지급액</th>
                  <td>{sumTask.total_payment||0}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">학자금상환액</th>
                  <td>{sumTask.tuition_amount||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">소득세</th>
                  <td>{sumTask.tax_income||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">지방소득세</th>
                  <td>{sumTask.tax_local||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">고용보험료</th>
                  <td>{sumTask.ins_cost+sumTask.sworker_ins||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">산재보험료</th>
                  <td>{sumTask.workinjury_ins||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">차인지급액</th>
                  <td>{sumTask.real_payment||'0'}</td>
                  <td>원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={{float:"left" ,marginLeft:"20px",marginTop:'0px',width:"1500px",height:"1000px"}}>
        {Tab.map((e, index) => (
          <button key={index} onClick={e => changeItem(index)} style={{width:"150px"}}>
            {e.title}
          </button>
        ))}
     {currentItem.content}</div>  
      
        <ReactModal
          style={customStyles}
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          {
            <>
              <h4>사업소득자 코드도움</h4>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "900px" }}
              >
                <AgGridReact
                  columnDefs={EarnerColumn}
                  rowData={EarnerRowData}
                  rowSelection={"single"}
                  onCellDoubleClicked={EarnerModalDoubleClicked}
                  ref={gridRef}
                />
              </div>

              <>
                <div style={{ textAlign: "center" }}>
                  찾을 내용{" "}
                  <input
                    type="text"
                    name="search_value"
                    style={{
                      width: "500px",
                      borderColor: "skyblue",
                      outline: "none",
                    }}
                    value={search_value}
                    onChange={onChange}
                  ></input>
                  <br />
                  <button onClick={() => setIsModalOpen(false)}>취소</button>
                  <button onClick={EarnerModalDoubleClicked}>확인</button>
                </div>
              </>
            </>
          }
        </ReactModal>
      </div>
    </div>
  );
};
export default IncomeInput2;
