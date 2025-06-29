import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./UserReport.css";
import UserBar from "../../components/UserBar/UserBar";
import { Employee, WorkHour } from "../../datatype";
import { add_new_employee_test, get_work_hours_for_employee_between, update_employee_rate, add_new_work_hour } from "../../firestore";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Timestamp } from "firebase/firestore";

interface Props {
  user_list: Employee[];
}
const UserReport: React.FC<Props> = ({ user_list }) => {
  const [curr_user, setCurr_user] = useState(null as Employee | null);

  const getYYYYMMDD = (date: Date) => date.toISOString().slice(0, 10);
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [starting_date, setStarting_date] = useState(getYYYYMMDD(firstDayOfMonth));
  const [ending_date, setEnding_date] = useState(getYYYYMMDD(lastDayOfMonth));
  const [work_hours, setWork_hours] = useState<WorkHour[]>([]);

  // Change rate modal states
  const [showChangeRateModal, setShowChangeRateModal] = useState(false);
  const [changeRateValue, setChangeRateValue] = useState<number | undefined>(undefined);
  const [changeRateError, setChangeRateError] = useState<string>("");

  // Add new time modal states
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [addTimeDate, setAddTimeDate] = useState(getYYYYMMDD(new Date()));
  const now = new Date();
  const defaultStart = new Date(now.getTime() - 60 * 60 * 1000);
  const [addTimeStart, setAddTimeStart] = useState(defaultStart.toTimeString().slice(0, 5));
  const [addTimeEnd, setAddTimeEnd] = useState(now.toTimeString().slice(0, 5));
  const [addTimeRate, setAddTimeRate] = useState<number | undefined>(undefined);
  const [addTimeError, setAddTimeError] = useState<string>("");

  // Helpers for formatting and calculations
  function formatDate(ts: any) {
    if (!ts || !ts.toDate) return "";
    const date = ts.toDate();
    return date.toLocaleDateString();
  }
  function formatTime(ts: any) {
    if (!ts || !ts.toDate) return "";
    const date = ts.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function getDurationMinutes(start: any, end: any) {
    if (!start || !end || !start.toDate || !end.toDate) return 0;
    return (end.toDate().getTime() - start.toDate().getTime()) / (1000 * 60);
  }
  function getEarnings(start: any, end: any, rate: number) {
    const hrs = getDurationMinutes(start, end) / 60;
    return (hrs * rate).toFixed(2);
  }

  useEffect(() => {
    if (0 < user_list.length) {
      setCurr_user(user_list[0]);
    }
  }, [user_list]);

  useEffect(() => {
    //get workHour query and set it to work_hours
    const fetchWorkHours = async () => {
      if (curr_user) {
        const results = await get_work_hours_for_employee_between(curr_user.id, starting_date, ending_date);
        setWork_hours(results);
      } else {
        setWork_hours([]);
      }
    };
    fetchWorkHours();
  }, [curr_user, starting_date, ending_date]);

  return (
    <div className="report-container">
      <div className="report-header">
        {/* Row 1: User dropdown and Log out */}
        <UserBar is_dropdown={true} user_list={user_list} curr_user={curr_user} curr_user_set={setCurr_user} />

        {/* Row 2: Current Rate, Change Rate, Change Password, Print */}
        <div className="header-row control-row">
          {curr_user == null ? (
            <>
              <span className="rate-text">Current Rate: Loading</span>
            </>
          ) : (
            <>
              <span className="rate-text">Current Rate: ${curr_user.pay_rate}</span>
            </>
          )}
          <Button
            className="blue-button"
            variant="primary"
            onClick={() => {
              if (curr_user) {
                setChangeRateValue(curr_user.pay_rate);
                setShowChangeRateModal(true);
                setChangeRateError("");
              }
            }}
          >
            Change Rate
          </Button>
          <Button className="blue-button" variant="primary">
            Change Password
          </Button>
          <Button className="print-button" variant="outline-secondary">
            🖨️ Print
          </Button>
        </div>
      </div>

      <div className="report-filters">
        <Button
          className="blue-button"
          variant="primary"
          onClick={() => {
            setAddTimeDate(getYYYYMMDD(new Date()));
            const now = new Date();
            const defaultStart = new Date(now.getTime() - 60 * 60 * 1000);
            setAddTimeStart(defaultStart.toTimeString().slice(0, 5));
            setAddTimeEnd(now.toTimeString().slice(0, 5));
            setAddTimeRate(curr_user ? curr_user.pay_rate : 0);
            setAddTimeError("");
            setShowAddTimeModal(true);
          }}
        >
          Add new Time
        </Button>

        <div className="date-input">
          <label>Starting Date</label>
          <input type="date" value={starting_date} onChange={(e) => setStarting_date(e.target.value)} />
        </div>

        <div className="date-input">
          <label>Ending Date</label>
          <input type="date" value={ending_date} onChange={(e) => setEnding_date(e.target.value)} />
        </div>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time in</th>
            <th>Time out</th>
            <th>Time</th>
            <th>Rate</th>
            <th>Earnings</th>
            <th>
              <Button className="delete-button" variant="danger" hidden={true}>
                🗑️ Delete
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {work_hours.map((wh) => (
            <tr key={wh.id}>
              <td>{formatDate(wh.time_in)}</td>
              <td>{formatTime(wh.time_in)}</td>
              <td>{formatTime(wh.time_out)}</td>
              <td>
                {(() => {
                  const mins = getDurationMinutes(wh.time_in, wh.time_out);
                  let h = Math.floor(mins / 60);
                  let m = Math.round(mins % 60);
                  if (m === 60) {
                    h += 1;
                    m = 0;
                  }
                  return `${h}h${m > 0 ? ` ${m}m` : ""}`;
                })()}
              </td>
              <td>${wh.pay_rate.toFixed(2)}</td>
              <td>${getEarnings(wh.time_in, wh.time_out, wh.pay_rate)}</td>
              <td>
                <Button className="delete-button" variant="danger">
                  🗑️ Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-earnings">
        Total Earnings: ${work_hours.reduce((acc, wh) => acc + parseFloat(getEarnings(wh.time_in, wh.time_out, wh.pay_rate)), 0).toFixed(2)}
      </div>
      {/* <Button onClick={add_new_employee_test}>Add Test</Button> */}

      {/* Change Rate Modal */}
      <Modal show={showChangeRateModal} onHide={() => setShowChangeRateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Hourly Rate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="changeRateInput">
            <Form.Label>Current Rate ($/hr)</Form.Label>
            <Form.Control
              type="number"
              value={changeRateValue !== undefined ? changeRateValue : ""}
              onChange={(e) => setChangeRateValue(parseFloat(e.target.value))}
              min={0}
              step={0.01}
              autoFocus
            />
            {changeRateError && <div style={{ color: "red" }}>{changeRateError}</div>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowChangeRateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (changeRateValue === undefined || isNaN(changeRateValue) || changeRateValue <= 0) {
                setChangeRateError("Enter valid rate");
                return;
              }
              if (curr_user) {
                await update_employee_rate(curr_user.id, changeRateValue);
                // Update user_list in parent (if possible!)
                curr_user.pay_rate = changeRateValue;
                setShowChangeRateModal(false);
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Time Modal */}
      <Modal show={showAddTimeModal} onHide={() => setShowAddTimeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Work Hour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="addTimeDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={addTimeDate} onChange={(e) => setAddTimeDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTimeStart">
              <Form.Label>Starting Time</Form.Label>
              <Form.Control type="time" value={addTimeStart} onChange={(e) => setAddTimeStart(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTimeEnd">
              <Form.Label>Ending Time</Form.Label>
              <Form.Control type="time" value={addTimeEnd} onChange={(e) => setAddTimeEnd(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTimeRate">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="number"
                value={addTimeRate !== undefined ? addTimeRate : ""}
                min={0}
                step={0.01}
                onChange={(e) => setAddTimeRate(parseFloat(e.target.value))}
              />
            </Form.Group>
            {addTimeError && <div style={{ color: "red" }}>{addTimeError}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowAddTimeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              // Validate input
              if (!addTimeDate || !addTimeStart || !addTimeEnd || addTimeRate === undefined || isNaN(addTimeRate)) {
                setAddTimeError("Fill all fields correctly.");
                return;
              }
              if (curr_user) {
                // Construct Firestore Timestamps
                const timeIn = new Date(`${addTimeDate}T${addTimeStart}`);
                const timeOut = new Date(`${addTimeDate}T${addTimeEnd}`);
                if (timeIn >= timeOut) {
                  setAddTimeError("Starting time must be before ending time");
                  return;
                }
                await add_new_work_hour(curr_user.id, Timestamp.fromDate(timeIn), Timestamp.fromDate(timeOut), addTimeRate);
                setShowAddTimeModal(false);
                setAddTimeError("");
                // Refresh work hour list
                const results = await get_work_hours_for_employee_between(curr_user.id, starting_date, ending_date);
                setWork_hours(results);
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserReport;
