import React, { useState, useRef } from "react";

function calculateGrade(score) {
  if (score >= 92) return "A+";
  if (score >= 91) return "A0";
  if (score >= 85) return "B+";
  if (score >= 80) return "B0";
  if (score >= 75) return "C+";
  if (score >= 70) return "C0";
  if (score >= 65) return "D+";
  if (score >= 60) return "D0";
  return "F";
}

function TheTable({ gradeLevel, rows, onRowsChange }) {
  const rowID = useRef(rows.length > 0 ? Math.max(rows.map((row) => row.id)) + 1 : 0);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows for deletion

  const addRow = () => {
    const newRow = {
      id: rowID.current,
      courseCategory: "교양",
      requirement: "필수",
      courseName: "",
      credits: 0,
      attendanceScore: 0,
      assignmentScore: 0,
      midtermScore: 0,
      finalScore: 0,
      totalScore: 0,
      grade: "",
    };
    onRowsChange([...rows, newRow]);
    rowID.current++;
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowID) => rowID !== id)
        : [...prevSelectedRows, id]
    );
  };

  const deleteRows = () => {
    if (selectedRows.length === 0) {
      alert("삭제할 행을 선택해주세요.");
      return;
    }
    onRowsChange(rows.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const validateValue = (value, min, max) => {
    if (value < min || value > max) {
      alert(`${min} ~ ${max} 사이의 값을 입력해주세요.`);
      return "";
    }
    return value;
  };

  const updateRowValue = (id, key, value) => {
    // 숫자 필드에만 변환 적용
    if (["credits", "attendanceScore", "assignmentScore", "midtermScore", "finalScore"].includes(key)) {
      value = Number(value);
      if (isNaN(value)) {
        value = ""; // 숫자가 아닌 경우 빈 값으로 설정
      }
    }

    // 유효성 검사
    if (key === "credits") value = validateValue(value, 1, 3);
    if (key === "attendanceScore" || key === "assignmentScore")
      value = validateValue(value, 0, 20);
    if (key === "midtermScore" || key === "finalScore")
      value = validateValue(value, 0, 30);

    // 업데이트
    onRowsChange(
      rows.map((row) =>
        row.id === id
          ? { ...row, [key]: value }
          : row
      )
    );
  };

  const saveRows = () => {
    const updatedRows = rows.map((row) => {
      const totalScore =
        row.attendanceScore +
        row.assignmentScore +
        row.midtermScore +
        row.finalScore;

      if (row.credits === 1) {
        // 학점이 1일 경우 PASS/Non Pass 처리
        return {
          ...row,
          totalScore,
          grade: totalScore >= 60 ? "PASS" : "Non Pass",
        };
      }

      // 학점이 2 이상일 경우 학점 계산
      const grade = calculateGrade(totalScore);
      return { ...row, totalScore, grade };
    });
    onRowsChange(updatedRows);
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={addRow}>추가</button>
        <button onClick={deleteRows}>삭제</button>
        <button onClick={saveRows}>저장</button>
      </div>
      <h2>{gradeLevel}학년</h2>
      <table width={1000} border={1}>
        <thead style={{ backgroundColor: "#00796B", color: "#ffffff" }}>
          <tr>
            <th>선택</th>
            <th>이수</th>
            <th>필수</th>
            <th>과목명</th>
            <th>학점</th>
            <th>출석점수</th>
            <th>과제점수</th>
            <th>중간고사</th>
            <th>기말고사</th>
            <th>총점</th>
            <th>성적</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={selectedRows.includes(row.id) ? "selected" : ""}
              onClick={() => toggleRowSelection(row.id)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
              <td>
                <select
                  value={row.courseCategory}
                  onChange={(e) => updateRowValue(row.id, "courseCategory", e.target.value)}
                >
                  <option value="교양">교양</option>
                  <option value="전공">전공</option>
                </select>
              </td>
              <td>
                <select
                  value={row.requirement}
                  onChange={(e) => updateRowValue(row.id, "requirement", e.target.value)}
                >
                  <option value="필수">필수</option>
                  <option value="선택">선택</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row.courseName}
                  onChange={(e) => updateRowValue(row.id, "courseName", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.credits}
                  onChange={(e) => updateRowValue(row.id, "credits", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.attendanceScore}
                  onChange={(e) => updateRowValue(row.id, "attendanceScore", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.assignmentScore}
                  onChange={(e) => updateRowValue(row.id, "assignmentScore", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.midtermScore}
                  onChange={(e) => updateRowValue(row.id, "midtermScore", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.finalScore}
                  onChange={(e) => updateRowValue(row.id, "finalScore", e.target.value)}
                />
              </td>
              <td>{row.totalScore}</td>
              <td>{row.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TheTable;
