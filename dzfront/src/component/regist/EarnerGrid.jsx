import React, {
  useCallback,
  useRef,
  useState,
  useEffect
} from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";
import Swal from "sweetalert2";

const EarnerGrid = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(null);
  const gridRef2 = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const columnDefs = [
    { headerName: "V", headerCheckboxSelection:true, checkboxSelection: true, width: 50 },
    {
      headerName: "Code",field: "earner_code",editable: (params) => {
        return !params.node.data.div_code&&params.node.data.earner_name;
      },
      width: 90,
      cellEditor: "agTextCellEditor", 
      cellEditorParams: {
        // 입력 제한 설정
        maxLength: 6,
        pattern: "\\d*", // 숫자만 입력할 수 있도록 정규식 설정
      },
    },
    {
      headerName: "소득자명",
      field: "earner_name",
      editable: true,
      width: 100,
     
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
          width: 150,
          editable: true,
          colspan: 2,
          cellEditor: "agTextCellEditor", 
          cellEditorParams: {
            // 입력 제한 설정
            maxLength: 14,
            pattern: "\\d*" 
          },
         
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
        {headerName:"타입",
        field:"div_type",
        width: 100,
       hide:true 
      }
      ],
    },
  ];
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 180 },
    { headerName: "소득구분명", field: "div_name", width: 160 },
  ];
  const selectedCode=useRef();
  const [selectedCell,setSelectedCell]=useState(null);
  const earnerCellClicked=(event)=>{
    const { data, colDef } = event;
    const { field } = colDef;
    if(field==="div_code"){
      if(!event.data.div_name){
        setSelectedCell(event.node);
        setIsModalOpen(true);
      }
      if (!event.data.earner_name){
        setIsModalOpen(false);
        Swal.fire('이름을 먼저 입력해주세요','','info');
      }
            
    }
    const selectedCell=event.data;
    if(selectedCell.earner_code&&selectedCell.div_code){
    selectedCode.current=selectedCell.earner_code;
    console.log(selectedCell.earner_code);
    setValue(selectedCell.earner_code);
    props.onValueChange(selectedCell.earner_code);}
   
   

  };

let earnerGridApi ;
const onEarnerGridReady=(params)=> {
  earnerGridApi = params.api;
  const gridColumnApi = params.columnApi;
}

const onCellValueChanged=(event)=>{

  const { data, colDef } = event;
  const { field } = colDef;
  //이름 작성시
  if(field==="earner_name"){
    if (event.data.earner_code) {
      fetch("http://localhost:8080/regist/earner_update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: localStorage.getItem("worker_id"),
          earner_code:event.data.earner_code,
          param_name:"earner_name",
          param_value:event.data.earner_name
    
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // if(data.status===true){
          //   Swal.fire('변경성공','','success');
          // }
         
        });
      
    } else {
      defaultCode.current=1;
      fetch("http://localhost:8080/regist/get_count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_count: localStorage.getItem("code_count"),
          worker_id: localStorage.getItem("worker_id"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const codeCount = data.code_count.toString().padStart(6, "0");
          event.node.setDataValue("earner_code",codeCount);
          event.node.setDataValue("is_native",'내');
          const newRowData = {};
          gridRef2.current.api.applyTransaction({ add: [newRowData] });

        });
    }
  }
if((field ==="personal_no"||field==="is_native")&& event.data.div_code){
  fetch("http://localhost:8080/regist/earner_update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      worker_id: localStorage.getItem("worker_id"),
      earner_code:event.data.earner_code,
      param_value:data[field],
      param_name:field
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.status===true){
        Swal.fire('변경성공','','success');
      }
    });


}
if(field==="div_code"&&event.data.earner_code&&event.data.earner_name){
  fetch("http://localhost:8080/regist/earner_insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      worker_id: localStorage.getItem("worker_id"),
      earner_code:event.data.earner_code,
      earner_name:event.data.earner_name,
      div_code:event.data.div_code,
      div_name:event.data.div_name,
      div_type:event.data.div_type,
      is_default:defaultCode.current,
      is_native:event.data.is_native,
      personal_no:event.data.personal_no
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.code_count);
      if(data.code_count!==0){
      localStorage.setItem("code_count",data.code_count);}
    });


}

}

