import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, { useMemo, useRef, useState } from 'react';
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

const IncomeInput2 = () => {
  const [EarnerModalOpen,setEarnerModalOpen]=useState(false);
const LeftColumnDefs = [
    { headerName: "v", field: "v"},
    { headerName: "Code", field: "Code"},
    { headerName: "소득자명", field: "name",onCellClicked: () => setEarnerModalOpen(true)}, 
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
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
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
    <><div>
          <form style={{ padding: "10" }}>

              지급년월<DatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyyMM"
                  showMonthYearPicker
                  locale="ko" />
              <button>조회</button>
          </form>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: 500 ,float:"left"}}>
          <AgGridReact columnDefs={LeftColumnDefs} rowData={data}></AgGridReact>
      </div>
      
      <ReactModal style={customStyles} isOpen={EarnerModalOpen} onRequestClose={() => setEarnerModalOpen(false)} >
  {
    
    <>  
    <h4>사업소득자 코드도움</h4>
    <div className="ag-theme-alpine" style={{ float:"left" ,height: 400, width: 400 }}>
        <AgGridReact
      
        />
        </div>
       
    <>
    <br/> 
          </></>
          }
</ReactModal>
     
      <div
          style={{ display: 'flex', flexDirection: 'column', height: '500px',width:'1000px',float:"left"  }}
          className="ag-theme-alpine"
      >
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
          

          
      <table style={{ border: "3px solid black" ,width:200,  }}>
        <thead>
           
        </thead>
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
          </>
  );
};
export default IncomeInput2;