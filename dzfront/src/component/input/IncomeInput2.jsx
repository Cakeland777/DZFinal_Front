import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, { useMemo, useRef, useState } from 'react';
import '../../css/IncomeInput2.css';
import ReactModal from "react-modal";
import { AgGridReact } from 'ag-grid-react';
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
const bottomData = [
  {
    귀속년월: '합계',
    지급년월일: '',
    지급총액: '2,000,000',
    세율: '',
    소득세: '60,000',
    지방소득세: '6,000',
    세액계: '66,000',
    예술인경비: '',
    고용보험료: '',
    차인지급액: '1,934,000'
  },
];
const data = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  
const LeftColumnDefs = [
   // { headerName: "v", field: "v", height: 100, width: 50},
   // { headerName: "소득자명", field: "name", height: 100, width: 90}, 
    {
    headerName: 'v', height: 100, width: 50,
    marryChildren: true,
    children: [
      { field: '', colId: '' ,height: 100, width: 50}
    ],
   },
    {
      headerName: '소득자명', height: 100, width: 90,
      marryChildren: true,
      children: [
        { field: '', colId: '',height: 100, width: 90 }
      ],
    },
    {
      headerName: '주민(외국인)번호', height: 100, width: 150,
      marryChildren: true,
      children: [
        { field: '내', colId: 'is_native' , height: 100, width: 50},
        { field: '990909-1099999', colId: 'number' , height: 100, width: 150},
      ],
    },
    {
      headerName: '소득구분', height: 100, width: 90,
      marryChildren: true,
      children: [
        { field: '940302', colId: 'div_code' , height: 100, width: 90},
        { field: '배우', colId: 'div_name' , height: 100, width: 70}
      ],
    },
  ];
 

const IncomeInput2 = () => {
  const [rowData, setRowData] = useState();

  const topGrid = useRef(null);
  const bottomGrid = useRef(null);

  const defaultColDef = useMemo(
    () => ({
        editable: true,
         sortable: true,
         resizable: true,
         flex: 1,
         minWidth: 100,
    }),
    []
  );
 
  const columnDefs = useMemo(
    () => [
      { field: '귀속년월', width: 200 },
      { field: '지급년월일', width: 150 },
      { field: '지급총액', width: 150 },
      { field: '세율', width: 120 },
      { field: '소득세', width: 150 },
      { field: '지방소득세', width: 150 },
      { field: '세액계', width: 100 },
      { field: '예술인경비', width: 100 },
      { field: '고용보험료', width: 100 },
      { field: '차인지급액', width: 100 }
    ],
    []
  );


  registerLocale("ko", ko);

  const [startDate, setStartDate] = useState(new Date());
  return (
    <div id="container">
      <form style={{ padding: "10"}}>

<span>지급년월<DatePicker
    showIcon
    selected={startDate}
    onChange={(date) => setStartDate(date)}
    dateFormat="yyyyMM"
    showMonthYearPicker
    locale="ko" /></span>
<button> 조회</button>
</form>
      <div id="header" >
          
      </div>

    <div id="content" >
      <div id="left">

      <div id="leftTop" className="ag-theme-alpine" style={{ 
        // height: 500, width: 400 
        }}>
          <AgGridReact columnDefs={LeftColumnDefs} rowData={data}></AgGridReact>
      </div>

      <div id="leftBottom">
      <table style={{ border: "1px solid black" }}>
        <thead>
        </thead>
        <tbody>
         <tr>
            <td rowSpan="8" >총 계</td>
         </tr>

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
  </div>
      
      <div id="right"
          style={{ display: 'flex', flexDirection: 'column',flexWrap:"wrap" }}
          className="ag-theme-alpine">
      
              <div style={{ flex: '1 1 auto' }}>
                  <AgGridReact
                      ref={topGrid}
                      alignedGrids={bottomGrid.current ? [bottomGrid.current] : undefined}
                      rowData={rowData}
                      defaultColDef={defaultColDef}
                      columnDefs={columnDefs}
                      suppressHorizontalScroll />
              </div>

              <div style={{ flex: 'none', height: '100px' }}>
                  <AgGridReact
                      ref={bottomGrid}
                      alignedGrids={topGrid.current ? [topGrid.current] : undefined}
                      rowData={bottomData}
                      defaultColDef={defaultColDef}
                      columnDefs={columnDefs}
                      headerHeight="0"
                      rowStyle={{ fontWeight: 'bold' }} />
              </div>
      </div>
     </div>
     
      
   
    
      </div>
          
  );
};
export default IncomeInput2;