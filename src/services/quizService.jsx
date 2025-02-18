import axiosClient from "./api.config";

const quizService = {
  getQuiz: () => axiosClient.get("/api/questions"),
  getAnswer: (questionId) =>
    axiosClient.get(`/api/questions/answers/${questionId}`),
};

export default quizService;
