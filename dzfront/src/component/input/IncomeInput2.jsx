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
import "../../css/IncomeInput2.css";
import ReactModal from "react-modal";
import { AgGridReact } from "ag-grid-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
const IncomeInput2 = () => {
  //datepicker관련
 
  registerLocale("ko", ko);
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
      editable: true,
      width: 100,
      onCellClicked: () => setIsModalOpen(true),
    },

    {
      headerName: "주민(외국인)번호",
      children: [
        {
          headerName: "구분",
          field: "is_native",
          editable: true,
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
          editable: true,
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
          editable: true,
          width: 90,
        },
        {
          headerName: "구분명",
          field: "div_name",
          width: 100,
          editable: true,
          colspan: 2,
        },
      ],
    },
  ];
  const [selectedDate, setSelectedDate] = useState("");
  const startDate = useRef('');
  const selectedCode = useRef('');
  const taxId = useRef('');
  const [earnerCount,setEarnerCount] = useState("");
  const [taxCount,setTaxCount] = useState("");
  const [sumInsCost,setSumInsCost]= useState("");
  const [sumReal,setSumReal] =useState("");
  const [sumTaxLocal,setSumTaxLocal]=useState("");
  const [sumTaxIncome,setSumTaxIncome]=useState("");
  const [sumTuition,setSumTuition]=useState("");
  const [sumTotalPay,setSumTotalPay]=useState("");
  
  

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
          setTaxCount(data.sum_task.count);
          setSumInsCost(data.sum_task.ins_cost);
          setSumReal(data.sum_task.real_payment);
          setSumTaxLocal(data.sum_task.tax_local);
          setSumTaxIncome(data.sum_task.tax_income);
          setSumTuition(data.sum_task.tuition_amount);
          setSumTotalPay(data.sum_task.total_payment);
        }

        else{
          setTaxCount(0);
          setSumInsCost(0);
          setSumReal(0);
          setSumTaxLocal(0);
          setSumTaxIncome(0);
          setSumTuition(0);
          setSumTotalPay(0);

        }
        })
      });
  };
  const gridRef = useRef();
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
    resizable: true,
    flex: 1,
    minWidth: 50,
  };

  const rightGridOptions = {
 

    rowData: rowData,
    onCellClicked: onRightCellClicked,
    onCellValueChanged: onRightCellValueChanged,
  };
  const columnDefs = [
    {headerName:"ID",field :"tax_id",width:50},
    { headerName: "귀속년월",field: "accrual_ym", width:180 , cellStyle: { textAlign: 'right' }},
    { headerName: "지급년월", field: "payment_ym" ,width: 150,editable:false, cellStyle: { textAlign: 'right' }  },
    { headerName: "일", field: "payment_date" ,width: 50, cellStyle: { textAlign: 'right' } },
    { headerName: "지급총액", field: "total_payment",width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "세율",field: "tax_rate", width: 120 , cellStyle: { textAlign: 'right' }},
    { headerName: "학자금상환액",field: "tuition_amount", width: 120,cellStyle:getCellStyle},
    { headerName: "소득세",field: "tax_income", width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "지방소득세",field: "tax_local", width: 150 , cellStyle: { textAlign: 'right' }},
    { headerName: "세액계",field: "tax_total", width: 100 ,cellStyle: { textAlign: 'right' }},
    { headerName: "예술인경비",field: "artist_cost", width: 100 ,cellStyle:getCellStyle},
    { headerName: "고용보험료",field: "ins_cost", width: 100 ,cellStyle:getCellStyle},
    { headerName: "차인지급액", field: "real_payment",width: 100 , cellStyle: { textAlign: 'right' }},
  ];
 
  function reducer(state, action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  function getCellStyle(params) {
    if (params.value ===0) {
      return { backgroundColor: '#eaeaea',color:"transparent" };
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
        data.tax_list.push({})
        setRowData(data.tax_list);
        setBottomData(data.tax_list);
        
      });
    
  }
  function onRightCellValueChanged(event) {
    const { data, colDef } = event;
    const { field } = colDef;
  
    if (field === "payment_date" && data.payment_date) {
      console.log(data.payment_date);
      const newRowData = {};
      rightGridApi.applyTransaction({ add: [newRowData] });
    }
    if(field==="payment_date" && data.accrual_ym&&data.payment_ym){
      fetch("http://localhost:8080/input/update_taxdate", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:data.tax_id,
            payment_date:parseInt(data.payment_date),
            accrual_ym:data.accrual_ym
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())


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
          event.node.setDataValue("tax_rate", data.earner_tax.taxRate);
          event.node.setDataValue("tax_income", data.earner_tax.taxIncome);
          event.node.setDataValue("total_payment", data.earner_tax.totalPayment);
          event.node.setDataValue("tax_local", data.earner_tax.taxLocal);
          event.node.setDataValue("tax_total", data.earner_tax.taxTotal);
          event.node.setDataValue("artist_cost", data.earner_tax.artistCost);
          event.node.setDataValue("ins_cost", data.earner_tax.insCost);
          event.node.setDataValue("real_payment", data.earner_tax.realPayment);
          event.node.setDataValue("tuition_amount", data.earner_tax.deductionAmount);
          event.node.setDataValue("tax_id",data.earner_tax.taxId);
         
        })
        .catch((error) => {
          console.error(error);
          // Show an error message to the user
        });


    }
   
    if (field === "total_payment" && data.total_payment){

      
      fetch("http://localhost:8080/input/update_taxinfo", {
        method: "PATCH",
        body: JSON.stringify({
            tax_id:data.tax_id,
            total_payment:parseInt(data.total_payment),
            tax_rate:3.0
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
        .then((data) => {
          console.log(data.earner_tax);
          event.node.setDataValue("tax_rate", data.earner_tax.taxRate);
          event.node.setDataValue("tax_income", data.earner_tax.taxIncome);
          event.node.setDataValue("total_payment", data.earner_tax.totalPayment);
          event.node.setDataValue("tax_local", data.earner_tax.taxLocal);
          event.node.setDataValue("tax_total", data.earner_tax.taxTotal);
          event.node.setDataValue("artist_cost", data.earner_tax.artistCost);
          event.node.setDataValue("ins_cost", data.earner_tax.insCost);
          event.node.setDataValue("real_payment", data.earner_tax.realPayment);
          event.node.setDataValue("tuition_amount", data.earner_tax.deductionAmount);
          event.node.setDataValue("tax_id",data.earner_tax.taxId);
         
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
              padding:"10px"
            }}
          >
            <AgGridReact
              columnDefs={LeftColumnDefs}
              rowData={earnerData}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              onSelectionChanged={onEarnerGridSelection}
              onCellClicked={onCellClicked}
              ref={earnerGridRef}
              onRowSelected={handleRowSelected}
              onRowDeselected={handleRowDeselected}
            />
          </div>

          <div id="leftBottom">
            <table style={{ border: "1px solid black", width: "480px" ,marginLeft:"60px"}}>
              <thead></thead>
              <tbody>
                <tr>
                  <td rowSpan="8">총 계</td>
                </tr>

                <tr>
                  <th scope="row">인원[건수]</th>
                  <td>{(earnerCount)||'0'}[{(taxCount)||'0'}]</td>
                  <td>명</td>
                </tr>
                <tr>
                  <th scope="row">지급액</th>
                  <td>{sumTotalPay||0}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">학자금상환액</th>
                  <td>{sumTuition||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">소득세</th>
                  <td>{sumTaxIncome||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">지방소득세</th>
                  <td>{sumTaxLocal||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">고용보험료</th>
                  <td>{sumInsCost||'0'}</td>
                  <td>원</td>
                </tr>
                <tr>
                  <th scope="row">차인지급액</th>
                  <td>{sumReal||'0'}</td>
                  <td>원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="right"
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: "800px",
            marginLeft:"50px"
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
              overlayLoadingTemplate="<b>데이터가 없습니다.</b>"
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              suppressHorizontalScroll
            />
          </div>

          <div style={{ height: "100px" }}>
            <AgGridReact
              ref={bottomGrid}
              alignedGrids={topGrid.current ? [topGrid.current] : undefined}
              rowData={bottomData}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              headerHeight="0"
              rowStyle={{ fontWeight: "bold" }}
            />
          </div>
        </div>
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
