import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { customerId } = useParams();
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
        `http://localhost:8080/api/users/customer/${customerId}`,
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
    if (!customerId) {
      return;
    }
    fetchUserData();
  }, [customerId]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/customer/${customerId}`,
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
      <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center mt-8 max-w-md mx-auto shadow-md">
        <div className="text-2xl font-semibold mb-3">Lỗi</div>
        <p>{error}</p>
        <button
          onClick={() => fetchUserData()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-white">
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
                  {userData?.name || "Hồ Sơ Người Dùng"}
                </h1>
                <p className="opacity-80">{userData?.user?.email || ""}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex mt-8 border-b border-white/20">
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "view"
                    ? "border-b-2 border-white"
                    : "opacity-70 hover:opacity-90"
                }`}
                onClick={() => setActiveTab("view")}
              >
                Xem Thông Tin
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "edit"
                    ? "border-b-2 border-white"
                    : "opacity-70 hover:opacity-90"
                }`}
                onClick={() => setActiveTab("edit")}
              >
                Chỉnh Sửa Thông Tin
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : activeTab === "view" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileItem
                    label="Họ và Tên"
                    value={userData?.name || "Chưa đặt"}
                  />
                  <ProfileItem
                    label="Email"
                    value={userData?.user?.email || "Không có"}
                  />
                  <ProfileItem
                    label="Giới Tính"
                    value={userData?.gender ? "Nam" : "Nữ"}
                  />
                  <ProfileItem
                    label="Số Điện Thoại"
                    value={userData?.phone || "Chưa đặt"}
                  />
                  <ProfileItem
                    label="Địa Chỉ"
                    value={userData?.address || "Chưa đặt"}
                  />
                  <ProfileItem
                    label="Điểm Thưởng"
                    value={userData?.point || "0"}
                    badge={true}
                  />
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Chỉnh Sửa
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <FormField
                    label="Họ và Tên"
                    name="name"
                    register={register}
                    validation={{
                      required: "Họ và tên là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Họ và tên phải dài ít nhất 6 ký tự",
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/u,
                        message: "Họ và tên chỉ được chứa chữ cái và dấu cách",
                      },
                    }}
                    errors={errors}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Giới Tính
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register("gender")}
                    >
                      <option value={true}>Nam</option>
                      <option value={false}>Nữ</option>
                    </select>
                  </div>

                  <FormField
                    label="Địa Chỉ"
                    name="address"
                    register={register}
                    validation={{
                      required: "Địa chỉ là bắt buộc",
                      minLength: {
                        value: 10,
                        message: "Địa chỉ phải dài ít nhất 10 ký tự",
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9\s,.-ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/u,
                        message:
                          "Địa chỉ chỉ được chứa chữ cái, số, dấu cách, dấu phẩy, dấu chấm, dấu gạch ngang và ký tự tiếng Việt",
                      },
                    }}
                    errors={errors}
                  />

                  <FormField
                    label="Số Điện Thoại"
                    name="phone"
                    register={register}
                    validation={{
                      required: "Số điện thoại là bắt buộc",
                      pattern: {
                        value: /^(03|05|07|08|09)[0-9]{8}$/,
                        message:
                          "Số điện thoại phải là số Việt Nam hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, hoặc 09)",
                      },
                    }}
                    errors={errors}
                  />

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab("view")}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      Hủy
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex justify-center items-center transition duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Đang Cập Nhật...
                        </>
                      ) : (
                        "Lưu Thay Đổi"
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
  );
};

const ProfileItem = ({ label, value, badge }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    {badge ? (
      <div className="flex items-center">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {value} điểm
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
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...register(name, validation)}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

export default ProfilePage;
