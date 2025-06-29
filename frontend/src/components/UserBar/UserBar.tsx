import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Employee } from "../../datatype";
import { add_new_employee, update_employee, delete_employee } from "../../firestore";

const DEFAULT_USER = <h3>User name</h3>;

// Password hashing helper (browser, SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  // convert buffer to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface Props {
  is_dropdown: boolean;
  is_user_change: boolean;
  user_list: Employee[];
  curr_user: Employee | null;
  curr_user_set: Function;
  // Optionally, a callback for parent to refresh/reload users
  onUserListChange?: () => void;
  onLogout?: () => void;
}
const UserBar: React.FC<Props> = ({ is_dropdown, is_user_change, user_list, curr_user, curr_user_set, onUserListChange, onLogout }) => {
  // Modal and form state
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"new" | "edit">("new");
  const [modalError, setModalError] = useState("");

  const [modalName, setModalName] = useState("");
  const [modalUsername, setModalUsername] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalPayRate, setModalPayRate] = useState<string>("");
  // is_admin always false, no input or state needed
  const [editChangePassword, setEditChangePassword] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Populate modal for Edit
  function openEditUser() {
    if (!curr_user) return;
    setUserModalMode("edit");
    setModalName(curr_user.name);
    setModalUsername(curr_user.username);
    setModalPassword("");
    setModalPayRate(curr_user.pay_rate.toString());
    // is_admin always false, nothing to set here
    setEditChangePassword(false);
    setModalError("");
    setShowUserModal(true);
  }

  // Populate modal for New
  function openNewUser() {
    setUserModalMode("new");
    setModalName("");
    setModalUsername("");
    setModalPassword("");
    setModalPayRate("");
    // is_admin always false, nothing to set here
    setModalError("");
    setShowUserModal(true);
  }

  // Submit handler for New/Edit User
  async function handleUserSubmit() {
    if (!modalName.trim() || !modalUsername.trim() || !modalPayRate.trim() || (userModalMode === "new" && !modalPassword)) {
      setModalError("Please fill in all required fields.");
      return;
    }
    let payRateNum = Number(modalPayRate);
    if (isNaN(payRateNum) || payRateNum <= 0) {
      setModalError("Pay rate must be a positive number.");
      return;
    }
    try {
      if (userModalMode === "new") {
        const passwordHash = await hashPassword(modalPassword);
        await add_new_employee(modalName, modalUsername, passwordHash, payRateNum, false);
        setShowUserModal(false);
        if (onUserListChange) onUserListChange();
      } else if (userModalMode === "edit") {
        let updateFields: any = {
          name: modalName,
          username: modalUsername,
          pay_rate: payRateNum,
          is_admin: false,
        };
        if (editChangePassword && modalPassword) {
          updateFields.password_hash = await hashPassword(modalPassword);
        }
        await update_employee(curr_user!.id, updateFields);
        setShowUserModal(false);
        if (onUserListChange) onUserListChange();
      }
    } catch (err) {
      setModalError("Error saving user. Check username uniqueness or try again.");
    }
  }

  // Delete user handler
  async function handleDeleteUser() {
    if (!curr_user) return;
    try {
      await delete_employee(curr_user.id);
      setShowDeleteModal(false);
      if (onUserListChange) onUserListChange();
    } catch {
      setDeleteError("Unable to delete user. Try again.");
    }
  }

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
        <div style={{ display: "flex", gap: 8 }}>
          {is_user_change ? (
            <>
              <Button variant="primary" onClick={openNewUser}>
                New User
              </Button>
              <Button variant="warning" onClick={openEditUser} disabled={!curr_user}>
                Edit User
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(true);
                  setDeleteError("");
                }}
                disabled={!curr_user}
              >
                Delete User
              </Button>
            </>
          ) : (
            <></>
          )}

          <Button
            className="logout-button"
            variant="outline-danger"
            onClick={() => {
              if (onLogout) onLogout();
            }}
          >
            Log out
          </Button>
        </div>
      </div>

      {/* User (New/Edit) Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{userModalMode === "new" ? "New User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="modalName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={modalName} onChange={(e) => setModalName(e.target.value)} autoFocus />
            </Form.Group>
            <Form.Group controlId="modalUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={modalUsername} onChange={(e) => setModalUsername(e.target.value)} />
            </Form.Group>
            {userModalMode === "edit" && (
              <Form.Group controlId="modalEditPassword" className="mb-3">
                <Form.Check
                  label="Change password"
                  checked={editChangePassword}
                  onChange={(e) => {
                    setEditChangePassword(e.target.checked);
                    setModalPassword("");
                  }}
                />
              </Form.Group>
            )}
            {(userModalMode === "new" || editChangePassword) && (
              <Form.Group controlId="modalPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} autoComplete="new-password" />
              </Form.Group>
            )}
            <Form.Group controlId="modalPayRate" className="mb-3">
              <Form.Label>Pay Rate ($/hr)</Form.Label>
              <Form.Control type="number" value={modalPayRate} onChange={(e) => setModalPayRate(e.target.value)} min={0} step={0.01} />
            </Form.Group>
            {/* No is_admin checkbox - always false */}
            {modalError && <div style={{ color: "red", marginBottom: 8 }}>{modalError}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUserSubmit}>
            {userModalMode === "new" ? "Create" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm to delete this user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{curr_user?.name}</b>?{deleteError && <div style={{ color: "red", marginTop: 8 }}>{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserBar;
