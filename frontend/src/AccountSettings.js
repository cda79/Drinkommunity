import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function AccountSettings() {
    const { token, logout } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    let username = "Guest";
    username = user?.username || username;


    let nickname = user?.nickname || "No nickname set! Set one here";

    let userThumbnail = null;
    if (user?.imageThumb) {
        userThumbnail = user.imageThumb;
    }

    useEffect(() => {
        if (!token) {
        navigate("/home");
        }
    }, [token, navigate]);

    async function updateThumbnail() { // updating user thumbnail handler
    const newThumbnail = document.getElementById("updateThumbURL").value;
    
    if (!newThumbnail) {
        alert("Please enter a thumbnail URL.");
        return;
    }
    try {        const res = await fetch("http://localhost:5000/api/auth/update-thumbnail", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ imageThumb: newThumbnail }),
        });
        const data = await res.json();
        if (res.ok) {
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

    async function updateUserSettings() { // updating user data handler 
        
       
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
            const res = await fetch("http://localhost:5000/api/auth/update", { //send the updated data to the backend
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(updateData), //updating user data with the new info, only sends fields that are filled out
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
        
        <div className="page-container">
            { token && (
                <div>
                    <div>
                        <img
                            src={logo}
                            alt="Company Logo"
                            style={{ width: "100px", marginBottom: "10px" }}
                        />
                        <div>
                            <Link to="/home">Home</Link>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/create">Create</Link>
                            <Link to="/account">Account</Link>
                        </div>
                    </div>
            
                    <header className="main-header" style={styles.header}>
                        <div>
                        <h1>Account</h1>
                        <h3 style={styles.welcomeText}>{username}</h3>
                        <h4 style={styles.welcomeText}>{nickname}</h4>
                        {userThumbnail ? (
                        <img
                            src={getCleanImageUrl(userThumbnail)}
                            crossOrigin="anonymous"
                            alt="User Thumbnail"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src =  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"; }}
                        />
                        ) : (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" alt="No avatar" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                        )}
                        
                        <div> 
                            <label htmlFor="updateThumbURL">Update Thumbnail URL:</label>
                            <input type="text" id="updateThumbURL" placeholder="Enter new thumbnail URL" />
                            <button onClick={updateThumbnail} className="button" style={styles.logoutBtn}>Confirm</button>
                        </div>
                        <div>
                            <label htmlFor="nickname">Set Nickname:</label>
                            <input type="text" id="nickname" placeholder="Enter new nickname" />

                            <label htmlFor="username">Update Username:</label>
                            <input type="text" id="username" placeholder="Enter new username" />

                            <label htmlFor="password">Update Password:</label>
                            <input type="password" id="password" placeholder="Enter new password"  />
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm new password" />
                            
                             <button onClick={updateUserSettings} className="button" style={styles.logoutBtn}>Confirm</button>
                        </div>
                        
                        </div>
                        <button onClick={logout} className="button" style={styles.logoutBtn}>
                        Logout
                        </button>
                    </header>
                </div>
            )}
            
        </div>
    )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "#A12F0D",
    marginTop: "5px",
  },
  gardenTitle: {
    color: "#A12F0D",
    borderBottom: "2px solid #EFE7DF",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  imagePlaceholder: {
    color: "#999",
  },
  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default AccountSettings;
