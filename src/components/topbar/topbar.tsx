import { useMemo } from "react";
import BasicSelect from "./components/basic_select/basic_select";
import "./topbar.scss";
import { ROLE_OPTIONS } from "./role_options";

type TopbarProps = {
  value: string;
  onChange: (value: string) => void;
};

function Topbar({ value, onChange }: TopbarProps) {
  const selectedRoleLabel = useMemo(() => { 
    const matchingRole = ROLE_OPTIONS.find(
      (option) => option.value === value
    );

    return matchingRole?.label ?? "";
  }, [value]);


  return (  
    <div className="topbar">
      <div className="topbar__left">
        <BasicSelect value={value} onChange={onChange} />
      </div>
      <div className="topbar__center" aria-live="polite">
        {selectedRoleLabel}
      </div>
      <div className="topbar__right"></div>
    </div>
  );
}

export default Topbar;
