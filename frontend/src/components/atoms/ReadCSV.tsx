import React, { useEffect, useState } from "react";

const ReadCSV = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string:any) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i:any) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object:any, header:any, index:any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event: any) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput)
      };
      fileReader.readAsText(file);
    }
  };

  useEffect(()=>{
    console.log(array)
  },[])  
  return (
    <div className="mt-4">
        <label className="label">
        <span className="label-text">Import Wing Data CSV</span>
      </label>
      <form className="mt-2">
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button className="btn mt-2"
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
    </div>
  );
};

export default ReadCSV;
