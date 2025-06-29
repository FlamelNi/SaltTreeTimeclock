import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { Employee } from "../../datatype";
// import "./LandingPage.css";

const DEFAULT_USER = <h3>User name</h3>;

interface Props {
  is_dropdown: boolean;
  user_list: Employee[];
  curr_user: Employee | null;
  curr_user_set: Function;
}
const UserBar: React.FC<Props> = ({ is_dropdown, user_list, curr_user, curr_user_set }) => {
  // const [curr_user, setCurr_user] = useState(null as Employee | null);

  // useEffect(() => {
  //   if (0 < user_list.length) {
  //     setCurr_user(user_list[0]);
  //   }
  // }, [user_list]);

  return (
    <>
      <div className="header-row user-logout-row">
        <div>
          {is_dropdown ? (
            <>
              <Dropdown className="user-dropdown">
                {curr_user == null ? (
                  DEFAULT_USER
                ) : (
                  <>
                    <Dropdown.Toggle variant="outline-secondary" className="user-button">
                      {curr_user.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {user_list.map((user) => (
                        <Dropdown.Item
                          key={`Dropdown_${user.id}`}
                          onClick={() => {
                            curr_user_set(user);
                          }}
                        >
                          {user.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </>
                )}
              </Dropdown>
            </>
          ) : (
            <>
              {0 < user_list.length ? (
                <>
                  <h2>{user_list[0].name}</h2>
                </>
              ) : (
                DEFAULT_USER
              )}
            </>
          )}
        </div>
        <div>
          <Button className="logout-button" variant="outline-danger">
            Log out
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserBar;
