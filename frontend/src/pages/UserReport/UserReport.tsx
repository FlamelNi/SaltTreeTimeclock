import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./UserReport.css";
import UserBar from "../../components/UserBar/UserBar";
import { Employee } from "../../datatype";
import { add_new_employee_test } from "../../firestore";

interface Props {
  user_list: Employee[];
}
const UserReport: React.FC<Props> = ({ user_list }) => {
  const [curr_user, setCurr_user] = useState(null as Employee | null);

  useEffect(() => {
    if (0 < user_list.length) {
      setCurr_user(user_list[0]);
    }
  }, [user_list]);

  return (
    <div className="report-container">
      <div className="report-header">
        {/* Row 1: User dropdown and Log out */}
        <UserBar is_dropdown={true} user_list={user_list} curr_user={curr_user} curr_user_set={setCurr_user} />

        {/* Row 2: Current Rate, Change Rate, Change Password, Print */}
        <div className="header-row control-row">
          <span className="rate-text">Current Rate: $18.50</span>
          <Button className="blue-button" variant="primary">
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
        <Button className="blue-button" variant="primary">
          Add new Time
        </Button>

        <div className="date-input">
          <label>Starting Date</label>
          <input type="date" />
        </div>

        <div className="date-input">
          <label>Ending Date</label>
          <input type="date" />
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
              <Button className="delete-button" variant="danger">
                🗑️ Delete
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>{/* Table rows would be dynamically generated */}</tbody>
      </table>

      <div className="total-earnings">Total Earnings: $1237</div>
      {/* <Button onClick={add_new_employee_test}>Add Test</Button> */}
    </div>
  );
};

export default UserReport;
