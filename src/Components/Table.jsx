import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB_uQJjpKDH7QUYDrplsBg96Z8-EfIuhnw",
  authDomain: "beeweb-test-1.firebaseapp.com",
  projectId: "beeweb-test-1",
  storageBucket: "beeweb-test-1.appspot.com",
  messagingSenderId: "758089186888",
  appId: "1:758089186888:web:e9438de23d1c86d415227d",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tableColumns = ["id", "name", "description", "date", "status"]; // to order properly

const Table = () => {
  // const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    id: "",
    name: "",
    description: "",
    // date: "", // having issues
    status: "",
  });
  const [editableRow, setEditableRow] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "data");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      let i = 0;
      for (const doc of snapshot.docs) {
        fetchedData.push(doc.data());
        fetchedData[i].ref = doc.ref;
        i++;
      }
      setFilteredData(fetchedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQueries]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  const handleBlur = async (rowIndex, field, docRef) => {
    console.log(filteredData);
    let updateData = filteredData[rowIndex][field];
    if (field === "id") {
      updateData = parseInt(updateData);
    } else if (field === "date") {
      updateData = new Date(updateData);
    }

    await updateDoc(docRef, {
      [field]: updateData,
    });
    setTimeout(() => {
      setEditableRow("");
    });
  };

  const handleSearch = async () => {
    let q = query(collection(db, "data"));
    const whereConditions = Object.entries(searchQueries)
      .filter(([field, value]) => value !== "")
      .map(([field, value]) => {
        if (field === "id") {
          return where(field, "==", parseInt(value));
        } else {
          return where(field, "==", value);
        }
      });

    whereConditions.forEach((whereCondition) => {
      q = query(q, whereCondition);
    });
    try {
      const querySnapshot = await getDocs(q);
      const fetchedData = [];
      let i = 0;
      for (const doc of querySnapshot.docs) {
        fetchedData.push(doc.data());
        fetchedData[i].ref = doc.ref;
        i++;
      }
      setFilteredData(fetchedData);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  return (
    <>
      {editableRow || editableRow === 0 ? (
        <div className="absolute bottom-1 left-0 right-0 top-0 z-20 cursor-default bg-black/50"></div>
      ) : (
        <></>
      )}
      <div className="max-w-[80vw] overflow-auto bg-gray-300 ">
        <table className="block min-w-full  border-collapse  border md:table">
          <thead className="block md:table-header-group">
            <tr className="border-grey-500 absolute -left-full -top-full block border md:relative md:left-auto md:top-auto md:table-row  md:border-none">
              {tableColumns.map((column) => {
                return (
                  <th
                    key={column}
                    className="md:border-grey-500 bg-gray-600 p-2 text-center font-bold text-white md:table-cell md:border"
                    data-resizable
                  >
                    {column[0].toUpperCase().concat(column.slice(1))}
                  </th>
                );
              })}
            </tr>
            <tr>
              {tableColumns.map((key) => {
                let type = "";
                switch (key) {
                  case "id":
                    type = "number";
                    break;
                  case "name":
                    type = "string";
                    break;
                  case "description":
                    type = "description";
                    break;
                  case "date":
                    type = "date";
                    break;
                }
                return (
                  <th
                    key={key}
                    className="md:border-grey-500 block bg-gray-600 p-2 text-left font-bold md:table-cell md:border"
                    data-resizable
                  >
                    <span className="inline-block w-1/3 font-bold md:hidden">
                      {key[0].toUpperCase().concat(key.slice(1))}
                    </span>
                    {key !== "date" && (
                      <input // getting issues
                        name={key}
                        type={type}
                        value={searchQueries[key]}
                        onChange={handleInputChange}
                        className="rounded border px-2 py-1"
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {filteredData.length ? (
              filteredData.map((row, rowIndex) => {
                const rowIsSelected = editableRow === rowIndex;
                return (
                  <tr
                    className={`${
                      rowIsSelected
                        ? "relative z-30 !bg-gray-300"
                        : editableRow || editableRow === 0
                        ? "!bg-gray-500"
                        : ""
                    } ${
                      rowIndex % 2 == 0 ? " bg-gray-300" : " bg-gray-500"
                    } border-grey-300 block border md:table-row md:border-none`}
                    key={rowIndex}
                  >
                    {tableColumns.map((key) => {
                      let type = "";
                      const columnData =
                        key === "date"
                          ? convertSecondsToDateString(row[key].seconds)
                          : row[key];
                      switch (key) {
                        case "id":
                          type = "number";
                          break;
                        case "name":
                          type = "string";
                          break;
                        case "description":
                          type = "description";
                          break;
                        case "date":
                          type = "date";
                          break;
                      }
                      return (
                        <td
                          key={key}
                          className="md:border-grey-500 block p-2 text-left md:table-cell md:border"
                        >
                          <span className="inline-block w-1/3 font-bold md:hidden">
                            {key[0].toUpperCase().concat(key.slice(1))}
                          </span>
                          {(() => {
                            switch (key) {
                              case "status":
                                return (
                                  <div
                                    className="w-full cursor-default"
                                    onBlur={() =>
                                      handleBlur(rowIndex, key, row.ref)
                                    }
                                  >
                                    <select
                                      value={columnData}
                                      onChange={(e) => {
                                        setFilteredData((prevData) => {
                                          const updatedData = [...prevData];
                                          updatedData[rowIndex][key] =
                                            e.target.value;
                                          return updatedData;
                                        });
                                      }}
                                      onMouseDown={() => {
                                        setEditableRow(rowIndex);
                                      }}
                                      className="w-full appearance-none bg-transparent px-2 py-1 focus:outline-none active:rounded active:border active:bg-white active:outline-none active:outline-white"
                                    >
                                      <option value="active">Active</option>
                                      <option value="pending">Pending</option>
                                      <option value="canceled">Canceled</option>
                                    </select>
                                  </div>
                                );
                              case "description":
                                return (
                                  <textarea
                                    value={columnData}
                                    rows="1"
                                    onClick={() => {
                                      setEditableRow(rowIndex);
                                    }}
                                    onChange={(e) => {
                                      setFilteredData((prevData) => {
                                        const updatedData = [...prevData];
                                        updatedData[rowIndex][key] =
                                          e.target.value;
                                        return updatedData;
                                      });
                                    }}
                                    onBlur={() =>
                                      handleBlur(rowIndex, key, row.ref)
                                    }
                                    className="w-full bg-transparent px-2 py-1 focus:rounded focus:border-none focus:bg-white focus:outline-none focus:outline-white"
                                  />
                                );
                              default:
                                return (
                                  <input
                                    type={type}
                                    value={columnData}
                                    onChange={(e) => {
                                      setFilteredData((prevData) => {
                                        const updatedData = [...prevData];
                                        updatedData[rowIndex][key] =
                                          e.target.value;
                                        return updatedData;
                                      });
                                    }}
                                    onClick={() => {
                                      setEditableRow(rowIndex);
                                    }}
                                    onBlur={() =>
                                      handleBlur(rowIndex, key, row.ref)
                                    }
                                    className="w-fit rounded bg-transparent px-2 py-1 focus:bg-white focus:outline-none focus:outline-white"
                                  />
                                );
                            }
                          })()}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <div className="flex w-full items-center bg-gray-300 p-6 text-center">
                No Results Found
              </div>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;

function convertSecondsToDateString(seconds) {
  if (typeof seconds !== "number") return seconds;
  const date = new Date(seconds * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const dateString = `${year}-${month}-${day}`;
  return dateString;
}
