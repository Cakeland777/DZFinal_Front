import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { Link, UNSAFE_DataRouterContext } from "react-router-dom";
import ReactModal from "react-modal";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import NumberRenderer from "../util/NumberRenderer";

const LinkStyle = {
  display: "inline-block",
  padding: "0.4rem",
  margin: "0 1rem",
  textDecoration: "none",
  fontWeight: "bold",
  color: "gray",
  borderBottom: "3px solid #6273D9",
  transition: "all 0.2s ease-in-out",
};

const ActiveLinkStyle = {
  borderBottom: "2px solid black",
  color: "black",
};

const NavLink = ({ to, children }) => (
  <Link to={to} style={LinkStyle} activeStyle={ActiveLinkStyle}>
    {children}
  </Link>
);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "800px",
    height: "450px",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // .sidebar-menu의 z-index 값보다 큰 값으로 설정
  },
};
const EarnerColumn = [
  { headerName: "Code", field: "earner_code", width: 120 },
  { headerName: "소득자명", field: "earner_name", width: 160 },
  { headerName: "내/외", field: "is_native", width: 80 },
  { headerName: "주민등록번호", field: "personal_no", width: 160 },
  { headerName: "소득구분명", field: "div_name", width: 120 },
  { headerName: "구분코드", field: "div_code", width: 120 },
];
const EarnerRead = (props) => {
  const earnerGridRef = useRef();
  props.setTitle("사업소득조회");
  let api;
  const onEarnerGridReady = (params) => {
    api = params.api;
    earnerGridRef.current.api.sizeColumnsToFit();
  };
  registerLocale("ko", ko);
  useEffect(() => {
    fetch("http://localhost:8080/input/earner_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        search_value: "",
        payment_ym: "202401",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setEarnerRowData(data.earner_list);
      });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState("");
  const [EarnerRowData, setEarnerRowData] = useState();
  const gridRef = useRef();
  function getCellStyle(params) {
    if (params.value === 0 || undefined) {
      return {
        backgroundColor: "lightgrey",
        color: "transparent",
        opacity: 0.4,
        textAlign: "right",
      };
    } else {
      return { textAlign: "right" };
    }
  }
  const columnDefs = [
    {
      field: "earner_name_rs",
      headerName: "소득자명",
      resizable: true,
      maxWidth: 100,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "personal_no",
      headerName: "주민(외국인)등록번호",
      resizable: true,
      maxWidth: 140,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "div_code_rs",
      headerName: "소득구분",
      resizable: true,
      maxWidth: 120,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "accrual_ym_rs",
      headerName: "귀속년월",
      resizable: true,
      maxWidth: 120,
    },
    {
      field: "payment_ym_rs",
      headerName: "지급년월일",
      resizable: true,
      maxWidth: 120,
    },
    {
      field: "total_payment_rs",
      headerName: "지급액",
      maxWidth: 130,
      resizable: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_rate_rs",
      headerName: "세율(%)",
      resizable: true,
      maxWidth: 90,
    },
    {
      field: "tuition_amount_rs",
      headerName: "학자금상환액",
      maxWidth: 140,
      resizable: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_income_rs",
      headerName: "소득세",
      resizable: true,
      maxWidth: 130,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_local_rs",
      headerName: "지방소득세",
      resizable: true,
      maxWidth: 130,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "artist_cost_rs",
      headerName: "예술/특고인경비",
      resizable: true,
      maxWidth: 140,
      minWidth: 130,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "ins_cost_rs",
      headerName: "고용보험료",
      resizable: true,
      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "real_payment_rs",
      headerName: "차인지급액",
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
      maxWidth: 150,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      filter: false,
      lockPosition: true,
    };
  }, []);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  const [selected, setSelected] = useState("earner_code");

  const [earner, setEarner] = useState("");

  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = `${earner} 사업소득조회`;

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      [`작업자_${localStorage.getItem("worker_id")}`],
      [],
      [
        "소득자명",
        "주민번호",
        "소득구분",
        "귀속년월",
        "지급년월",
        "지급액",
        "세율",
        "학자금상환액",
        "소득세",
        "지방소득세",
        "예술인/특고인 경비",
        "세액계",
        "차인지급액",
      ],
    ]);
    excelData.map((data) => {
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            data.earner_name_rs,
            data.personal_no,
            data.div_code_rs,
            data.accrual_ym_rs,
            data.payment_ym_rs,
            data.total_payment_rs,
            data.tax_rate_rs,
            data.tuition_amount_rs,
            data.tax_income_rs,
            data.tax_local_rs,
            data.artist_cost_rs,
            data.ins_cost_rs,
            data.real_payment_rs,
          ],
        ],
        { origin: -1 }
      );
      ws["!cols"] = [
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 50 },
        { wpx: 100 },
        { wpx: 150 },
        { wpx: 120 },
        { wpx: 150 },
        { wpx: 200 },
      ];
      return false;
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelButter = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelButter], { type: excelFileType });
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  };
  function handleSelect(event) {
    setSelected(event.target.value);
  }

  function handleEarner(event) {
    setEarner(event.target.value);
  }
  const EarnerModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log(selectedRows[0].earner_code);
    setEarner(selectedRows[0].earner_code);

    setIsModalOpen(false);
  }, []);

  const gridOptions = {
    pinnedBottomRowData: [],
    // headerHeight: 30,
    // rowHeight: 30,
  };
  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/list/search_earner_code", {
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
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        console.log(rowData.earnerInfo);
        setRowData(data.earnerInfo);
        const sums = data.earnerInfo.reduce(
          (acc, curr) => ({
            realPaymentSum: acc.realPaymentSum + curr.real_payment_rs,
            insCostSum: acc.insCostSum + curr.ins_cost_rs,
            artistSum: acc.artistSum + curr.artist_cost_rs,
            totalSum: acc.totalSum + curr.total_payment_rs,
            taxLocalSum: acc.taxLocalSum + curr.tax_local_rs,
            taxIncomeSum: acc.taxIncomeSum + curr.tax_income_rs,
            tuitionSum: acc.tuitionSum + curr.tuition_amount_rs,
          }),
          {
            realPaymentSum: 0,
            insCostSum: 0,
            artistSum: 0,
            totalSum: 0,
            taxLocalSum: 0,
            taxIncomeSum: 0,
            tuitionSum: 0,
          }
        );
        const {
          realPaymentSum,
          insCostSum,
          artistSum,
          totalSum,
          taxLocalSum,
          taxIncomeSum,
          tuitionSum,
        } = sums;
        earnerGridRef.current.api.setPinnedBottomRowData([
          {
            personal_no: "합계",
            ins_cost_rs: insCostSum,
            total_payment_rs: totalSum,
            tax_local_rs: taxLocalSum,
            artist_cost_rs: artistSum,
            real_payment_rs: realPaymentSum,
            tax_income_rs: taxIncomeSum,
            tuition_amount_rs: tuitionSum,
          },
        ]);

        earnerGridRef.current.columnApi.applyColumnState({
          state: [{ colId: selected, sort: "asc" }],
          defaultState: { sort: null },
        });
      });
  }
  function reducer(state, action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  const [state, dispatch] = useReducer(reducer, {
    search_value: "",
  });
  const { search_value } = state;
  const onChange = (e) => {
    dispatch(e.target);
    const { value } = e.target;

    fetch("http://localhost:8080/input/earner_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        search_value: value,
        payment_ym: "202401",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEarnerRowData(data.earner_list);
      });
  };
  const frameworkComponents = {
    numberRenderer: NumberRenderer,
  };

  return (
    <div>
      <div>
        <NavLink to="/earnerRead">소득자별</NavLink>
        <NavLink to="/earnDivRead">소득구분별</NavLink>
      </div>
      <form
        style={{ display: "flex", flexWrap: "wrap", border: "1px solid grey" }}
        onSubmit={handleSubmit}
      >
        <label
          style={{ display: "flex", alignItems: "center", marginLeft: "2rem" }}
        >
          기준
        </label>
        <select
          value={selectedOption}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
        >
          <option value="accrual_ym">1.귀속년월</option>
          <option value="payment_ym">2.지급년월</option>
        </select>
        <div>
          <label>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date(2022, 0, 1)}
              maxDate={new Date(2022, 11, 31)}
              placeholderText="2022."
              dateFormat="yyyy.MM"
              locale={"ko"}
              showMonthYearPicker
            />
          </label>
        </div>{" "}
        ~
        <div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={new Date(2022, 0, 1)}
            maxDate={new Date(2022, 11, 31)}
            placeholderText="2022."
            dateFormat="yyyy.MM"
            locale={"ko"}
            showMonthYearPicker
          />
        </div>
        <label style={{ marginLeft: "1rem" }}>소득자</label>
        <input
          onChange={handleEarner}
          onClick={() => setIsModalOpen(true)}
          value={earner}
          type="text"
          style={{ marginRight: "1rem", width: "5%" }}
          readOnly
        />
        <label style={{ marginRight: "1rem" }}>정렬</label>
        <select onChange={handleSelect} value={selected}>
          <option value="earner_name_rs">1.소득자명순</option>
          <option value="div_name_rs">2.소득구분순</option>
          <option value="payment_ym_rs">3.지급년월순</option>
          <option value="personal_no">4.주민(사업자)번호순</option>
        </select>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            width: "60px",
            marginLeft: "auto",
            marginRight: "10px",
          }}
          type="submit"
        >
          조회
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            width: "60px",
            marginRight: "30px",
          }}
          onClick={() => excelDownload(rowData)}
        >
          엑셀
        </button>
      </form>
      <div
        className="ag-theme-alpine"
        style={{
          width: "99%",
          height: "75vh",
          padding: "5px",
          marginLeft: "10px",
          fontSize: "10px",
          textAlign: "right",
        }}
      >
        <AgGridReact
          ref={earnerGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onEarnerGridReady}
          animateRows={true}
          overlayLoadingTemplate={
            '<span style="padding: 10px;"><TbFileX>데이터가 없습니다</span>'
          }
          overlayNoRowsTemplate={
            '<span style="padding: 10px;">데이터가 없습니다</span>'
          }
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
        />
      </div>
      <ReactModal
        style={customStyles}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        {
          <>
            <h4>사업소득자 코드도움</h4>
            <div
              className="ag-theme-alpine"
              style={{ height: 300, width: "800px" }}
            >
              <AgGridReact
                columnDefs={EarnerColumn}
                rowData={EarnerRowData}
                rowSelection={"single"}
                onCellDoubleClicked={EarnerModalDoubleClicked}
                ref={gridRef}
              />
            </div>

            <>
              <div style={{ textAlign: "center" }}>
                찾을 내용{" "}
                <input
                  type="text"
                  name="search_value"
                  style={{
                    width: "500px",
                    borderColor: "skyblue",
                    outline: "none",
                  }}
                  value={search_value}
                  onChange={onChange}
                ></input>
                <br />
                <button onClick={() => EarnerModalDoubleClicked()}>확인</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </>
          </>
        }
      </ReactModal>
    </div>
  );
};
export default EarnerRead;
