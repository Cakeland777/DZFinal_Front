import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";
import DivCodeButton from "./util/DivCodeButton";


  const Test2 = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const columnDefs = [ {
      headerName: "Button Column",
      field: "buttonColumn",
      cellRenderer: (params) => {
        const handleClick = () => {
          setIsModalOpen(true);
        };
        return <button onClick={handleClick}>Open Modal</button>;
      },
    },
        { headerName: "Code", field: "code",editable:true,width:100 },
        { headerName: "Name", field: "name", editable: true,width:90 },
        { headerName: "Number", field: "number", editable: true },
        { headerName: "Div", field: "div", editable: true, cellRenderer:DivCodeButton  }
      ];
      
      const emptyRowData = { code: "", name: "", number: "", div: "" };
      
    const [rowData, setRowData] = useState([emptyRowData]);
   
    const handleCellEditingStopped = ({ data, colDef }) => {
      if (colDef.field === "name") {
        fetch(`http://localhost:8080/get_count`)
          .then((response) => response.json())
          .then((data) => {
            const newRowData = { ...data, name: data.name || data.code };
            const newData = [...rowData];
            newData[data.rowIndex] = newRowData;
            setRowData(newData);
            createNewRow();
          })
          .catch((error) => {
            console.error("Error fetching code:", error);
          });
      }
    };
  
    const createNewRow = () => {
      const lastRowData = rowData[rowData.length - 1];
      const isLastRowFilled = Object.values(lastRowData).every((val) => val !== "");
      if (isLastRowFilled) {
        setRowData([...rowData, emptyRowData]);
      }
    };
  
    const handleSubmit = () => {
      const lastRowData = rowData[rowData.length - 1];
      const isLastRowFilled = Object.values(lastRowData).every((val) => val !== "");
      if (isLastRowFilled) {
        // 모든 값이 입력되었는지 확인
        const isAllFilled = rowData.every((data) =>
          Object.values(data).every((val) => val !== "")
        );
  
        if (isAllFilled) {
          // 서버로 데이터 전송
          fetch("http://example.com/api/data", {
            method: "POST",
            body: JSON.stringify(rowData),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to send data to server.");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Data sent to server:", data);
            })
            .catch((error) => {
              console.error("Error sending data to server:", error);
            });
  
          // 새로운 행 생성
          setRowData([emptyRowData]);
        }
      }
    };
  
    return (
      
      <div className="ag-theme-alpine" style={{ float:"left" ,height: 400, width: 600 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          onCellEditingStopped={handleCellEditingStopped}
        />
        <button onClick={handleSubmit}>Submit</button>
        <ReactModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
  {<><div>안녕</div><>
            <button>테스트</button>
          </></>}
</ReactModal>;
      </div>
    );
  };

export default Test2;
