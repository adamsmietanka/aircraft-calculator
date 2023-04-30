import React from "react";
import { ReactComponent as Info } from "../../assets/info.svg";

interface Props {
  text: string;
}

const InfoTooltip = ({ text }: Props) => {
  return (
    <div className="tooltip" data-tip={text}>
      <Info className="w-4 ml-1 opacity-50 relative bottom-0.5" />
    </div>
  );
};

export default InfoTooltip;
