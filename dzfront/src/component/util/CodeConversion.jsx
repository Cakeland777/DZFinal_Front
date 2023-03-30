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
   
  
    const columnDefs = [
     
  
      {
        headerName: "변환 대상 소득자",
        children: [
          {
            headerName: "code",
            field: "eanrer_code",
          
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
      { headerName: "변환전 소득구분", field: "", width: 150,},
      { headerName: "변환후 소득구분",   field: "",width: 150,},
      { headerName: "최종작업시간", field: "" ,width: 150,},
    ];
 
  
  
    const [rowData, setRowData] = useState();
  
    return (
        <><div style={{ border: "1px solid black",  alignItems: "center", marginTop: "10px",padding:"5px" }}>
                    <select   >
    <option value="">1.사업소득</option>
  
  </select>
            <button style={{float:"right"}}> 조회</button>
        </div><div
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
                      } />

            </div></>
    );
  };
  
  export default CodeConversion;
  