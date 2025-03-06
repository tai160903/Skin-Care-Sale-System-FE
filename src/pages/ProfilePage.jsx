import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";


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
          `http://localhost:8080/api/users/customer/${userId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Populate form with data
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
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/customer/${userId}`,
        {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        },
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
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

      <form
        className="max-w-md mx-auto mt-20"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            {...register("name", { required: "Full name is required" })}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Full name
          </label>
          {errors.fullName && (
            <span className="text-red-500">{errors.fullName.message}</span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            {...register("address", { required: "Address is required" })}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Address
          </label>
          {errors.address && (
            <span className="text-red-500">{errors.address.message}</span>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            {...register("phone", { required: "Phone is required" })}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Phone
          </label>
          {errors.phone && (
            <span className="text-red-500">{errors.phone.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default ProfilePage;
