import React, { useEffect, useState } from "react";

interface props {
  label: string;
  setter: (value: any) => void;
}

const reduceSpecialCharacters = (str: string) => {
  if (str.includes("\r")) {
   str = str.replace(/\r/g, "");
    return str;
  }
  return str;
};

const csvFileToObject = (string: string) => {
  const csvRows = string.split("\n"); //creates an array in each row is a string
  let keys = csvRows[0].split(","); //creates an array in which each object is a
  keys = keys.map(key => reduceSpecialCharacters(key))
  let data2DArray = csvRows.slice(1).map((row) => row.split(",")); //coneverts each row to an array of strings seperated with ","
  let colArray = data2DArray[0].map((col, i) => {
    let finalArray:number[] = data2DArray.map((row) => parseFloat(reduceSpecialCharacters(row[i])));
    return finalArray
  });
  console.log("sorted data", colArray);
  let obj = Object.assign(
    {},
    ...keys.map((key, id) => ({ [key]: colArray[id] }))
  );
  console.log("Object to return", obj);
  return obj;
};

const ReadCSV = ({ label, setter }: props) => {
  const [file, setFile] = useState();
  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event: any) {
        console.log("Import started");
        let objectRead: object = csvFileToObject(String(event.target.result));
        console.log("Object read", objectRead);
        setter(objectRead);
        console.log("Import finished");
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div className="mt-4">
      <label className="label">
        <span className="label-text"> {label}</span>
      </label>
      <form className="mt-2">
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          className="btn mt-2"
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
