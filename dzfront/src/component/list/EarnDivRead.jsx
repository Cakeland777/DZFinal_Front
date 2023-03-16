import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { FaFile } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker from "react-datepicker";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { format } from "date-fns";

const EarnDivRead = () => {
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const columnDefs = [
    { field: "worker_id", headerName: "소득구분", resizable: true },
    { field: "earner_name", headerName: "소득자명(상호)", resizable: true },
    {
      field: "personal_no",
      headerName: "주민(사업자)등록번호",
      resizable: true,
    },
    { field: "is_native", headerName: "내/외국인", resizable: true },
    { field: "", headerName: "건수", resizable: true },

    { field: "total_payment", headerName: "연간총지급액", resizable: true },
    { field: "tax_rate", headerName: "세율(%)", resizable: true },
    { field: "tax_income", headerName: "소득세", resizable: true },
    { field: "tax_income", headerName: "소득세", resizable: true },
    { field: "tax_local", headerName: "지방소득세", resizable: true },
    { field: "artist_cost", headerName: "예술인경비", resizable: true },
    { field: "ins_cost", headerName: "고용보험료", resizable: true },
    { field: "", headerName: "계", resizable: true },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));


  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const [selectedOption, setSelectedOption] = useState("");

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState("");
  const [selected2, setSelected2] = useState("");

  const [earner, setEarner] = useState("");
  function handleSelect2(event) {
    setSelected2(event.target.value);
  }

  function handleSelect(event) {
    setSelected(event.target.value);
  }

  function handleEarner(event) {
    setEarner(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/search_div_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        param1: selectedOption,
        param2: format(startDate, "yyyyMM"),
        param3: format(endDate, "yyyyMM"),
        param4: earner,
        param5: selected2,
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        const wrappedData = [rowData.earnerInfo];
        setRowData(wrappedData);
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
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy.MM"
            showMonthYearPicker
          />
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
        소득구분
        <input onChange={handleEarner} value={earner} type="text"></input>
        정렬
        <select onChange={handleSelect2} value={selected2}>
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
          rowSelection="multiple"
          overlayLoadingTemplate="<b>데이터가 없습니다.</b>"
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};
export default EarnDivRead;
