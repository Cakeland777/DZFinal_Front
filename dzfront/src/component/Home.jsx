import React from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";
function Home(props) {
  props.setTitle("");

  return (
    <div>
      <body className="welcome">
        <span id="splash-overlay" class="splash"></span>
        <span id="welcome" class="z-depth-4"></span>

        <main className="valign-wrapper">
          <span className="container grey-text text-lighten-1 ">
            <img
              src="/BizLogo.png"
              style={{ width: "300px", float: "left", height: "200px" }}
            ></img>
            <div
              className="button-container"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="top-buttons">
                <Link
                  to="/earnerRead"
                  className="waves-effect waves-light btn"
                  style={{
                    width: "210px",
                    marginRight: "10px",
                    fontWeight: "bold",
                  }}
                >
                  사업소득조회
                </Link>
                <Link
                  to="/registPage"
                  style={{
                    width: "210px",
                    marginRight: "10px",
                    fontWeight: "bold",
                  }}
                  className="waves-effect waves-light btn"
                >
                  사업소득자등록
                </Link>
              </div>

              <div className="bottom-buttons">
                <Link
                  to="/incomeInput2"
                  style={{
                    width: "210px",
                    marginRight: "10px",
                    fontWeight: "bold",
                  }}
                  className="waves-effect waves-light btn"
                >
                  사업소득자료입력
                </Link>
                <Link
                  to="/codeconversion"
                  style={{
                    width: "210px",
                    marginRight: "10px",
                    fontWeight: "bold",
                  }}
                  className="waves-effect waves-light btn"
                >
                  소득구분코드변환
                </Link>
              </div>
            </div>
          </span>
        </main>
      </body>
    </div>
  );
}

export default Home;