const onCellEditingStopped=(event)=>{
  const { data, colDef } = event;
  const { field } = colDef;

  if(field==="earner_code"){
    console.log('코드입력');
    const inputCode = event.data.earner_code;
   fetch("http://localhost:8080/regist/check_code", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       custom_code: inputCode,
       worker_id: localStorage.getItem("worker_id"),
     }),
   })
     .then((response) => response.json())
     .then((data) => {
       console.log(data.code_count);
       if (data.code_count >= 1) {
         Swal.fire({
           title: "이미 존재하는 코드입니다",
           text: "다른코드를 입력하세요",
           icon: "error",
         });
       } else {
         Swal.fire({
           title: "사용가능한 코드입니다",
           text: "..",
           icon: "success",
         });
         defaultCode.current=0;
       }
     });
 };

}
  useEffect(() => {
    
      fetch(`http://localhost:8080/regist/earner_list/${localStorage.getItem("worker_id")}`)
        .then((resp) => resp.json())
        .then((rowData) => {
          rowData.earner_list.push({});
          setRowData(rowData.earner_list);});

  }, []);
  const defaultCode= useRef(1);
  const [rowData, setRowData] = useState([]);
  const [divRowData, setDivRowData] = useState();
 
 

  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);

 

  const gridOptions = {
    suppressScrollOnNewData: true,
    //onCellClicked: onCellClicked,
    onCellValueChanged: onCellValueChanged,

  };

  const DivModalDoubleClicked =() => {
    setIsModalOpen(false);
      selectedCell.setDataValue('div_code', selectValue.div_code);
      selectedCell.setDataValue('div_name', selectValue.div_name);
      selectedCell.setDataValue('div_type', selectValue.div_type);
  };
  const [selectValue, setSelectValue] = useState("");
  const [codeList,setCodeList] =useState([]);
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
    console.log(selectedRows[0])
  }, []);
  const [value, setValue] = useState(props.value);
  
  const onSelectionChanged2 = () => {
    const selectedRows2 = gridRef2.current.api.getSelectedRows();
    const newValue = selectedRows2[0].earner_code;
    var selectedRowsString = '';
   
    selectedRows2.forEach(function (selectedRow) {
      selectedRowsString += selectedRow.earner_code;
      setCodeList((prev) => [...prev, selectedRow.earner_code]);
      
    });
    const set=new Set(codeList);
    const newArr=[...set];
    //document.querySelector('#selectedRows').innerHTML =newArr;
  
  };
  
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };



  return (
    
    <div
      className="ag-theme-alpine"
      style={{ float: "left", height: 800, width: 700, marginTop: "40px" }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
      
        onSelectionChanged={onSelectionChanged2}
        rowSelection={"multiple"}
        singleClickEdit={"false"}
        suppressRowClickSelection = {'true'}
        //onCellValueChanged={handleDataChange}
        onCellEditingStopped={onCellEditingStopped}
        onCellClicked={earnerCellClicked}
        ref={gridRef2}
        
        onGridReady={onEarnerGridReady}
        gridOptions={gridOptions}
      />

Selection:
          <span id="selectedRows"></span>

      <ReactModal
        style={customStyles}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        {
          <>
            <h4>소득구분코드 도움</h4>
            <div
              className="ag-theme-alpine"
              style={{ float: "left", height: 400, width: 400 }}
            >
              <AgGridReact
                columnDefs={divColumn}
                rowData={divRowData}
                onGridReady={onGridReady}
                rowSelection={"single"}
                onCellDoubleClicked={DivModalDoubleClicked}
                onSelectionChanged={onSelectionChanged}
                ref={gridRef}
              />
            </div>

            <>
              <br />{" "}
              <div style={{ textAlign: "center" }}>
                <h5>선택 코드: {selectValue.div_code}</h5>
                <h5>구분명:{selectValue.div_name}</h5>
                <h5>타입:{selectValue.div_type}</h5>
                <button onClick={DivModalDoubleClicked}>확인</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </>
          </>
        }
      </ReactModal>
    </div>
  );
};

export default EarnerGrid;
