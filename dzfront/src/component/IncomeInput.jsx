import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import CodeModal from "./CodeModal";
const IncomeInput = () => {

const data = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 }
];

const columnDefs = [
  { headerName: 'Make', field: 'make' },
  { headerName: 'Model', field: 'model' },
  { headerName: 'Price', field: 'price' }
];
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
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div>
      <form>
        지급년월{" "}
        <DatePicker
          showIcon
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyyMM"
          showMonthYearPicker
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
