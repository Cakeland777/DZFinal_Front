import React, {
  useState,
  useRef, useMemo,
  useCallback
} from "react";
import { TbFileX} from "react-icons/tb";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { format } from "date-fns";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "400px",
    height: "600px",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",

  },
};
const LinkStyle = {
  display: "inline-block",
  padding: "0.5rem",
  margin: "0 1rem",
  textDecoration: "none",
  fontWeight: "bold",
  color: "gray",
  borderBottom: "2px solid transparent",
  transition: "all 0.2s ease-in-out",
};

const ActiveLinkStyle = {
  borderBottom: "5px solid black",
  color: "black",
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    style={LinkStyle}
    activeStyle={ActiveLinkStyle}
  >
    {children}
  </Link>
);
const EarnDivRead = (props) => {
  const earnerGridRef=useRef();
  props.setTitle("사업소득조회");
  registerLocale("ko", ko);
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
      minWidth:180
    },
    { field: "is_native", headerName: "내/외국인", resizable: true,maxWidth:130 },
    { field: "count", headerName: "건수", resizable: true ,maxWidth:100},

    { field: "total_payment", headerName: "연간총지급액", resizable: true },
    { field: "tax_rate", headerName: "세율(%)", resizable: true ,maxWidth:130},
    { field: "tax_income", headerName: "소득세", resizable: true },

    { field: "tax_local", headerName: "지방소득세", resizable: true },
    { field: "artist_cost", headerName: "예술인경비", resizable: true },
    { field: "ins_cost", headerName: "고용보험료", resizable: true },
    { field: "real_payment", headerName: "계", resizable: true },
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
    "940913",
    "940918",
    "940919",
    "940926",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handlePrevClick = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setEarner(divOptions[selectedIndex - 1]);
    }
  };
  const handleDoublePrevClick = () => {
 
      setSelectedIndex(0);
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
    fetch("http://localhost:8080/list/search_div_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        read_by: selectedOption,
        start_date: parseInt(format(startDate, "yyyyMM")),
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
  const onEarnerGridReady = (params) => {
    earnerGridRef.current.api.sizeColumnsToFit();
  };
  return (
    <div>
   <div>
   <NavLink to="/earnerRead">소득자별</NavLink>
      <NavLink to="/earnDivRead">소득구분별</NavLink>
    </div>
    <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", border: "1px solid grey"  }}>
  <div style={{ display: "flex", alignItems: "center", marginRight: "1rem" ,marginLeft:"2rem"}}>
    기준
    <select value={selectedOption} onChange={handleChange}>
      <option value="accrual_ym">1.귀속년월</option>
      <option value="payment_ym">2.지급년월</option>
    </select>
  </div>
  <div style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
  <div style={{ position: "relative", zIndex: 800 }}>
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      minDate={new Date(2022, 0, 1)}
      maxDate={new Date(2022, 11, 31)}
      dateFormat="yyyy.MM"
      locale={"ko"}
      placeholderText="2022."
      showMonthYearPicker
    />
  </div>
  ~
  <div style={{ position: "relative", zIndex: 800 }}>
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      minDate={new Date(2022, 0, 1)}
      maxDate={new Date(2022, 11, 31)}
      locale={"ko"}
      placeholderText="2022."
      dateFormat="yyyy.MM"
      showMonthYearPicker
    />
  </div>
</div>
  <div style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
    소득구분
    <input
      onChange={handleEarner}
      value={earner}
      type="text"
      onClick={() => setIsModalOpen(true)}
      readOnly
      style={{ width: "100px" }}
    ></input>
  </div>
  <div style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
  현재소득구분
  <button style={{ width: "35px", marginRight: "0.1rem" }} onClick={handleDoublePrevClick}>
    &lt;&lt;
  </button>
  <button style={{ width: "35px", marginRight: "0.1rem" }} onClick={handlePrevClick}>
    &lt;
  </button>
  <select value={earner} onChange={handleDivChange}>
    {divOptions.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
  <button style={{ width: "35px", marginRight: "0.1rem" }} onClick={handleNextClick}>
    &gt;
  </button>
  <button style={{ width: "35px", marginRight: "0.1rem" }} onClick={handleDoubleNextClick}>
    &gt;&gt;
  </button>
</div>
 
        <button type="submit" style={{ display: "flex",alignItems: "center",width:"60px",marginLeft: "35rem" }}>
          조회
        </button>
      </form>
      <div
        className="ag-theme-alpine"
        style={{ width: 2000, height: 800, zIndex: -100 ,padding:"10px",marginLeft:"20px"}}
      >
        <AgGridReact
          ref={earnerGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          overlayLoadingTemplate={
            '<span style="padding: 10px;"><TbFileX>데이터가 없습니다</span>'
          }
          overlayNoRowsTemplate={
            '<span style="padding: 10px;">데이터가 없습니다</span>'
          }
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          onGridReady={onEarnerGridReady}
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
              style={{ height: 400, width: 400 }}
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
              <div style={{ textAlign: "center",marginTop:50 }}>
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
