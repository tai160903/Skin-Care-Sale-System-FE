import axiosClient from "./api.config";

const quizService = {
  getQuiz: () => axiosClient.get("/api/questions"),
  getAnswer: (questionId) =>
    axiosClient.get(`/api/questions/answers/${questionId}`),

  submit: (data) => {
    console.log("data", data);
    return axiosClient.post("/api/questions/submit", data);
  },
};

export default quizService;
