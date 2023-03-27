import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ReactModal from "react-modal";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker from "react-datepicker";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { format } from "date-fns";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "500px",
    height: "600px",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const EarnDivRead = () => {
  const [rowData, setRowData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef();

  const columnDefs = [
    { field: "div_code", headerName: "소득구분", resizable: true },
    { field: "earner_name", headerName: "소득자명(상호)", resizable: true },
    {
      field: "personal_no",
      headerName: "주민(사업자)등록번호",
      resizable: true,
    },
    { field: "is_native", headerName: "내/외국인", resizable: true },
    { field: "count", headerName: "건수", resizable: true },

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
  const DivModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setEarner(selectedRows[0].div_code);
    setIsModalOpen(false);
  }, []);
  const [divOptions, setDivOptions] = useState([
    "",
    "940100",
    "940301",
    "940302",
    "940304",
    "940306",
    "940903",
    "940910",
    "940912",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handlePrevClick = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setEarner(divOptions[selectedIndex - 1]);
    }
  };
  const handleDoublePrevClick = () => {
 
      setSelectedIndex(1);
      setEarner(divOptions[selectedIndex]);
    };
  const handleNextClick = () => {
    if (selectedIndex < divOptions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setEarner(divOptions[selectedIndex + 1]);
    }
  };
  const handleDoubleNextClick = () => {
    
      setSelectedIndex(8);
      setEarner(divOptions[selectedIndex]);
    
  };
  const [divRowData, setDivRowData] = useState();
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 180 },
    { headerName: "소득구분명", field: "div_name", width: 160 },
  ];
  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);
  const [selectValue, setSelectValue] = useState("");

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
  }, []);
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const [selectedOption, setSelectedOption] = useState("accrual_ym");

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState("");
  const [selected2, setSelected2] = useState("earner_name");

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
  function handleDivChange(event) {
    const value = event.target.value;
    setEarner(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/search_div_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        read_by: selectedOption,
        start_date: parseInt(format(startDate, "yyyyMM")),
        code_name: "earner_code",
        end_date: parseInt(format(endDate, "yyyyMM")),
        code_value: earner,
        order_by: selected2,
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        console.log(rowData);
        setRowData(rowData.earnerInfo);
      });
  }

  return (
    <div>
      <Link to="/earnerRead">소득자별</Link> |{" "}
      <Link to="/earnDivRead">소득구분별</Link>
      <form style={{ border: "1px solid black" }} onSubmit={handleSubmit}>
        기준
        <select value={selectedOption} onChange={handleChange}>
          <option value="accrual_ym">1.귀속년월</option>
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
        <input
          onChange={handleEarner}
          value={earner}
          type="text"
          onClick={() => setIsModalOpen(true)}
          readOnly
        ></input>
        현재소득구분
        <button onClick={handleDoublePrevClick}>◀◀</button>
        <button onClick={handlePrevClick}>◀</button>
        <select value={earner} onChange={handleDivChange}>
          {divOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button onClick={handleNextClick}>▶</button>
        <button onClick={handleDoubleNextClick}>▶▶</button>
        정렬
        <select onChange={handleSelect2} value={selected2}>
          <option value="earner_name">1.소득자명순</option>
          <option value="div">2.소득구분순</option>
          <option value="payment_ym">3.지급년월순</option>
          <option value="personal_no">4.주민(사업자)번호순</option>
        </select>
        <button type="submit" style={{ marginLeft: "650px" }}>
          조회
        </button>
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
      <ReactModal
        style={customStyles}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        {
          <>
            <h4>소득구분코드 도움</h4>
            <div
              className="ag-theme-alpine"
              style={{ float: "left", height: 400, width: 400 }}
            >
              <AgGridReact
                columnDefs={divColumn}
                rowData={divRowData}
                onGridReady={onGridReady}
                rowSelection={"single"}
                onRowDoubleClicked={DivModalDoubleClicked}
                onSelectionChanged={onSelectionChanged}
                ref={gridRef}
              />
            </div>

            <>
              <br />{" "}
              <div style={{ textAlign: "center" }}>
                <h5>선택 코드: {selectValue.div_code}</h5>
                <h5>구분명:{selectValue.div_name}</h5>
                <button onClick={DivModalDoubleClicked}>확인</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </>
          </>
        }
      </ReactModal>
    </div>
  );
};
export default EarnDivRead;
