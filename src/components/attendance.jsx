
import { useEffect, useState } from "react";
import "./attendance.css";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Fetch students using fetch API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const studentsWithAttendance = data.map((student) => {

          // Generate random attendance between 50 and 100
          const attendance = Math.floor(Math.random() * 51) + 50;

          // Generate random status
          let status;

          if (Math.random() > 0.5) {
            status = "Present";
          } else {
            status = "Absent";
          }

          return {
            ...student,
            attendance: attendance,
            status: status,
          };
        });

        setStudents(studentsWithAttendance);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Filter and sort students
  const filteredStudents = students
    .filter((s) => {
      if (filter === "All") {
        return true;
      } else {
        return s.status === filter;
      }
    })
    .filter((s) => {
      if (showLowAttendance === true) {
        return s.attendance < 75;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      return b.attendance - a.attendance;
    });

  return (
    <div className="container">
      <h1>Student Attendance Viewer 🎓</h1>

      
      <div className="filters">
        {["All", "Present", "Absent"].map((f) => {

          let buttonClass = "";

          if (filter === f) {
            buttonClass = "active";
          }

          return (
            <button
              key={f}
              className={buttonClass}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          );
        })}

        <label>
          <input
            type="checkbox"
            checked={showLowAttendance}
            onChange={() => {

              if (showLowAttendance === true) {
                setShowLowAttendance(false);
              } else {
                setShowLowAttendance(true);
              }

            }}
          />
          Show &lt;75% attendance
        </label>
      </div>

      {/* Students Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance %</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((student) => {

            let rowClass = "";

            if (selectedStudentId === student.id) {
              rowClass = "selected";
            }

            let attendanceColor;

            if (student.attendance >= 75) {
              attendanceColor = "green";
            } else {
              attendanceColor = "red";
            }

            return (
              <tr
                key={student.id}
                className={rowClass}
                onClick={() => setSelectedStudentId(student.id)}
              >
                <td>{student.name}</td>

                <td
                  style={{
                    color: attendanceColor,
                    fontWeight: "bold"
                  }}
                >
                  {student.attendance}%
                </td>

                <td>
                  <span className={"badge " + student.status.toLowerCase()}>
                    {student.status}
                  </span>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

