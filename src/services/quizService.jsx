import axiosClient from "./api.config";

const quizService = {
  getQuiz: () => axiosClient.get("/api/questions"),
  getAnswer: (questionId) =>
    axiosClient.get(`/api/questions/answers/${questionId}`),

  submit: (data) => axiosClient.post("/api/questions/submit", data),

  getRoutine: (id) => axiosClient.get(`/api/routines/skintype/${id}`),

  getSkinTypes: () => axiosClient.get("/api/skintypes"),

  createQuiz: (data) => axiosClient.post("/api/questions/create", data),

  deleteQuiz: (id) => axiosClient.delete(`/api/questions/delete/${id}`),

  updateQuiz: (id, data) =>
    axiosClient.put(`/api/questions/update/${id}`, data),
};

export default quizService;
