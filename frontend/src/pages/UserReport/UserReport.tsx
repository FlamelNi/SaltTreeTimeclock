import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./UserReport.css";
import UserBar from "../../components/UserBar/UserBar";

interface Props {
  user_list: String[];
}
const UserReport: React.FC<Props> = ({ user_list }) => {
  return (
    <div className="report-container">
      <div className="report-header">
        {/* Row 1: User dropdown and Log out */}
        <UserBar is_dropdown={true} user_list={user_list} />

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
    </div>
  );
};

export default UserReport;
