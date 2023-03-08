import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker from "react-datepicker";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const EarnerRead = () => {
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    { field: "worker_id" },
    { field: "earner_name" },
    { field: "artist_type" },
    { field: "artist_ins_red" },
    { field: "total_payment" },

    { field: "dif_payment" },
    { field: "belonging_ym" },
    { field: "payment_date" },
    { field: "etc" },
    { field: "zonecode" },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/login1")
      .then((result) => result.json())
      .then((rowData) => {
        const wrappedData = [rowData];
        setRowData(wrappedData);
      });
  }, []);

  const [selected, setSelected] = useState("");
  const [selected2, setSelected2] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [earner, setEarner] = useState("");
  function handleSelect2(event) {
    setSelected2(event.target.value);
  }

  function handleSelect(event) {
    setSelected(event.target.value);
  }
  function handleDate1(event) {
    setDate1(event.target.value);
  }
  function handleDate2(event) {
    setDate2(event.target.value);
  }
  function handleEarner(event) {
    setEarner(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/earner_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        param1: "accrual_ym",
        param2: date1,
        param3: date2,
        param4: "earner_code",
        param5: "",
        param6: "earner_no",
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
      <form onSubmit={handleSubmit}>
        기준
        <select onChange={handleSelect} value={selected}>
          <option value="accrual_ym">1.귀속년월</option>
          <option value="payment_ym">2.지급년월</option>
        </select>
        <input value={date1} onChange={handleDate1} type="text"></input>~
        <input onChange={handleDate2} value={date2} type="text"></input>
        소득자<input onChange={handleEarner} value={earner} type="text"></input>
        정렬
        <select onChange={handleSelect2} value={selected2}>
          <option value="earner_no">1.소득자명순</option>
        </select>
        <button type="submit">조회</button>
      </form>
      <Link to="/earnerRead">소득자별</Link> |{" "}
      <Link to="/earnDivRead">소득구분별</Link>
      <div className="ag-theme-alpine" style={{ width: 2000, height: 800 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};
export default EarnerRead;
