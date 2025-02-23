import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
} from "@mui/material";
import quizService from "../services/quizService";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
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
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(selectedAnswers).length !== questions.length) {
      toast.error("Vui lòng trả lời tất cả các câu hỏi trước khi nộp!");
      return;
    }
    const answersArray = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      }),
    );

    try {
      const response = await quizService.submit({
        userId: userId,
        answers: answersArray,
      });

      toast.success(response.data.message);
      setResult(response.data.result); // Store the result
    } catch (error) {
      toast.error("Error submitting answers:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper className="p-8 rounded-lg shadow-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Choose Your Skin Type
        </h1>

        {result ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Result</h2>
            <p>{result}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div key={question.id} className="mb-6">
                <FormControl component="fieldset" className="w-full">
                  <FormLabel component="legend">{question.text}</FormLabel>
                  <RadioGroup
                    value={selectedAnswers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            ))}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        )}
      </Paper>
      <ToastContainer />
    </div>
  );
};

export default SkinTypeQuiz;
