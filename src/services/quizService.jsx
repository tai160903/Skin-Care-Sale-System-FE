import axiosClient from "./api.config";

const quizService = {
  getQuiz: () => axiosClient.get("/api/questions"),
  getAnswer: (questionId) =>
    axiosClient.get(`/api/questions/answers/${questionId}`),

  submit: (data) => axiosClient.post("/api/questions/submit", data),

  getRoutine: (id) => axiosClient.get(`/api/routines/skintype/${id}`),
};

export default quizService;
