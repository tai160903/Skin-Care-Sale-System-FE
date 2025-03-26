import { useEffect, useState } from "react";
import quizService from "../../services/quizService";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "react-feather"; // Thêm icons

const ITEMS_PER_PAGE = 5; // Số câu hỏi mỗi trang

const QuizList = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    quizService
      .getQuiz()
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      setExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
      return;
    }

    try {
      const response = await quizService.getAnswer(questionId);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: response.data,
      }));
      setExpanded((prev) => ({ ...prev, [questionId]: true }));
    } catch (error) {
      console.error(
        `Error fetching answers for question ${questionId}:`,
        error,
      );
    }
  };

  const handleEdit = (questionId) => {
    console.log(`Edit question: ${questionId}`);
    // Logic chỉnh sửa
  };

  const handleDelete = (questionId) => {
    console.log(`Delete question: ${questionId}`);
    // Logic xóa
  };

  // Phân trang
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
        Quản Lý Câu Hỏi Quiz
      </h2>

      {questions.length > 0 ? (
        <div className="space-y-6">
          {/* Bảng */}
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                    Câu Hỏi
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedQuestions.map((question) => (
                  <>
                    <tr
                      key={question._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                        {question._id}
                      </td>
                      <td className="py-4 px-6 text-base text-gray-900 font-medium">
                        {question.question}
                      </td>
                      <td className="py-4 px-6 flex items-center space-x-4">
                        <button
                          onClick={() => fetchAnswers(question._id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          {expanded[question._id] ? (
                            <>
                              <ChevronUp size={18} className="mr-1" />
                              Ẩn
                            </>
                          ) : (
                            <>
                              <ChevronDown size={18} className="mr-1" />
                              Xem
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(question._id)}
                          className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        >
                          <Edit size={16} className="mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(question._id)}
                          className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Xóa
                        </button>
                      </td>
                    </tr>
                    {expanded[question._id] && answers[question._id] && (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 px-6 bg-gray-100 text-gray-700"
                        >
                          <div>
                            <strong className="text-gray-800">
                              Câu trả lời:
                            </strong>
                            {Array.isArray(answers[question._id]) ? (
                              <ul className="list-disc pl-6 mt-2 space-y-1">
                                {answers[question._id].map((answer, index) => (
                                  <li key={index}>
                                    {answer.text}{" "}
                                    {answer.skinType && (
                                      <span className="text-gray-600">
                                        ({answer.skinType})
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2">
                                {answers[question._id].text}{" "}
                                {answers[question._id].skinType && (
                                  <span className="text-gray-600">
                                    ({answers[question._id].skinType})
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 italic p-6 bg-white rounded-lg shadow-md">
          Không tìm thấy câu hỏi nào.
        </div>
      )}
    </div>
  );
};

export default QuizList;
