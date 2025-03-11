import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";

const ProfilePage = () => {
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("view");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/customer/${userId}`,
      );
      const data = response.data.data;
      setUserData(data);
      setValue("name", data?.name || "");
      setValue("address", data?.address || "");
      setValue("phone", data?.phone || "");
      setValue("gender", data?.gender);
    } catch {
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUserData();
  }, [userId]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/customer/${userId}`,
        {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          gender: formData.gender,
        },
      );
      toast.success(response.data.message);
      await fetchUserData();
      setActiveTab("view");
    } catch {
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mt-16 max-w-md mx-auto">
        <div className="text-xl font-semibold mb-2">Error</div>
        <p>{error}</p>
        <button
          onClick={() => fetchUserData()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-8 pb-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-400 px-6 py-8 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {userData?.name || "User Profile"}
                  </h1>
                  <p className="opacity-80">{userData?.user?.email || ""}</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex mt-8 border-b border-white/20">
                <button
                  className={`pb-2 px-4 text-sm font-medium ${activeTab === "view" ? "border-b-2 border-white" : "opacity-70"}`}
                  onClick={() => setActiveTab("view")}
                >
                  View Profile
                </button>
                <button
                  className={`pb-2 px-4 text-sm font-medium ${activeTab === "edit" ? "border-b-2 border-white" : "opacity-70"}`}
                  onClick={() => setActiveTab("edit")}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading profile data...</p>
                </div>
              ) : activeTab === "view" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileItem
                      label="Full Name"
                      value={userData?.name || "Not set"}
                    />
                    <ProfileItem
                      label="Email"
                      value={userData?.user?.email || "Not available"}
                    />
                    <ProfileItem
                      label="Gender"
                      value={userData?.gender ? "Male" : "Female"}
                    />
                    <ProfileItem
                      label="Phone"
                      value={userData?.phone || "Not set"}
                    />
                    <ProfileItem
                      label="Address"
                      value={userData?.address || "Not set"}
                    />
                    <ProfileItem
                      label="Points"
                      value={userData?.point || "0"}
                      badge={true}
                    />
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setActiveTab("edit")}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <FormField
                      label="Full Name"
                      name="name"
                      register={register}
                      validation={{ required: "Full name is required" }}
                      errors={errors}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Gender
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        {...register("gender")}
                      >
                        <option value={true}>Male</option>
                        <option value={false}>Female</option>
                      </select>
                    </div>

                    <FormField
                      label="Address"
                      name="address"
                      register={register}
                      validation={{ required: "Address is required" }}
                      errors={errors}
                    />

                    <FormField
                      label="Phone Number"
                      name="phone"
                      register={register}
                      validation={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10,12}$/,
                          message: "Please enter a valid phone number",
                        },
                      }}
                      errors={errors}
                    />

                    <div className="flex space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab("view")}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Components
const ProfileItem = ({ label, value, badge }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    {badge ? (
      <div className="flex items-center">
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
          {value} points
        </span>
      </div>
    ) : (
      <p className="text-gray-900 font-medium">{value}</p>
    )}
  </div>
);

const FormField = ({ label, name, register, validation, errors }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block">{label}</label>
    <input
      type="text"
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      {...register(name, validation)}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

export default ProfilePage;
