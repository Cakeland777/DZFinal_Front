import React, {
  useCallback,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";


const CodeConversion= () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef      = useRef();
  const gridRef2     = useRef();
  const earnerCode   = useRef();
  const div_code     = useRef();
  const div_name     = useRef();
  const div_type     = useRef();
  const old_div_type = useRef();
  const [selectedCell,setSelectedCell] =useState(null);
  const onEarnerSelection = (event) => {

    const selectedRows = gridRef2.current.api.getSelectedRows();
    earnerCode.current = selectedRows[0].earner_code;
    console.log(selectedRows[0].earner_code);
    setSelectedCell(event.node);
    old_div_type.current = selectedRows[0].div_type;
    console.log("onEarnerSelection", event.node);
  };
  let gridApi;
 const onEarnerGridReady = (params) => {
    gridApi=params.api;
    fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
      .then((resp) => resp.json())
      .then((rowData) => {
        setRowData(rowData.earner_list);
      });
  };
  
  const columnDefs = [
    {
      headerName: "변환 대상 소득자",
      children: [
        {
          headerName: "code",
          field: "earner_code",
        
          width: 150,
        },
        {
          headerName: "소득자명",
          field: "earner_name",
          width: 150,

        },
        {
          headerName: "주민(사업자)등록번호",
          field: "personal_no",
          width: 200,
        },
      ],
    },
    { headerName: "변환전 소득구분", field: "div_code", width: 150,},
    { headerName: "변환전 소득타입", field: "div_type", width: 150,hide:true},
    { headerName: "변환후 소득구분", field: "new_div_type",width: 150,
    onCellClicked: (event) => setIsModalOpen(true),
    
  },
    { headerName: "최종작업시간", field: "modified_date" ,width: 150,},
  ];

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

  const [rowData, setRowData] = useState();
  
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

  const DivModalDoubleClicked = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    let mode = "";
   
    div_code.current = selectedRows[0].div_code;
    div_name.current = selectedRows[0].div_name;
    div_type.current = selectedRows[0].div_type;
    
    if (old_div_type.current ==="특고인" && (div_type.current ==="예술인" || div_type.current ==="일반" )) {
      mode = "update_sworker_other";
    }
    else if(old_div_type.current ==="예술인" && (div_type.current ==="특고인" || div_type.current ==="일반") ) {
      mode = "update_is_artist_other";
    }

    setIsModalOpen(false);
    let param = {
      div_code:div_code.current,
      div_name:div_name.current,
      div_type:div_type.current,
      worker_id: "yuchan2",
      earner_code:earnerCode.current,
      mode:mode
    };
    console.log(param);
    fetch("http://localhost:8080/util/update_earner_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        div_code:div_code.current,
        div_name:div_name.current,
        div_type:div_type.current,
        worker_id: "yuchan2",
        earner_code:earnerCode.current,
        mode:mode
      }),
    }).then(response => {
      response.json();
      selectedCell.setDataValue("new_div_type",div_type.current);
    })
    
  };

  

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    div_code.current = selectedRows[0].div_code;
    div_name.current = selectedRows[0].div_name;
    div_type.current = selectedRows[0].div_type;
  }, []);

  return (
      <><div style={{ border: "1px solid black",  alignItems: "center", marginTop: "10px",padding:"5px" }}>
          <select   >
            <option value="">1.사업소득</option>
          </select>
          <button style={{float:"right"}}> 조회</button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ height: 800, width: 1200, marginTop: "40px" ,padding:"30px",marginLeft:"400px"}}
        >
          <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              overlayLoadingTemplate={
                  '<span style="padding: 10px;">데이터가 없습니다</span>'
                }
                overlayNoRowsTemplate={
                  '<span style="padding: 10px;">데이터가 없습니다</span>'
                }
                rowSelection="single"
                onGridReady={onEarnerGridReady}
                onCellClicked={onEarnerSelection}
              
                ref={gridRef2}
                />

        </div>

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
              <button onClick={DivModalDoubleClicked}>확인</button>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
            </div>
          </>
        </>
      }
      </ReactModal>
    </>
  );
};

export default CodeConversion;
