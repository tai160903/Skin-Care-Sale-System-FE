import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
  LinearProgress,
} from "@mui/material";
import quizService from "../services/quizService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";
const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [routine, setRoutine] = useState(null);
  const customer = useSelector((state) => state?.user?.customer);
  const customerId = customer?._id;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const questionResponse = await quizService.getQuiz();
        const questions = questionResponse.data;

        const questionWithAnswers = await Promise.all(
          questions.map(async (q) => {
            const answerResponse = await quizService.getAnswer(q._id);
            const answers = answerResponse.data;

            return {
              id: q._id,
              text: q.question,
              options: answers.map((a) => ({
                value: a._id,
                label: a.text,
              })),
            };
          }),
        );

        setQuestions(questionWithAnswers);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.keys(selectedAnswers).length !== questions.length) {
      toast.error("Vui lòng trả lời tất cả câu hỏi!");
      return;
    }

    const answersArray = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({ questionId, answerId }),
    );

    try {
      const response = await quizService.submit({
        customerId: customerId,
        answers: answersArray,
      });

      toast.success(response.data.message);
      setResult(response.data.result);

      const routineResponse = await quizService.getRoutine(
        response.data.result._id,
      );
      setRoutine(routineResponse.data.routine);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <Paper className="p-8 rounded-2xl shadow-2xl w-full max-w-lg bg-white transition-all">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Chọn loại da của bạn
        </h1>

        {result ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Kết quả</h2>
            <p className="text-lg text-green-600 font-medium mt-3">
              {result.name}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                className="mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormControl component="fieldset" className="w-full">
                  <FormLabel
                    component="legend"
                    className="text-lg font-medium text-gray-700"
                  >
                    Câu {index + 1}/{questions.length}: {q.text}
                  </FormLabel>
                  <RadioGroup
                    value={selectedAnswers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  >
                    {q.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        className="text-md"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </motion.div>
            ))}

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="rounded-full px-6 w-full"
            >
              Hoàn thành
            </Button>
          </form>
        )}
      </Paper>

      {routine && (
        <motion.div
          className="mt-8 p-6 bg-white rounded-2xl shadow-lg max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            🌿 Routine chăm sóc da đề xuất
          </h2>
          <ul className="space-y-6">
            {routine.steps.map((step, index) => (
              <motion.li
                key={step.stepNumber}
                className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-600"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-blue-800">
                  Bước {step.stepNumber}: {step.title}
                </h3>
                <p className="text-gray-700 mt-1">{step.description}</p>

                {/* Hiển thị sản phẩm đẹp hơn */}
                {step.recommendProducts?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-600 mb-2">
                      🛍 Sản phẩm đề xuất:
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {step.recommendProducts.map((product) => (
                        <a
                          key={product._id}
                          href={`/product/${product._id}`}
                          className="bg-white rounded-lg shadow-lg p-3 transition-transform transform hover:scale-105 border border-gray-200"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <p className="text-gray-800 font-medium mt-2 text-center">
                            {product.name}
                          </p>
                          <p className="text-blue-600 font-semibold text-center">
                            {formatCurrency(product.price)}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default SkinTypeQuiz;
