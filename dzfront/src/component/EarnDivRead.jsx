import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { Link } from "react-router-dom";
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const EarnDivRead= () => {

 const gridRef = useRef(); // Optional - for accessing Grid's API
 const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 const autoSizeAll = () => {
  const allColumnIds = [];
  gridRef.getAllColumns().forEach(column => allColumnIds.push(column.colId));;
  gridRef.autoSizeColumns(allColumnIds, false);
};
 // Each Column Definition results in one Column.
 const [columnDefs, setColumnDefs] = useState([
   {field: '소득구분', filter: true,
   width: 120},
   {field: '소득자명(상호)', filter: true,width: 150},
   {field: '주민(사업자)등록번호',width: 180},
   {field: '내/외국인',width: 120},
   {field: '건수',width: 100},
   {field: '연간총지급액',width: 150},
   {field: '세율(%)',width: 100},
   {field: '소득세',width: 180},
   {field: '지방소득세',width: 180},
   {field: '예술인경비',width: 160},
   {field: '고용보험료',width: 180},
   {field: '계',width: 150},
 
 ]);

 // DefaultColDef sets props common to all Columns
 const defaultColDef = useMemo( ()=> ({
     sortable: true
   }));

 // Example of consuming Grid Event
 const cellClickedListener = useCallback( event => {
   console.log('cellClicked', event);
 }, []);

 // Example load data from sever
 useEffect(() => {
   fetch('https://www.ag-grid.com/example-assets/row-data.json')
   .then(result => result.json())
   .then(rowData => setRowData(rowData))
 }, []);

 // Example using Grid's API
 const buttonListener = useCallback( e => {
   gridRef.current.api.deselectAll();
 }, []);
 const [earner, setEarner] = useState("");
 const [date1, setDate1] =useState("");
 const [date2, setDate2] =useState("");
  const [password, setPassword] = useState("");
 
  function handleEarner(event) {
    setEarner(event.target.value);
  }

  function handleDate1(event) {
    setDate1(event.target.value);
  }
  function handleDate2(event) {
    setDate2(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();}
 return (
   <div>
     <form onSubmit={handleSubmit}>
    기준
    <select>
  <option value="param1" name="param1">1.귀속년월</option>
  <option value="param2" name="param1">2.지급년월</option>
  </select>
<input value={date1} onChange={handleDate1} type="text"  ></input>~<input onChange={handleDate2} value={date2} type="text"></input>

소득구분<input  onChange={handleEarner} value={earner} type="text" placeholder='사업자소득구분' ></input>
  현재소득구분
    <select>
  <option value="param1" name="param5">1.소득자명순</option>
 
  </select>
  <button type='submit' >조회</button>
    </form>
    <Link to="/earnerRead">소득자별</Link> | <Link to="/earnDivRead">소득구분별</Link>
    

     {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
     <div className="ag-theme-alpine" style={{width: 1800, height: 600}}>

       <AgGridReact
           ref={gridRef} // Ref for accessing Grid's API

           rowData={rowData} // Row Data for Rows

           columnDefs={columnDefs} // Column Defs for Columns
           defaultColDef={defaultColDef} // Default Column Properties
          
           animateRows={true} // Optional - set to 'true' to have rows animate when sorted
           rowSelection='multiple' // Options - allows click selection of rows
       
           onCellClicked={cellClickedListener} // Optional - registering for Grid Event
           />
     </div>
   </div>
 );
};

export default EarnDivRead;