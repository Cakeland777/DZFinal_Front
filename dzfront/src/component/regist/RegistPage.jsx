import React, { useState } from "react";
import EarnerGrid from "./EarnerGrid";
import Registration from "./Registration";

const RegistPage = (props) => {
  const [value, setValue] = useState("");
  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  const [name, setName] = useState();

  props.setTitle("사업소득자등록");
  return (
    <div>
      <div>
        {" "}
        {/* width 값 수정 */}
        <div style={{ padding: "10px", width: "90%", marginLeft: "50px" }}>
          <EarnerGrid
            value={value}
            onValueChange={handleValueChange}
            setEarnerCodes={props.setEarnerCodes}
            setName={setName}
            name={name}
          />
        </div>
        <Registration value={value} setName={setName} name={name} />
      </div>
    </div>
  );
};

export default RegistPage;
