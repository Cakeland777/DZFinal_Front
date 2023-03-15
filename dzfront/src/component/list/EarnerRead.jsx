import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { FaFile } from 'react-icons/fa';
import { BiCalendar } from "react-icons/bi";
import { Link } from "react-router-dom";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker from "react-datepicker";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
const EarnerRead = () => {
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const columnDefs =[
    { field: "earner_name", headerName: "소득자명", resizable: true },
    {
      field: "personal_no",
      headerName: "주민(외국인)등록번호",
      resizable: true,
    },
    { field: "div_name", headerName: "소득구분", resizable: true },
    { field: "accural_ym", headerName: "귀속년월", resizable: true },
    { field: "payment_ym", headerName: "지급년월일", resizable: true },

    { field: "total_payment", headerName: "지급액", resizable: true },
    { field: "tax-rate", headerName: "세율(%)", resizable: true },
    { field: "tuition_amount", headerName: "학자금상환액", resizable: true },
    { field: "tax_income", headerName: "소득세", resizable: true },
    { field: "tax_local", headerName: "지방소득세", resizable: true },
    { field: "artist_cost", headerName: "예술인경비", resizable: true },
    { field: "ins_cost", headerName: "고용보험료", resizable: true },
    { field: "real_payment", headerName: "차인지급액", resizable: true },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));
 
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const [selectedOption, setSelectedOption] = useState("accural_ym");

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [selected, setSelected] = useState("earner_name");

  const [earner, setEarner] = useState("");
  function handleSelect(event) {
    setSelected(event.target.value);
  }



  function handleEarner(event) {
    setEarner(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`http://localhost:8080/search_earner_code?param1=${selectedOption}&param2=${format(startDate, "yyyyMM")}&param3=${format(endDate, "yyyyMM")}&param4=${earner}&param5=${selected}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(result => result.json())
      .then(rowData => {
        setRowData([rowData.earnerInfo]);
      });
  }

  return (
    <div>
      <Link to="/earnerRead">소득자별</Link> |{" "}
      <Link to="/earnDivRead">소득구분별</Link>
      <form style={{ border: "1px solid black" }} onSubmit={handleSubmit}>
        기준
        <select value={selectedOption} onChange={handleChange}>
          <option value="accural_ym">1.귀속년월</option>
          <option value="payment_ym">2.지급년월</option>
        </select>
        <div style={{ position: "relative", zIndex: 800 }}>
          <label>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy.MM"
              showMonthYearPicker
            />
          </label>
        </div>{" "}
        ~
        <div style={{ position: "relative", zIndex: 800 }}>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy.MM"
            showMonthYearPicker
          />
        </div>
        소득자<input onChange={handleEarner} value={earner} type="text"></input>
        정렬
        <select onChange={handleSelect} value={selected}>
          <option value="earner_name">1.소득자명순</option>
          <option value="div">2.소득구분순</option>
          <option value="payment_ym">3.지급년월순</option>
          <option value="personal_no">4.주민(사업자)번호순</option>
        </select>
        <button type="submit" style={{marginLeft:"650px"}}>조회</button>
      </form>
      <div
        className="ag-theme-alpine"
        style={{ width: 2000, height: 800, zIndex: -100 }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          overlayLoadingTemplate="<FaFile /><b>데이터가 없습니다.</b>"
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};
export default EarnerRead;
