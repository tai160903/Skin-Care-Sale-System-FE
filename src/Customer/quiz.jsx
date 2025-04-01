import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  LinearProgress,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import quizService from "../services/quizService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";
import { Link, useNavigate } from "react-router-dom";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f7faf5, #ecfdf5)", // Gradient xanh lá nhạt
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: "#fff",
  border: "1px solid #d9f99d", // Viền xanh lá nhạt
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 14px 28px rgba(0, 0, 0, 0.08)",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: theme.spacing(1.5, 5),
  fontSize: "1.1rem",
  fontWeight: 600,
  background: "linear-gradient(45deg, #16a34a, #4ade80)", // Gradient từ green-700 đến green-400
  "&:hover": {
    background: "linear-gradient(45deg, #15803d, #22c55e)",
  },
}));

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
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Cuộn mượt mà
      });

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
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Vui lòng đăng nhập để làm bài kiểm tra
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: "20px",
            px: 4,
            backgroundColor: "#16a34a",
            "&:hover": { backgroundColor: "#15803d" },
          }}
          onClick={() => navigate("/signin")}
        >
          Đăng nhập ngay
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
      <button
        onClick={() => navigate("/")}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out mb-6"
      >
        Quay về Trang Chủ
      </button>
      <StyledPaper>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 5, fontWeight: 700, color: "#15803d" }} // Green-700
        >
          Tìm hiểu loại da của bạn
        </Typography>

        {result ? (
          <Box textAlign="center">
            <Typography variant="h5" color="text.secondary">
              Kết quả của bạn
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: "#15803d" }}>
              {result.VNname}
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ mb: 5 }}
              >
                <QuestionCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#166534",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <span
                        style={{
                          background: "#d9f99d",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          color: "#15803d",
                        }}
                      >
                        {index + 1}
                      </span>
                      {q.text}
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={selectedAnswers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      >
                        {q.options.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={
                              <Radio
                                sx={{
                                  color: "#86efac",
                                  "&.Mui-checked": { color: "#15803d" },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  color: "#000000",
                                  "&:hover": { color: "#15803d" },
                                }}
                              >
                                {option.label}
                              </Typography>
                            }
                            sx={{
                              backgroundColor:
                                selectedAnswers[q.id] === option.value
                                  ? "#f0fdf4"
                                  : "transparent",
                              borderRadius: "10px",
                              p: 1,
                              mb: 0.5,
                              transition: "background-color 0.3s",
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </QuestionCard>
              </motion.div>
            ))}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <SubmitButton type="submit" variant="contained">
                Xem kết quả
              </SubmitButton>
            </Box>
          </form>
        )}
      </StyledPaper>

      {routine && (
        <motion.div
          sx={{ mt: 6 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                align="center"
                sx={{ mb: 6, fontWeight: 700, color: "#4b5563" }}
              >
                Lộ trình chăm sóc da đề xuất
              </Typography>
              <Grid container spacing={4}>
                {routine.steps.map((step, index) => (
                  <Grid item xs={12} key={step.stepNumber}>
                    <motion.div
                      sx={{
                        p: 3,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(to right, #f7faf5, #ffffff)",
                        borderLeft: "6px solid #16a34a", // Green-600
                      }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography variant="h6" sx={{ color: "#15803d" }}>
                        Bước {step.stepNumber}: {step.title}
                      </Typography>
                      <Typography sx={{ mt: 1, color: "#64748b" }}>
                        {step.description}
                      </Typography>

                      {step.recommendProducts?.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: "#4b5563" }}
                          >
                            🛍 Sản phẩm đề xuất:
                          </Typography>
                          <Grid container spacing={2}>
                            {step.recommendProducts.map((product) => (
                              <Grid item xs={12} sm={6} key={product._id}>
                                <Link
                                  to={`/product/detail/${product._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Card
                                    sx={{
                                      p: 2,
                                      borderRadius: "12px",
                                      minHeight: "100%",
                                      transition: "transform 0.2s",
                                      "&:hover": { transform: "scale(1.03)" },
                                      border: "1px solid #d9f99d",
                                    }}
                                  >
                                    <CardContent sx={{ textAlign: "center" }}>
                                      <Avatar
                                        src={product.image}
                                        sx={{
                                          width: 100,
                                          height: 100,
                                          mx: "auto",
                                          mb: 2,
                                        }}
                                      />
                                      <Typography
                                        variant="h6"
                                        sx={{ color: "#4b5563" }}
                                      >
                                        {product.name}
                                      </Typography>
                                      <Typography
                                        variant="h5"
                                        sx={{ color: "#15803d", mt: 1 }}
                                      >
                                        {formatCurrency(product.price)}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
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
