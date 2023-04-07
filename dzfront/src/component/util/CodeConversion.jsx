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
    const [timeOpen, setTimeOpen] = useState(false);    
    const gridRef      = useRef();
    const gridRef2     = useRef();
    const earnerCode   = useRef();
    const earner_name  = useRef();
    const div_code     = useRef();
    const div_name     = useRef();
    const div_type     = useRef();
    const old_div_type = useRef();
    const old_div_code = useRef();
    const new_div_code= useRef();
    const div_modified = useRef();
    const new_div_name= useRef();    
    const [modified_date, setModified_date] = useState("");
    const [selectedCell,setSelectedCell] = useState(null);

    const onEarnerSelection = (event) => { 
      const selectedRows = gridRef2.current.api.getSelectedRows();
      earnerCode.current = selectedRows[0].earner_code;
      console.log(selectedRows[0].earner_code);
      setSelectedCell(event.node);
      earner_name.current = selectedRows[0].earner_name;
      old_div_code.current = selectedRows[0].div_code;
      div_name.current = selectedRows[0].div_name
      new_div_code.current = selectedRows[0].new_div_code;
      div_modified.current = selectedRows[0].div_modified;
      console.log("onEarnerSelection", event.node);
      onCodeHistory();
    };

    let gridApi;

   const onEarnerGridReady = (params) => {
      gridApi=params.api;
      fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
        .then((resp) => resp.json())
        .then((rowData) => {
          setRowData(rowData.earner_list);
          console.log(rowData);
        });
    };
    
    const columnDefs = [ 
      {
        headerName: "변환 대상 소득자", width: 270,
        children: [
          {
            headerName: "code",
            field: "earner_code",
            width: 270
          },
          {
            headerName: "소득자명",
            field: "earner_name",
            width: 270
          },
          {
            headerName: "주민(사업자)등록번호",
            field:  "personal_no",
            width: 270,
            cellStyle: { color: 'red', backgroundColor: 'mistyrose'},
            
          },
        ],
      },
      { headerName: "변환전 소득구분", field: "div_code", width: 270},
      { headerName: "변환후 소득구분", field: "new_div_code",width: 270,
      onCellClicked: (event) => setIsModalOpen(true),     
    },
      { headerName: "최종작업시간", field: "div_modified" ,width: 270,
      onCellClicked: (event) => setTimeOpen(true), 
    },
    ];
 
    const divColumn = [
      { headerName: "소득구분코드", field: "div_code",width:270},
      { headerName: "소득구분명", field: "div_name", width:270},        
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
      new_div_name.current = selectedRows[0].div_name;
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
        selectedCell.setDataValue("new_div_code",div_code.current);
        onCodeHistory();
      })     
    };

    const onSelectionChanged = useCallback(() => {
      const selectedRows = gridRef.current.api.getSelectedRows();
      div_code.current = selectedRows[0].div_code;
      div_name.current = selectedRows[0].div_name;
      div_type.current = selectedRows[0].div_type;    
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
          earner_code:earnerCode.current,
        }),
      }).then(response => response.json())
      . then(rowData => {
        //응답결과 받는 부분
        console.log("aaaaaa", rowData);
        setModified_date(rowData.code_history.modified_date);
        selectedCell.setDataValue("div_modified",rowData.code_history.modified_date);
      });
    };

    return (
        <><div style={{ border: "1px solid black",  alignItems: "center", marginTop: "15px", marginLeft: "10px", marginRight: "10px", padding:"5px"}}>
            <select   >
              <option value="">1.사업소득</option>
            </select>
            <button style={{float:"right", textAlign:"center", paddingBottom: "3px"}}> 조회</button>
          </div>
          <div
            className="ag-theme-alpine"
            style={{height: 750, width: 1640, marginTop: "5px" ,padding:"5px",marginLeft:"3px", marginRight:"3px"}}
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

        <ReactModal
            style={customStyles}
            isOpen={timeOpen}
            onRequestClose={() => setTimeOpen(false)}
          >
            {
              <>
              <h2>최종 소득구분 변경 정보</h2>
              <th style={{ backgroundColor: 'lightBlue' }}>해당 소득자에 대한 마지막 소득구분 변경기록을 조회할 수 있습니다.</th>
              <h4>●상세정보</h4>
              <div>
              
              <table border="1" style={{ float:"left" ,height: 400, width: 500 }}>
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
                    <td>{old_div_code.current} ({div_name.current}) </td>
                  </tr>
                  <tr>
                    <th>변경 소득구분</th>
                    <td>{new_div_code.current} ({new_div_name.current})</td>
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
                     
            <div style={{textAlign:"center"}}>
              <>
               <button onClick={() =>setTimeOpen(false) }>확인</button>
              </>
            </div>
            </>
            }
         </ReactModal>
      </>
    );
  };
  
  export default CodeConversion;
  