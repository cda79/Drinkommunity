import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function AccountSettings() {
  const { token, logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userThumbnail, setUserThumbnail] = useState(user?.imageThumb || null); // Add state for thumbnail

  let username = "Guest";
  username = user?.username || username;

  let nickname = user?.nickname || "No nickname set! Set one here";

  useEffect(() => {
    if (!token) {
      navigate("/home");
    }
  }, [token, navigate]);

  // Update thumbnail state when user context changes
  useEffect(() => {
    if (user?.imageThumb) {
      setUserThumbnail(user.imageThumb);
    }
  }, [user?.imageThumb]);

  async function updateThumbnail() {
    const newThumbnail = document.getElementById("updateThumbURL").value;

    if (!newThumbnail) {
      alert("Please enter a thumbnail URL.");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/update-thumbnail",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ imageThumb: newThumbnail }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setUserThumbnail(newThumbnail); // Update state immediately on success
        document.getElementById("updateThumbURL").value = ""; // Clear input
        alert("Thumbnail updated successfully!");
      } else {
        alert(data.message || "Failed to update thumbnail.");
      }
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      alert("An error occurred while updating thumbnail.");
    }
  }

  function getCleanImageUrl(url) {
    if (!url) return null;
    if (url.includes("search?q=")) {
      try {
        const directUrl = url.split("search?q=")[1];
        return decodeURIComponent(directUrl);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  async function updateUserSettings() {
    const newNickname = document.getElementById("nickname").value;
    const newUsername = document.getElementById("username").value;
    const blank = "";
    const newPassword = document.getElementById("password").value;
    const confirmNewPassword = document.getElementById("confirmPassword").value;
    const updateData = {};

    if (newNickname !== blank) {
      updateData.newNickname = newNickname;
    }
    if (newUsername !== blank) {
      updateData.newUsername = newUsername;
    }
    if (newPassword !== blank) {
      if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match!");
        return;
      }
      updateData.newPassword = newPassword;
    }
    if (Object.keys(updateData).length === 0) {
      alert("Please enter at least one field to update.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updateData),
      });
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }
      if (res.ok) {
        alert("User settings updated successfully!");
      } else {
        alert(data.message || "Failed to update user settings.");
      }
    } catch (error) {
      console.error("Error updating user settings:", error);
      alert("An error occurred while updating user settings.");
    }
  }

  return (
    <div>
      {token && (
        <div className="page-container">
          {/* Header */}
          <div className="header-container">
            <Link to="/home">
              <img
                src={logo}
                alt="Company Logo"
                className="logo-container"
              />{" "}
            </Link>
            <hr className="plain-line" />
            <div className="header-wrapper">
              <Link className="header-item" to="/home">
                Home
              </Link>
              <Link className="header-item" to="/dashboard">
                Dashboard
              </Link>
              <Link className="header-item" to="/create">
                Create
              </Link>
              <Link className="header-item-active" to="/account">
                Account
              </Link>
            </div>
          </div>
          {/* Title */}
          <header className="user-settings-container">
            <h1>Account settings</h1>
            <h2>
              {username} - {nickname}
            </h2>
            <div className="settings-container">
              <div className="icon-settings-wrapper">
                {userThumbnail ? (
                  <img
                    src={getCleanImageUrl(userThumbnail)}
                    crossOrigin="anonymous"
                    alt="User Thumbnail"
                    className="user-icon-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                    }}
                  />
                ) : (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                    alt="No avatar"
                    className="user-icon-thumb"
                  />
                )}
                <label htmlFor="updateThumbURL">Update Thumbnail URL:</label>
                <input
                  type="text"
                  id="updateThumbURL"
                  placeholder="Enter new thumbnail URL"
                />
                <button
                  onClick={updateThumbnail}
                  className="button"
                  style={styles.logoutBtn}
                >
                  Confirm
                </button>
              </div>
              <div className="options-settings-wrapper">
                <label htmlFor="nickname">Set Nickname:</label>
                <input
                  type="text"
                  id="nickname"
                  placeholder="Enter new nickname"
                />

                <label htmlFor="username">Update Username:</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter new username"
                />

                <label htmlFor="password">Update Password:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                />

                <button
                  onClick={updateUserSettings}
                  className="button"
                  style={styles.logoutBtn}
                >
                  Confirm
                </button>
              </div>
            </div>
            <button onClick={logout} id="logout-button">
              Logout
            </button>
          </header>
        </div>
      )}
    </div>
  );
}

const styles = {};

export default AccountSettings;
