import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import addressService from "../services/addressServide";
import { toast } from "react-toastify";

const AddressForm = ({ onAddressChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await addressService.getProvince();

        setProvinces(res?.data?.data || []);
      } catch (error) {
        toast.error("Lỗi lấy danh sách tỉnh/thành:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (province) => {
    setProvince(province);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);

    try {
      const res = await addressService.getDistrict(province);
      setDistricts(res?.data?.data || []);
    } catch (error) {
      toast.error(error.response.data.message);
    }

    updateAddress("province", province);
  };

  const handleDistrictChange = async (district) => {
    setDistrict(district);
    setWard("");
    setWards([]);

    try {
      const res = await addressService.getWard(district);
      setWards(res?.data?.data || []);
    } catch (error) {
      toast.error("Lỗi lấy danh sách phường/xã:", error);
    }

    updateAddress("district", district);
  };

  const handleWardChange = (ward) => {
    setWard(ward);
    updateAddress("ward", ward);
  };

  const handleStreetChange = (street) => {
    setStreet(street);
    updateAddress("street", street);
  };

  const updateAddress = (field, value) => {
    onAddressChange({
      province: field === "province" ? value : province,
      district: field === "district" ? value : district,
      ward: field === "ward" ? value : ward,
      street: field === "street" ? value : street,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <FormControl fullWidth className="mt-4">
        <InputLabel>Tỉnh/Thành phố</InputLabel>
        <Select
          value={province}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          {provinces.map((province, index) => (
            <MenuItem key={index} value={province}>
              {province}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="mt-4" disabled={!province}>
        <InputLabel>Quận/Huyện</InputLabel>
        <Select
          value={district}
          onChange={(e) => handleDistrictChange(e.target.value)}
        >
          {districts.map((district, index) => (
            <MenuItem key={index} value={district}>
              {district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="mt-4" disabled={!district}>
        <InputLabel>Phường/Xã</InputLabel>
        <Select value={ward} onChange={(e) => handleWardChange(e.target.value)}>
          {wards.map((ward, index) => (
            <MenuItem key={index} value={ward}>
              {ward}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        className="mt-4"
        label="Số nhà, đường"
        variant="outlined"
        value={street}
        onChange={(e) => handleStreetChange(e.target.value)}
      />
    </div>
  );
};

export default AddressForm;
