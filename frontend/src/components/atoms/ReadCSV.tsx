import { StringifyOptions } from "querystring";
import React, { useEffect, useState } from "react";

interface props {
  label: string;
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
  let data2DArray = csvRows.slice(1).map((row) => row.split(",")); //coneverts each row to an array of strings seperated with ","
  let colArray = data2DArray[0].map((col, i) => {
    data2DArray = data2DArray.filter((row) => !row);
    data2DArray.map((row) => {
      parseFloat(reduceSpecialCharacters(row[i]));
    });
    return data2DArray;
  });
  let obj = Object.assign(
    {},
    ...keys.map((key, id) => ({ [key]: colArray[id] }))
  );
  return obj;
};

const ReadCSV = ({ label }: props) => {
  const [file, setFile] = useState();
  const [object, setObject] = useState({});
  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event: any) {
        setObject(csvFileToObject(String(event.target.result)));
      };
      fileReader.readAsText(file);
    }
  };
  useEffect(() => {
    console.log("read object", object);
  }, [object, setObject]);

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
