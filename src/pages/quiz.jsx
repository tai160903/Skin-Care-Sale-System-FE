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

const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch questions
        const questionResponse = await quizService.getQuiz();
        const questions = questionResponse.data; // Assuming it's an array

        console.log("Questions:", questions);

        // Fetch answers for each question
        const questionWithAnswers = await Promise.all(
          questions.map(async (q) => {
            const answerResponse = await quizService.getAnswer(q._id);
            const answers = answerResponse.data; // Assuming it's an array of answers

            console.log(`Answers for question ${q._id}:`, answers);

            return {
              id: q._id, // Use `_id` as the question ID
              text: q.question, // Question text
              options: answers.map((a) => ({
                value: a._id, // Answer ID
                label: a.answerText, // Answer text
              })),
            };
          }),
        );

        setQuestions(questionWithAnswers);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
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

  //   const handleSubmit = async (event) => {
  //     event.preventDefault();

  //     // Format answers as an array of objects
  //     const answersArray = Object.entries(selectedAnswers).map(
  //       ([questionId, answer]) => ({
  //         questionId,
  //         answer,
  //       }),
  //     );

  //     try {
  //       // Submit answers to the API as an array
  //       const response = await axios.post(
  //         "https://your-api-endpoint.com/api/submit-answers",
  //         {
  //           answers: answersArray,
  //         },
  //       );

  //       console.log("Quiz submitted successfully:", response.data);
  //       alert("Your answers have been submitted!");
  //     } catch (error) {
  //       console.error("Error submitting answers:", error);
  //       alert("Failed to submit answers!");
  //     }
  //   };

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper className="p-8 rounded-lg shadow-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Choose Your Skin Type
        </h1>

        <form>
          {questions.map((question) => (
            <div key={question.id} className="mb-6">
              <FormControl component="fieldset" className="w-full">
                <FormLabel component="legend">{question.text}</FormLabel>
                <RadioGroup
                  value={selectedAnswers[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  row
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

        {Object.keys(selectedAnswers).length > 0 && (
          <div className="text-center mt-4 text-xl font-semibold">
            You selected:
            {Object.entries(selectedAnswers).map(([questionId, answer]) => (
              <div key={questionId}>
                Question ID: {questionId}, Answer: {answer}
              </div>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
};

export default SkinTypeQuiz;
