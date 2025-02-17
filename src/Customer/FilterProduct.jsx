import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilters } from "../redux/slices/filterSlice";
import {
  Slider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FilterProduct = () => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState([29000, 149000]);
  const [minPrice, setMinPrice] = useState(29000);
  const [maxPrice, setMaxPrice] = useState(149000);

  // Handle price change
  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  // Handle manual price input
  const applyPriceFilter = () => {
    setPrice([minPrice, maxPrice]);
    dispatch(updateFilters({ price: [minPrice, maxPrice] }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (category, value) => {
    dispatch(updateFilters({ [category]: value }));
  };

  return (
    <div className="w-72 p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <Typography variant="h6" className="font-bold text-black mb-4">
        BỘ LỌC SẢN PHẨM
      </Typography>

      {/* Lọc theo khoảng giá */}
      <Accordion className="border-none">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-bold">
            KHOẢNG GIÁ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={price}
            onChange={handlePriceChange}
            min={29000}
            max={149000}
            valueLabelDisplay="auto"
            sx={{ color: "#F28C28" }} // Màu cam
          />
          <Box className="flex items-center justify-between my-2">
            <TextField
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              size="small"
              className="w-24"
            />
            <Typography className="mx-2">—</Typography>
            <TextField
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              size="small"
              className="w-24"
            />
          </Box>
          <Button
            onClick={applyPriceFilter}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "50px",
            }}
          >
            ÁP DỤNG
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Lọc theo khuyến mãi */}
      <Accordion className="border-none">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-bold">
            KHUYẾN MÃI
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel control={<Checkbox />} label="0 - 10%" />
          <FormControlLabel control={<Checkbox />} label="40% - 50%" />
        </AccordionDetails>
      </Accordion>

      {/* Lọc theo giới tính */}
      <Accordion className="border-none">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-bold">
            GIỚI TÍNH
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox onChange={() => handleCheckboxChange("gender", "Nữ")} />
            }
            label="Nữ"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => handleCheckboxChange("gender", "Nam/nữ")}
              />
            }
            label="Nam/nữ"
          />
        </AccordionDetails>
      </Accordion>

      {/* Lọc theo thương hiệu */}
      <Accordion className="border-none">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-bold">
            THƯƠNG HIỆU
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => handleCheckboxChange("brand", "Guardian")}
              />
            }
            label="GUARDIAN"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => handleCheckboxChange("brand", "Eco Garden")}
              />
            }
            label="ECO GARDEN"
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default FilterProduct;
