import { useEffect, useState } from "react";
import routineService from "../../services/adminService/routineService";
import {
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { toast } from "react-toastify";
import skintypeService from "../../services/adminService/skinTypeService";

const RoutineManagement = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [skinTypes, setSkinTypes] = useState([]);
  const [expandedRoutine, setExpandedRoutine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    skinType: "",
    steps: [
      { stepNumber: 1, title: "", description: "", recommendProducts: [] },
    ],
  });
  const [errors, setErrors] = useState({ skinType: "", steps: [] });

  useEffect(() => {
    fetchRoutines();
    fetchSkinTypes();
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

  const fetchSkinTypes = async () => {
    try {
      const response = await skintypeService.getSkinTypes();
      setSkinTypes(response.data);
    } catch (error) {
      toast.error("Failed to fetch skin types", error);
    }
  };

  const handleDelete = async (routineId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa routine này?")) {
      try {
        await routineService.deleteRoutine(routineId);
        setRoutines(routines.filter((routine) => routine._id !== routineId));
        toast.success("Xóa routine thành công!");
      } catch (err) {
        setError("Không thể xóa routine.", err);
        toast.error("Không thể xóa routine!");
      }
    }
  };

  const handleEdit = (routine) => {
    setEditingRoutine(routine._id);
    setExpandedRoutine(null);
    setFormData({
      skinType: routine.skinType,
      steps: routine.steps.map((step) => ({
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
        recommendProducts: step.recommendProducts.map((prod) => prod._id),
      })),
    });
    setErrors({
      skinType: "",
      steps: routine.steps.map(() => ({ title: "", description: "" })),
    });
  };

  const handleChange = (e, stepIndex = null, field = null) => {
    if (stepIndex === null) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setErrors({ ...errors, [e.target.name]: "" });
    } else {
      const updatedSteps = [...formData.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        [field]: e.target.value,
      };
      setFormData({ ...formData, steps: updatedSteps });
      setErrors({
        ...errors,
        steps: errors.steps.map((step, i) =>
          i === stepIndex ? { ...step, [field]: "" } : step,
        ),
      });
    }
  };

  const handleUpdate = async (routineId) => {
    if (!validateForm()) return;
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
      toast.success("Cập nhật routine thành công!");
    } catch (error) {
      setError("Không thể cập nhật routine.", error);
      toast.error("Không thể cập nhật routine!");
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      const newRoutine = await routineService.createRoutine(formData);
      setRoutines([...routines, newRoutine]);
      setIsModalOpen(false);
      setFormData({
        skinType: "",
        steps: [
          { stepNumber: 1, title: "", description: "", recommendProducts: [] },
        ],
      });
      setErrors({ skinType: "", steps: [{ title: "", description: "" }] });
      toast.success("Tạo routine thành công!");
    } catch (error) {
      setError("Không thể tạo routine.", error);
      toast.error("Không thể tạo routine!");
    }
  };

  const toggleExpand = (routineId) => {
    setExpandedRoutine(expandedRoutine === routineId ? null : routineId);
  };

  const addStep = () => {
    const newStepNumber = formData.steps.length + 1;
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          stepNumber: newStepNumber,
          title: "",
          description: "",
          recommendProducts: [],
        },
      ],
    });
    setErrors({
      ...errors,
      steps: [...errors.steps, { title: "", description: "" }],
    });
  };

  const validateForm = () => {
    let newErrors = {
      skinType: "",
      steps: formData.steps.map(() => ({ title: "", description: "" })),
    };
    let isValid = true;

    if (!formData.skinType.trim()) {
      newErrors.skinType = "Vui lòng chọn loại da.";
      toast.warn(newErrors.skinType);
      isValid = false;
    }

    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors.steps[index].title = "Tiêu đề không được để trống.";
        toast.warn(`Bước ${step.stepNumber}: ${newErrors.steps[index].title}`);
        isValid = false;
      }
      if (!step.description.trim()) {
        newErrors.steps[index].description = "Mô tả không được để trống.";
        toast.warn(
          `Bước ${step.stepNumber}: ${newErrors.steps[index].description}`,
        );
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
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
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
          Quản Lý Routine
        </h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({
              skinType: "",
              steps: [
                {
                  stepNumber: 1,
                  title: "",
                  description: "",
                  recommendProducts: [],
                },
              ],
            });
            setErrors({
              skinType: "",
              steps: [{ title: "", description: "" }],
            });
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Thêm Routine
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tạo Routine Mới</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <FormControl fullWidth>
                <InputLabel id="skin-type-label">Loại da</InputLabel>
                <Select
                  labelId="skin-type-label"
                  id="skinType"
                  name="skinType"
                  value={formData.skinType}
                  onChange={(e) => handleChange(e)}
                  label="Loại da"
                >
                  {skinTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.VNname}
                    </MenuItem>
                  ))}
                </Select>
                {errors.skinType && (
                  <p className="text-red-500 text-sm mt-1">{errors.skinType}</p>
                )}
              </FormControl>

              {formData.steps.map((step, index) => (
                <div
                  key={step.stepNumber}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Bước {step.stepNumber}
                  </h4>
                  <div className="space-y-2">
                    <TextField
                      label="Tiêu đề"
                      variant="outlined"
                      fullWidth
                      value={step.title}
                      onChange={(e) => handleChange(e, index, "title")}
                      error={!!errors.steps[index]?.title}
                      helperText={errors.steps[index]?.title}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <InputLabel>Mô tả</InputLabel>
                    <TextareaAutosize
                      minRows={4}
                      value={step.description}
                      onChange={(e) => handleChange(e, index, "description")}
                      className={`w-full p-3 border rounded-lg ${
                        errors.steps[index]?.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập mô tả..."
                    />
                    {errors.steps[index]?.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.steps[index].description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addStep}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              >
                Thêm Bước
              </button>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
                >
                  Tạo
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Chỉnh sửa Routine ID: {routine._id}
                  </h2>
                  <FormControl fullWidth>
                    <InputLabel id="edit-skin-type-label">Loại da</InputLabel>
                    <Select
                      labelId="edit-skin-type-label"
                      id="skinType"
                      name="skinType"
                      value={formData.skinType}
                      onChange={(e) => handleChange(e)}
                      label="Loại da"
                    >
                      {skinTypes.map((type) => (
                        <MenuItem key={type._id} value={type.name}>
                          {type.VNname}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.skinType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.skinType}
                      </p>
                    )}
                  </FormControl>
                  {formData.steps.map((step, index) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">
                        Bước {step.stepNumber}
                      </h4>
                      <div className="space-y-2">
                        <TextField
                          label="Tiêu đề"
                          variant="outlined"
                          fullWidth
                          value={step.title}
                          onChange={(e) => handleChange(e, index, "title")}
                          error={!!errors.steps[index]?.title}
                          helperText={errors.steps[index]?.title}
                        />
                      </div>
                      <div className="space-y-2 mt-4">
                        <InputLabel>Mô tả</InputLabel>
                        <TextareaAutosize
                          minRows={4}
                          value={step.description}
                          onChange={(e) =>
                            handleChange(e, index, "description")
                          }
                          className={`w-full p-3 border rounded-lg ${
                            errors.steps[index]?.description
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Nhập mô tả..."
                        />
                        {errors.steps[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.steps[index].description}
                          </p>
                        )}
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
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(routine._id)}
                  >
                    <div>
                      <h2 className="text-gray-600 mt-1">
                        <strong>Loại da:</strong> {routine.skinType.VNname}
                      </h2>
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
                    <button
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
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
};

export default RoutineManagement;
