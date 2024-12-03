import React, { useState } from "react";
import "./App.css";
import TheTable from "./TheTable";

function App() {
  const [selectedGrade, setSelectedGrade] = useState(1); // Default to 1st grade
  const [gradeData, setGradeData] = useState({
    1: [], // Data for 1st grade
    2: [], // Data for 2nd grade
    3: [], // Data for 3rd grade
  });

  const handleGradeChange = (event) => {
    setSelectedGrade(Number(event.target.value)); // Update the selected grade
  };

  const handleRowsChange = (grade, newRows) => {
    setGradeData((prevData) => ({
      ...prevData,
      [grade]: newRows,
    }));
  };

  return (
    <div className="App">
      <h1>학점 계산기</h1>
      <div>
        <label htmlFor="gradeSelect">학년 선택: </label>
        <select
          id="gradeSelect"
          value={selectedGrade}
          onChange={handleGradeChange}
        >
          <option value={1}>1학년</option>
          <option value={2}>2학년</option>
          <option value={3}>3학년</option>
        </select>
      </div>
      <TheTable
        gradeLevel={selectedGrade}
        rows={gradeData[selectedGrade]} // Pass the current grade's data
        onRowsChange={(newRows) => handleRowsChange(selectedGrade, newRows)} // Update data for the current grade
      />
    </div>
  );
}

export default App;
