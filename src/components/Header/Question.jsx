import { Link } from "react-router-dom";
import { HelpOutlineRounded as HelpIcon } from "@mui/icons-material";

const Question = () => {
  return (
    <Link
      to="/question"
      className="flex items-center text-gray-700 hover:text-green-700 space-x-2"
    >
      <HelpIcon className="text-[#326f51] text-xl" />
      <span>Chẩn đoán da</span>
    </Link>
  );
};

export default Question;
