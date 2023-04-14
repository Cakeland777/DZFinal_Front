import React, { useCallback, useRef, useState } from "react";
import { FiEdit } from 'react-icons/fi';

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";
import "../../css/codeConversion.css";

const CodeConversion = (props) => {
  props.setTitle("코드변환");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const gridRef = useRef();
  const gridRef2 = useRef();
  const earnerCode = useRef();
  const earner_name = useRef();

  const div_code = useRef();
  const div_name = useRef();
  const div_type = useRef();

  const old_div_code = useRef();
  const old_div_name = useRef();

  const new_div_code = useRef();
  const new_div_name = useRef();
  const new_div_type = useRef();

  const div_modified = useRef();

  //const worker_id = useRef();
  
  const [modified_date, setModified_date] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);

  const onEarnerSelection = (event) => {
    const selectedRows = gridRef2.current.api.getSelectedRows();
    earnerCode.current = selectedRows[0].earner_code;
    console.log(selectedRows[0].earner_code);
    setSelectedCell(event.node);
    earner_name.current = selectedRows[0].earner_name;
    
    old_div_code.current = selectedRows[0].old_div_code || "";
    old_div_name.current = selectedRows[0].old_div_name || "";

    div_code.current = selectedRows[0].div_code;
    div_name.current = selectedRows[0].div_name;
    div_type.current = selectedRows[0].div_type;
   // worker_id.current = selectedRows[0].worker_id;
    
    div_modified.current = selectedRows[0].div_modified;
    console.log("old_div_code", old_div_code.current);
    console.log("old_div_name", old_div_name.current);
    console.log("onEarnerSelection", selectedRows[0]);
    onCodeHistory();
  };

  let gridApi;

  const onEarnerGridReady = (params) => {
    gridApi = params.api;
    fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
      .then((resp) => resp.json())
      .then((rowData) => {
        setRowData(rowData.earner_list);
        console.log(rowData);
      });
  };

  
  
  
  const columnDefs = [
    
    {
      headerName: "변환 대상 소득자",    
      width: 265,cellStyle: {
        borderRight: "1px solid #000"}, // 오른쪽 테두리 추가
      
      children: [
        {
          headerName: "code",
          field: "earner_code",
          width: 265,
        },
        {
          headerName: "소득자명",
          field: "earner_name",
          width: 265,
        },
        {
          headerName: "주민(사업자)등록번호",
          field: "personal_no",
          width: 265,
          cellStyle: { 
            color: "#DC143C"
          ,backgroundColor: "mistyrose" 
          ,opacity:0.6
          ,textAlign : "center" },
        },
      ],
    },
    { 
      headerName: "과거이력용", 
      field: "old_div_code",
     
      hide:"true",
      width: 265 
    },
    {
      headerName: "변환전 소득구분",
      field: "div_code", 
      width: 265,
    },
    {
      headerName: "변환후 소득구분",
      field: "new_div_code", 
      width: 265,
      cellRenderer: function(params) {
        return (
          <div style={{ position: "relative" }}>
      <span>{params.value}</span>
      <FiEdit style={{ 
        position: "absolute", 
        right: 0,
        
        paddingTop : "13px"
        
      }} />
    </div>
        );
      },
      onCellClicked: (event) => setIsModalOpen(true),
    },
    {
      headerName: "변환후 소득이름",
      field: "div_name",
      hide:"true",
      width: 265,
    },
    {
      headerName: "최종작업시간",
      
      field: "div_modified",
      width: 280,
      onCellClicked: (event) => setTimeOpen(true),
    },
    {
      headerName: "div_type",
      field: "div_type",
      hide:"true",
      width: 265,
    },
  ];
 

  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 270 },
    { headerName: "소득구분명", field: "div_name", width: 270 },
  ];
 
  const [divRowData, setDivRowData] = useState();

  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
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
    console.log("DivModalDoubleClicked-> selectedRows", selectedRows)
    let mode = "";
    new_div_code.current = selectedRows[0].div_code;
    new_div_name.current = selectedRows[0].div_name;
    new_div_type.current = selectedRows[0].div_type;
  
    if (
      div_type.current === "특고인" &&
      (new_div_type.current === "예술인" || new_div_type.current === "일반")
    ) {
      mode = "update_sworker_other";      
    } else if (
      div_type.current === "예술인" &&
      (new_div_type.current === "특고인" || new_div_type.current === "일반")
    ) {
      mode = "update_is_artist_other";
    }
    setIsModalOpen(false);
    let param = {
      div_code: new_div_code.current,
      div_name: new_div_name.current,
      div_type: new_div_type.current,
      old_div_code: div_code.current,
      old_div_name: div_name.current,
      worker_id: "yuchan2",
      earner_code: earnerCode.current,
      mode: mode,
    };
    console.log("DivModalDoubleClicked->", param);

    fetch("http://localhost:8080/util/update_earner_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    }).then((response) => response.json())
      .then((rowData) => { 

        console.log("rowData", rowData);
        
      const selected_new_div_code = selectedCell.data.new_div_code || "";
      const selected_new_div_name = selectedCell.data.new_div_name || "";
      const selected_new_div_type = selectedCell.data.new_div_type || "";

      if (selected_new_div_code === "") {
        selectedCell.setDataValue("new_div_code", new_div_code.current);
        selectedCell.setDataValue("old_div_code", div_code.current);
        //selectedCell.setDataValue("old_div_name", div_name.current);
        selectedCell.setDataValue("div_modified", rowData.div_modified);
      } else {
        selectedCell.setDataValue("new_div_code", new_div_code.current);
        selectedCell.setDataValue("div_code", selected_new_div_code);
        selectedCell.setDataValue("div_name", selected_new_div_name);
        selectedCell.setDataValue("div_type", selected_new_div_type);
        selectedCell.setDataValue("old_div_code", div_code.current);
        //selectedCell.setDataValue("old_div_name", div_name.current);
        selectedCell.setDataValue("div_modified", rowData.div_modified);
      }
      //setModified_date(rowData.rowData.div_modified);
      
      //onCodeHistory();
    });
  };

  //소득구분코드 도움 cell 선택시 이벤트 핸들러 
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    new_div_code.current = selectedRows[0].div_code;
    new_div_name.current = selectedRows[0].div_name;
    new_div_type.current = selectedRows[0].div_type;
  }, []);

  const onCodeHistory = () => {
    fetch("http://localhost:8080/util/select_code_history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //필요한 인자전달 하는 부분
        worker_id: "yuchan2",
        earner_code: earnerCode.current,
      }),
    })
      .then((response) => response.json())
      .then((rowData) => {
        //응답결과 받는 부분
        console.log("aaaaaa", rowData);
        console.log("selectedCell", selectedCell);
        if (selectedCell && rowData.code_history) {
          setModified_date(rowData.code_history.modified_date);
          selectedCell.setDataValue(
            "div_modified",
            rowData.code_history.modified_date
          )
        }
      });
  };

  return (
    <>
      <div
        style={{
          border: "1px solid black",
          alignItems: "center",
          marginTop: "15px",
          marginLeft: "10px",
          marginRight: "10px",
          padding: "5px",
        }}
      >

      <select disabled>
        <option value="div_income">1.사업소득</option>
      </select>
      
      <button
        style={{  
          textAlign: "center", 
          width: "6%", 
          height: "100%",
          display: "flex",
          alignItems: "flex-start", 
          justifyContent: "center",
          fontSize: "17px",
          float: "right", 
          marginTop: "4px",
          marginBottom: "4px",
      
      }}
      onClick={() => window.location.reload()}
      >
       
         새로고침
      </button>

      </div>

      <div
        className="ag-theme-alpine"
        style={{
          height: 600,
          width: "100%",
          marginTop: "2px",
          padding: "10px",
          marginLeft: "2px",
          marginRight: "1px",
          textAlign: "center",
          overflow: 'auto' // 스크롤 추가
        
        }}
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
              style={{ float: "left", height: 500, width: 600 }}
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

      <ReactModal
      
        style={customStyles}
        isOpen={timeOpen}
        onRequestClose={() => setTimeOpen(false)}
      >
        {
          <>
            <h2 align="center">최종 소득구분 변경 정보</h2>
            <th style={{ backgroundColor: "lightBlue" }}>
              해당 소득자에 대한 마지막 소득구분 변경기록을 조회할 수 있습니다.
            </th>
            <h4>●상세정보</h4>
            <div>
              <table
                border="1"
                style={{ float: "left", height: 400, width: 500 }}
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <th>소득자명</th>
                    <td>{earner_name.current}</td>
                  </tr>
                  <tr>
                    <th>구분소득</th>
                    <td>사업소득</td>
                  </tr>
                  <tr>
                    <th>기존 소득구분</th>
                    <td>
                    {div_code.current} ({div_name.current}){" "}
                  

                    </td>
                  </tr>
                  <tr>
                    <th>변경 소득구분</th>
                    <td>
                   
                    {new_div_code.current} ({new_div_name.current}){" "}
                     
                    </td>
                  </tr>
                  <tr>
                    <th>작업시간</th>
                    <td>{modified_date}</td>
                  </tr>
                  <tr>
                    <th>유저ID/작업자</th>
                    <td>yuchan2/김유찬</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center" }}>
              <>
                <button onClick={() => setTimeOpen(false)}>확인</button>
              </>
            </div>
          </>
        }
      </ReactModal>
    </>
  );
};

export default CodeConversion;
