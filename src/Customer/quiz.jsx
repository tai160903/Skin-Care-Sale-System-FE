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
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import quizService from "../services/quizService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";

import { useNavigate } from "react-router-dom";
const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [routine, setRoutine] = useState(null);
  const customer = useSelector((state) => state?.user?.customer);
  const customerId = customer?._id;

  const navigate = useNavigate();
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
      setRoutine(routineResponse.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center mx-auto h-screen w-1/3">
        <Typography variant="h5" className="text-center text-gray-700">
          Vui lòng đăng nhập để làm bài kiểm tra
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/signin")}
          className="w-full mt-4"
        >
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <Container maxWidth="md" className="mt-8">
      <Paper className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
        <Typography
          variant="h4"
          align="center"
          className="mb-6 text-indigo-700"
        >
          Chọn loại da của bạn
        </Typography>

        {result ? (
          <div className="text-center">
            <Typography variant="h5" className="text-gray-700">
              Kết quả
            </Typography>
            <Typography variant="h6" className="text-indigo-600 mt-3">
              {result.name}
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="rounded-xl shadow-sm">
                  <CardContent>
                    <FormControl component="fieldset" className="w-full">
                      <FormLabel
                        component="legend"
                        className="text-lg font-medium text-indigo-700"
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
                            control={<Radio color="primary" />}
                            label={option.label}
                            className="text-md text-gray-600"
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="rounded-full px-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform transform hover:scale-105"
            >
              Hoàn thành
            </Button>
          </form>
        )}
      </Paper>

      {routine && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-3xl shadow-2xl">
            <CardContent>
              <Typography
                variant="h4"
                align="center"
                className="mb-6 text-gray-900"
              >
                🌿 Routine Chăm Sóc Da Đề Xuất
              </Typography>
              <Grid container spacing={4}>
                {routine.steps.map((step, index) => (
                  <Grid item xs={12} key={step.stepNumber}>
                    <motion.div
                      className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-md border-l-8 border-blue-500 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography variant="h6" className="text-blue-900">
                        Bước {step.stepNumber}: {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-700 mt-2"
                      >
                        {step.description}
                      </Typography>

                      {step.recommendProducts?.length > 0 && (
                        <div className="mt-4">
                          <Typography
                            variant="h6"
                            className="text-gray-600 mb-3"
                          >
                            🛍 Sản phẩm đề xuất:
                          </Typography>
                          <Grid container spacing={2}>
                            {step.recommendProducts.map((product) => (
                              <Grid item xs={12} sm={6} key={product._id}>
                                <Card className="rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200">
                                  <CardContent className="flex flex-col items-center">
                                    <Avatar
                                      src={product.image}
                                      alt={product.name}
                                      className="w-28 h-28 object-cover rounded-lg"
                                    />
                                    <Typography
                                      variant="h6"
                                      className="text-gray-800 mt-3 text-center"
                                    >
                                      {product.name}
                                    </Typography>
                                    <Typography
                                      variant="h5"
                                      className="text-blue-600 font-bold text-center mt-1"
                                    >
                                      {formatCurrency(product.price)}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                      )}
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Container>
  );
};

export default SkinTypeQuiz;
