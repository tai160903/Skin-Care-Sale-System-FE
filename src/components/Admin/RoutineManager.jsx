import { useEffect, useState } from "react";
import routineService from "../../services/adminService/routineService";

const RoutineManager = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [expandedRoutine, setExpandedRoutine] = useState(null);
  const [formData, setFormData] = useState({ skinType: "", steps: [] });

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const data = await routineService.getAllRoutines();
      setRoutines(data.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách routines.", err);
      setLoading(false);
    }
  };
  const handleDelete = async (routineId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa routine này?")) {
      try {
        await routineService.deleteRoutine(routineId);
        setRoutines(routines.filter((routine) => routine._id !== routineId));
      } catch (err) {
        setError("Không thể xóa routine.", err);
      }
    }
  };

  const handleEdit = (routine) => {
    setEditingRoutine(routine._id);
    setExpandedRoutine(null); // Collapse any expanded routine when editing
    setFormData({
      skinType: routine.skinType,
      steps: routine.steps.map((step) => ({
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
        recommendProducts: step.recommendProducts.map((prod) => prod._id),
      })),
    });
  };

  const handleChange = (e, stepIndex = null, field = null) => {
    if (stepIndex === null) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      const updatedSteps = [...formData.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        [field]: e.target.value,
      };
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const handleUpdate = async (routineId) => {
    try {
      const updatedRoutine = await routineService.updateRoutine(
        routineId,
        formData,
      );
      setRoutines(
        routines.map((routine) =>
          routine._id === routineId ? updatedRoutine : routine,
        ),
      );
      setEditingRoutine(null);
      fetchRoutines();
      setFormData({ skinType: "", steps: [] });
    } catch (error) {
      setError("Không thể cập nhật routine.", error);
    }
  };

  const toggleExpand = (routineId) => {
    setExpandedRoutine(expandedRoutine === routineId ? null : routineId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600 animate-pulse">Đang tải...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Quản Lý Routine
      </h1>
      {routines.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-10">
          Không có routine nào để hiển thị.
        </p>
      ) : (
        <div className="space-y-6">
          {routines.map((routine) => (
            <div
              key={routine._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              {editingRoutine === routine._id ? (
                // Edit Form
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Chỉnh sửa Routine ID: {routine._id}
                  </h2>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Loại da
                    </label>
                    <input
                      type="text"
                      name="skinType"
                      value={formData.skinType}
                      onChange={(e) => handleChange(e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Nhập loại da..."
                    />
                  </div>
                  {formData.steps.map((step, index) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">
                        Bước {step.stepNumber}
                      </h4>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleChange(e, index, "title")}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          placeholder="Nhập tiêu đề..."
                        />
                      </div>
                      <div className="space-y-2 mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Mô tả
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) =>
                            handleChange(e, index, "description")
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[120px]"
                          placeholder="Nhập mô tả..."
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleUpdate(routine._id)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingRoutine(null)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                // Routine Display
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(routine._id)}
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Routine ID: {routine._id}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        <strong>Loại da:</strong> {routine.skinType}
                      </p>
                    </div>
                    <span className="text-sm text-indigo-600 font-medium">
                      {expandedRoutine === routine._id
                        ? "Ẩn chi tiết"
                        : "Xem chi tiết"}
                    </span>
                  </div>

                  {expandedRoutine === routine._id && (
                    <div className="mt-6 animate-fade-in">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Các bước
                      </h3>
                      <div className="space-y-5">
                        {routine.steps.map((step) => (
                          <div
                            key={step._id}
                            className="p-5 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <h4 className="text-md font-semibold text-gray-800">
                              Bước {step.stepNumber}: {step.title}
                            </h4>
                            <p className="text-gray-600 mt-2">
                              {step.description}
                            </p>
                            <h5 className="text-sm font-medium text-gray-500 mt-4">
                              Sản phẩm đề xuất:
                            </h5>
                            <ul className="mt-3 space-y-4">
                              {step.recommendProducts.map((product) => (
                                <li
                                  key={product._id}
                                  className="flex items-start gap-4 border-t pt-4"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {product.name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Giá: {product.price.toLocaleString()} VND
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Giảm giá: {product.discountPercentage}%
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Mô tả: {product.description}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Thành phần: {product.ingredient}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end gap-4">
                    {/* <button
                      onClick={() => handleEdit(routine)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(routine._id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md"
                    >
                      Xóa
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutineManager;
