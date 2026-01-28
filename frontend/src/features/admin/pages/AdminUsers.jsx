/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import styles from "./AdminUsers.module.css";
const AdminUsers = () => {
  const { token } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("https://backend-production-fccb.up.railway.app/admin/users", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) throw new Error("failed to load users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    const res = await fetch("https://backend-production-fccb.up.railway.app/admin/users/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      alert("failed to delete user");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) return <p className={styles.statusMessage}>Loading users...</p>;
  if (error)
    return (
      <p className={styles.statusMessage} style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👥 Admin: Manage Users</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Delete User</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.role === "admin" ? (
                      <button className={styles.btnDisabled}>
                        🚫 Can't delete admin
                      </button>
                    ) : (
                      <button
                        className={styles.btnDelete}
                        onClick={() => deleteUser(u._id)}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {users
          .filter((u) => u.role !== "admin")
          .map((u) => (
            <div className={styles.mobileCard} key={u._id}>
              <p>
                <strong>Name:</strong> {u.name}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Role:</strong> {u.role}
              </p>

              <div className={styles.actions}>
                {u.role === "admin" ? (
                  <button className={styles.btnDisabled}>
                    🚫 Can't delete admin
                  </button>
                ) : (
                  <button
                    className={styles.btnDelete}
                    onClick={() => deleteUser(u._id)}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminUsers;
