import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import CodeModal from "../CodeModal";
const IncomeInput = () => {

const data = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 }
];

// const columnDefs = [
//   { headerName: "v", field: "v",editable:true,width:100 },
//   { headerName: "소득자명", field: "name", editable: true,width:90 },
//   { headerName: "주민(외국인)번호", field: "number", editable: true},
//   { headerName: "소득구분", field: "div", editable: true }
// ];

const columnDefs = [
  { headerName: "v", field: "v"},
  { headerName: "Code", field: "Code"},
  { headerName: "소득자명", field: "name"},
  
  {
    headerName: '주민(외국인)번호',
    marryChildren: true,
    children: [
      { field: '내', colId: 'is_native' },
      { field: '990909-1099999', colId: 'number' },
    ],
  },
  {
    headerName: '소득구분',
    marryChildren: true,
    children: [
      { field: '940302', colId: 'div_code' },
      { field: '배우', colId: 'div_name' }
    ],
  },
];

const gridOptions = {
  defaultColDef: {
    resizable: true,
    width: 160,
  },
  columnDefs: columnDefs,
  rowData: null,
};
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then((response) => response.json())
    .then((data) => gridOptions.api.setRowData(data));
});

const [modalOpen, setModalOpen] = useState(false);

const openModal = () => {
  setModalOpen(true);
};
const closeModal = () => {
  setModalOpen(false);
};
const [code,setCode] = useState("");

const handleInputChange = (inputValue) => {
  console.log(inputValue);
  setCode(inputValue);
  // 모달에서 입력한 값이 출력됩니다.
}


registerLocale("ko", ko);

  const [startDate, setStartDate] = useState(new Date());
  return (
    <div> 
      
      <form style={{padding:"10"}}>
      지급년월<DatePicker
      
          showIcon
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyyMM"
          showMonthYearPicker
          locale="ko"
        />
        <button>조회</button>
      </form>
      <div style={{ float: "left"}}>
        <input type="text" value={code} onChange={handleInputChange} readOnly></input>
      <button onClick={openModal}>C</button>
       
        <CodeModal open={modalOpen} close={closeModal} onInputChange={handleInputChange} header="사업소득자 코드도움">
       
        </CodeModal>
      <div className="ag-theme-alpine" style={{ height: 500, width: 200 }}>
          <AgGridReact columnDefs={columnDefs} rowData={data}></AgGridReact>
        </div>
      <table style={{ border: "1px solid" ,width:200 }}>
        <thead></thead>

        <tbody>
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
      <div style={{ float: "left",marginLeft:"50px" }}>
        소득지급내역
        <div className="ag-theme-alpine" style={{ height: 700, width: 1000  }}>
          <AgGridReact columnDefs={columnDefs} rowData={data}></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default IncomeInput;
