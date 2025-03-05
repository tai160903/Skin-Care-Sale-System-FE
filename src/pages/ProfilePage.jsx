import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <header>
        <h1>Hồ sơ người dùng</h1>
      </header>
      <main>
        <section className="profile-info">
          <img
            src={userData.profileImage || "path/to/default-profile-image.jpg"}
            alt="Profile"
            className="profile-image"
          />
          <h2 className="username">{userData.username || "Không có tên"}</h2>
          <p className="bio">{userData.bio || "Không có mô tả"}</p>
        </section>
        <section className="profile-details">
          <h3>Chi tiết</h3>
          <ul>
            {Object.entries(userData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value ? value.toString() : "N/A"}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <p>
          &copy; {new Date().getFullYear()} Profile Page. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;
