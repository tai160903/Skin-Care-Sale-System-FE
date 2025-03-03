import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/customerId/${userId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Điền dữ liệu vào form
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [userId, setValue]);

  const onSubmit = async (formData) => {
    console.log(formData);
    // try {
    //   const response = await fetch(
    //     `http://localhost:8080/api/users/customerId/${userId}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(formData),
    //     },
    //   );

    //   if (!response.ok) {
    //     throw new Error("Cập nhật thất bại!");
    //   }

    //   alert("Cập nhật thành công!");
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <Link
          to="/"
          className="text-4xl font-bold text-green-700 cursor-pointer"
        >
          SkinCare
        </Link>
      </div>
      <div className="profile-container">
        <header>
          <h1>Hồ sơ người dùng</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <section className="profile-info">
              <label>Ảnh đại diện:</label>
              <input
                {...register("profileImage")}
                className="profile-image-input"
              />
              <img
                src="path/to/default-profile-image.jpg"
                alt="Profile"
                className="profile-image"
              />

              <label>Tên người dùng:</label>
              <input
                {...register("username", { required: "Tên là bắt buộc" })}
                className="input-field border-2"
              />
              {errors.username && (
                <p className="error">{errors.username.message}</p>
              )}

              <label>Tiểu sử:</label>
              <textarea {...register("bio")} className="input-field border-2" />
            </section>

            <section className="profile-details">
              <h3>Chi tiết</h3>
              <label>Email:</label>
              <input {...register("email")} className="input-field border-2" />

              <label>Số điện thoại:</label>
              <input {...register("phone")} className="input-field border-2" />

              <button type="submit" className="save-button">
                Cập nhật hồ sơ
              </button>
            </section>
          </form>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
