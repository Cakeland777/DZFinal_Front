import React, { useState } from "react";
import EarnerGrid from "./EarnerGrid";
import Registration from "./Registration";

const RegistPage = (props) => {
  const [value, setValue] = useState("");
  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  props.setTitle("사업소득자등록");
  return (
    <div>
      <div>
        {" "}
        {/* width 값 수정 */}
        <div style={{ padding: "10px", width: "90%" }}>
          <EarnerGrid
            value={value}
            onValueChange={handleValueChange}
            setEarnerCodes={props.setEarnerCodes}
          />
        </div>
        <Registration value={value} />
      </div>
    </div>
  );
};

export default RegistPage;
