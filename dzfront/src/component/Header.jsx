import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/header.css";
import { IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";

function Head(props) {
  const isDeleteButtonVisible =
    props.title === "사업소득자등록" || props.title === "사업소득자료입력";

  const deleteEarner = () => {
    if (props.title === "사업소득자료입력") {
      console.log("넘어온 코드들", props.earnerCodes);
      console.log("넘어온 날짜", props.paymentYm);

      if (!props.earnerCodes || props.earnerCodes.length === 0) {
        Swal.fire("체크된 값이 없습니다", "", "info");
      } else {
        Swal.fire({
          title: "선택한 데이터를 삭제하겠습니까?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#77bdf7",
          cancelButtonColor: "#fa9a82",
          confirmButtonText: "확인",
          cancelButtonText: "취소",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch("http://localhost:8080/input/task_delete", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                worker_id: localStorage.getItem("worker_id"),
                earner_codes: props.earnerCodes,
                payment_ym: props.paymentYm,
              }),
            }).then((response) => response.json());
            Swal.fire("삭제완료", "", "success");
          }
        });
      }
    } else if (props.title === "사업소득자등록") {
      console.log("넘어온 코드들", props.earnerCodes);
      if (!props.earnerCodes || props.earnerCodes.length === 0) {
        Swal.fire("체크된 값이 없습니다", "", "info");
      } else {
        Swal.fire({
          title: "선택한 데이터를 삭제하겠습니까?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#77bdf7",
          cancelButtonColor: "#fa9a82",
          confirmButtonText: "확인",
          cancelButtonText: "취소",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch("http://localhost:8080/regist/earner_delete", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                worker_id: localStorage.getItem("worker_id"),
                earner_codes: props.earnerCodes,
              }),
            }).then((response) => response.json());
            Swal.fire({
              position: "center",
              icon: "success",
              title: "삭제 완료",
              showConfirmButton: false,
              timer: 1200,
            });
            setTimeout(window.location.replace("/registPage"), 3000);
          }
        });
      }
    }
  };

  return (
    <div className="header">
      <ul
        className="menu simple float-right"
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <li>
          <button
            type="button"
            className={`button small ${props.isMenuOpen ? "hide" : ""}`}
            onClick={props.onMenuToggle}
            style={{ marginRight: 10, height: 40, backgroundColor: "#3B42BF" }}
          >
            B
          </button>
        </li>

        <li style={{ marginLeft: 0, whiteSpace: "nowrap", marginTop: "15px" }}>
          <b>{props.title}</b>
        </li>
        {isDeleteButtonVisible && (
          <li>
            <button
              type="button"
              className={`button small ${props.isMenuOpen ? "hide" : ""}`}
              onClick={() => deleteEarner()}
              style={{ marginRight: 10, height: 40, marginLeft: 1500 }}
            >
              <IoTrashOutline style={{ height: 30, width: 40 }} />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

function Menu(props) {
  const [isLogin, setIsLogin] = React.useState(false);
  useEffect(() => {
    let status = localStorage.getItem("isLogon");
    if (status === "1") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  const navigate = useNavigate();
  const handleLinkClick = () => {
    props.onMenuToggle(false); // 사이드바 닫기
  };
  const logOut = () => {
    navigate("/login");
    localStorage.clear();
    handleLinkClick();
    Swal.fire({
      title: "로그아웃되었습니다",
      text: "",
      icon: "success",
    });
  };
  if (isLogin) {
    return (
      <div className={`sidebar-menu ${props.isMenuOpen ? "open" : ""}`}>
        <ul className="vertical menu">
          <div className="linkMenu">
            <li>
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: 5,
                  fontWeight: "bold",
                }}
                onClick={logOut}
              >
                로그아웃
              </Link>
            </li>
            <li>
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: 5,
                  fontWeight: "bold",
                }}
                to="/earnerRead"
                onClick={handleLinkClick}
              >
                사업소득조회
              </Link>
            </li>

            <li>
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: 5,
                  fontWeight: "bold",
                }}
                to="/registPage"
                onClick={handleLinkClick}
              >
                사업소득자등록
              </Link>
            </li>
            <li>
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: 5,
                  fontWeight: "bold",
                }}
                to="/incomeInput2"
                onClick={handleLinkClick}
              >
                사업소득자료입력
              </Link>
            </li>
            <li>
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: 5,
                  fontWeight: "bold",
                }}
                to="/codeconversion"
                onClick={handleLinkClick}
              >
                코드변환
              </Link>
            </li>
          </div>
        </ul>
      </div>
    );
  }
  return (
    <div className={`sidebar-menu ${props.isMenuOpen ? "open" : ""}`}>
      <ul className="vertical menu">
        <div className="linkMenu">
          <li>
            <Link
              style={{
                textDecoration: "none",
                color: "white",
                margin: 5,
                fontWeight: "bold",
              }}
              to="/login"
              onClick={handleLinkClick}
            >
              로그인
            </Link>
          </li>
        </div>
      </ul>
    </div>
  );
}

function Header(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  }, []);

  return (
    <div className="app-container">
      <Head
        onMenuToggle={toggleMenu}
        title={props.title}
        earnerCodes={props.earnerCodes}
        paymentYm={props.paymentYm}
      />
      <Menu isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
    </div>
  );
}

export default Header;
