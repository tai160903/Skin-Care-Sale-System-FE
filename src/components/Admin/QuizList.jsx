import { useEffect, useState } from "react";
import quizService from "../../services/quizService";
import {
  ChevronDown,
  ChevronUp,
  PlusCircle,
  X,
  Edit2,
  Trash2,
} from "react-feather";
import { Pagination } from "@mui/material";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

const QuizManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [skinTypes, setSkinTypes] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState(
    Array(5).fill({ text: "", skinType: "" }),
  );
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ question: "", answers: [] });

  useEffect(() => {
    fetchQuestions();
    fetchSkinTypes();
  }, []);

  const fetchSkinTypes = async () => {
    try {
      const response = await quizService.getSkinTypes();
      setSkinTypes(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching skin types:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await quizService.getQuiz();
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      setExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
      return;
    }
    try {
      const response = await quizService.getAnswer(questionId);
      setAnswers((prev) => ({ ...prev, [questionId]: response.data }));
      setExpanded((prev) => ({ ...prev, [questionId]: true }));
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const validateForm = () => {
    const trimmedQuestion = newQuestion.trim();
    let newErrors = { question: "", answers: Array(5).fill("") };
    let isValid = true;

    // Validation cho câu hỏi
    if (!trimmedQuestion) {
      newErrors.question = "Vui lòng nhập câu hỏi hợp lệ.";
      toast.warn(newErrors.question);
      isValid = false;
    } else {
      const spamPattern = /^(.)\1*$|^[^a-zA-Z0-9À-ỹ\s]+$/;
      if (spamPattern.test(trimmedQuestion)) {
        newErrors.question =
          "Câu hỏi không được chứa ký tự spam hoặc lặp lại vô nghĩa.";
        toast.warn(newErrors.question);
        isValid = false;
      } else if (
        !isEditMode &&
        questions.some(
          (q) => q.question.toLowerCase() === trimmedQuestion.toLowerCase(),
        )
      ) {
        newErrors.question =
          "Câu hỏi này đã tồn tại. Vui lòng nhập câu hỏi khác.";
        toast.warn(newErrors.question);
        isValid = false;
      }
    }

    // Validation cho đáp án
    newAnswers.forEach((answer, index) => {
      const trimmedText = answer.text.trim();
      if (!trimmedText) {
        newErrors.answers[index] = "Vui lòng nhập nội dung đáp án.";
        isValid = false;
      } else {
        const spamPattern = /^(.)\1*$|^[^a-zA-Z0-9À-ỹ\s]+$/;
        if (spamPattern.test(trimmedText)) {
          newErrors.answers[index] =
            "Đáp án không được chứa ký tự spam hoặc lặp lại vô nghĩa.";
          isValid = false;
        }
      }

      if (!answer.skinType) {
        newErrors.answers[index] = "Vui lòng chọn loại da.";
        isValid = false;
      }
    });

    const skinTypeSet = new Set(newAnswers.map(({ skinType }) => skinType));
    if (skinTypeSet.size !== newAnswers.length) {
      toast.warn("Không được chọn trùng loại da cho các đáp án.");
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      newErrors.answers.forEach((error, index) => {
        if (error) toast.warn(`Đáp án ${index + 1}: ${error}`);
      });
    }
    return isValid;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const trimmedQuestion = newQuestion.trim();
      if (isEditMode) {
        const response = await quizService.updateQuiz(editQuestionId, {
          question: trimmedQuestion,
          answers: newAnswers,
        });
        setQuestions(
          questions.map((q) => (q._id === editQuestionId ? response.data : q)),
        );
        toast.success("Cập nhật câu hỏi thành công!");
      } else {
        const response = await quizService.createQuiz({
          question: trimmedQuestion,
          answers: newAnswers,
        });
        setQuestions([...questions, response.data]);
        toast.success("Tạo câu hỏi thành công!");
      }

      setNewQuestion("");
      setNewAnswers(Array(5).fill({ text: "", skinType: "" }));
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditQuestionId(null);
      setErrors({ question: "", answers: [] });
      fetchQuestions();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Đã xảy ra lỗi khi ${isEditMode ? "cập nhật" : "tạo"} câu hỏi.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (question) => {
    setIsEditMode(true);
    setEditQuestionId(question._id);
    setNewQuestion(question.question);
    const fetchedAnswers = await quizService.getAnswer(question._id);
    setNewAnswers(
      fetchedAnswers.data.map((ans) => ({
        text: ans.text,
        skinType: ans.skinType._id,
      })),
    );
    setErrors({ question: "", answers: Array(5).fill("") });
    setIsModalOpen(true);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này không?")) return;
    if (
      !window.confirm("Hành động này không thể hoàn tác. Xác nhận xóa lần nữa?")
    )
      return;

    setLoading(true);
    try {
      await quizService.deleteQuiz(questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      setExpanded((prev) => {
        const newExpanded = { ...prev };
        delete newExpanded[questionId];
        return newExpanded;
      });
      toast.success("Xóa câu hỏi thành công!");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Đã xảy ra lỗi khi xóa câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (index, field, value) => {
    setNewAnswers((prev) =>
      prev.map((ans, i) => (i === index ? { ...ans, [field]: value } : ans)),
    );
  };

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
        Quản Lý Câu Hỏi Quiz
      </h2>
      {/* <button
        onClick={() => {
          setIsEditMode(false);
          setNewQuestion("");
          setNewAnswers(Array(5).fill({ text: "", skinType: "" }));
          setErrors({ question: "", answers: Array(5).fill("") });
          setIsModalOpen(true);
        }}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <PlusCircle size={18} className="mr-2" /> Thêm Câu Hỏi
      </button> */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {isEditMode ? "Chỉnh Sửa Câu Hỏi" : "Tạo Câu Hỏi Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className="w-full p-3 border rounded-md"
                />
                {errors.question && (
                  <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                )}
              </div>
              {newAnswers.map((answer, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) =>
                        updateAnswer(index, "text", e.target.value)
                      }
                      placeholder={`Nhập đáp án ${index + 1}...`}
                      className="flex-grow p-3 border rounded-md"
                    />
                    <select
                      value={answer.skinType}
                      onChange={(e) =>
                        updateAnswer(index, "skinType", e.target.value)
                      }
                      className="p-3 border rounded-md"
                    >
                      <option value="">Chọn loại da</option>
                      {skinTypes.map(({ _id, VNname }) => (
                        <option key={_id} value={_id}>
                          {VNname}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.answers[index] && (
                    <p className="text-red-500 text-sm">
                      {errors.answers[index]}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : isEditMode
                    ? "Cập Nhật"
                    : "Thêm Câu Hỏi"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {paginatedQuestions.map((q) => (
          <div key={q._id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{q.question}</h3>
              <div className="flex space-x-2">
                {/* <button
                  onClick={() => handleEdit(q)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button> */}
                <button
                  onClick={() => fetchAnswers(q._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expanded[q._id] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
            </div>
            {expanded[q._id] && (
              <div className="mt-2 text-gray-700">
                {answers[q._id]?.map((ans) => (
                  <p key={ans._id}>
                    {ans.text} ({ans.skinType.VNname})
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      </div>
    </Paper>
  );
};

export default QuizManagement;
