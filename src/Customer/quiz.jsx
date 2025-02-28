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
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const userId = useSelector((state) => state?.user?.user?._id);
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
        toast.error("Error fetching quiz data:", error);
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
        userId: userId,
        answers: answersArray,
      });

      toast.success(response.data.message);
      setResult(response.data.result);
    } catch (error) {
      toast.error("Lỗi khi gửi câu trả lời!", error);
    }
  };

  const handleNext = () => {
    if (!selectedAnswers[questions[currentQuestion].id]) {
      toast.error("Vui lòng chọn một câu trả lời!");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <Paper className="p-8 rounded-2xl shadow-2xl w-full max-w-lg bg-white transition-all">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Chọn loại da của bạn
        </h1>

        {result ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Kết quả</h2>
            <p className="text-lg text-green-600 font-medium mt-3">{result}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <FormControl component="fieldset" className="w-full">
                  <FormLabel
                    component="legend"
                    className="text-lg font-medium text-gray-700"
                  >
                    Câu {currentQuestion + 1}/{questions.length}:{" "}
                    {questions[currentQuestion].text}
                  </FormLabel>
                  <RadioGroup
                    value={selectedAnswers[questions[currentQuestion].id] || ""}
                    onChange={(e) =>
                      handleChange(
                        questions[currentQuestion].id,
                        e.target.value,
                      )
                    }
                  >
                    {questions[currentQuestion].options.map((option) => (
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
              </div>
            </motion.div>

            <div className="flex justify-between mt-6">
              {currentQuestion > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  className="rounded-full px-6"
                  onClick={handlePrevious}
                >
                  Quay lại
                </Button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  className="rounded-full px-6"
                  onClick={handleNext}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className="rounded-full px-6"
                >
                  Hoàn thành
                </Button>
              )}
            </div>
          </form>
        )}
      </Paper>
      <ToastContainer />
    </div>
  );
};

export default SkinTypeQuiz;
