import { useState } from "react";

export default function useToggle() {
  const [value, setValue] = useState<boolean>(false);
  const toggleValue = (value: any) => {
    setValue((currentValue) =>
      typeof value === "boolean" ? value : !currentValue
    );
  };
  return [value, toggleValue];
}
