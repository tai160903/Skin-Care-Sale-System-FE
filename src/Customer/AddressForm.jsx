import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import addressService from "../services/addressService";
import { toast } from "react-toastify";

const AddressForm = ({ onAddressChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState(false);

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

  const handleProvinceChange = async (provinceId) => {
    const selectedProvince = provinces.find((p) => p.ProvinceID === provinceId);

    setProvince(selectedProvince);
    setDistrict(null);
    setWard(null);
    setDistricts([]);
    setWards([]);

    try {
      const res = await addressService.getDistrict(provinceId);
      setDistricts(res?.data?.data || []);
    } catch (error) {
      toast.error("Lỗi lấy danh sách quận/huyện:", error);
    }

    updateAddress("province", selectedProvince);
  };

  const handleDistrictChange = async (districtId) => {
    const selectedDistrict = districts.find((d) => d.DistrictID === districtId);

    setDistrict(selectedDistrict);
    setWard(null);
    setWards([]);

    try {
      const res = await addressService.getWard(districtId);
      setWards(res?.data?.data || []);
    } catch (error) {
      toast.error("Lỗi lấy danh sách phường/xã:", error);
    }

    updateAddress("district", selectedDistrict);
  };

  const handleWardChange = (wardCode) => {
    const selectedWard = wards.find((w) => w.WardCode === wardCode);

    setWard(selectedWard);
    updateAddress("ward", selectedWard);
  };

  const handleStreetChange = (street) => {
    if (street.trim() === "") {
      setStreetError(true);
    } else {
      setStreetError(false);
    }
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
          value={province ? province.ProvinceID : ""}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          {provinces.map((province, index) => (
            <MenuItem key={index} value={province.ProvinceID}>
              {province.ProvinceName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="mt-4" disabled={!province}>
        <InputLabel>Quận/Huyện</InputLabel>
        <Select
          value={district ? district.DistrictID : ""}
          onChange={(e) => handleDistrictChange(e.target.value)}
        >
          {districts.map((district, index) => (
            <MenuItem key={index} value={district.DistrictID}>
              {district.DistrictName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="mt-4" disabled={!district}>
        <InputLabel>Phường/Xã</InputLabel>
        <Select
          value={ward ? ward.WardCode : ""}
          onChange={(e) => handleWardChange(e.target.value)}
        >
          {wards.map((ward, index) => (
            <MenuItem key={index} value={ward.WardCode}>
              {ward.WardName}
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
        required
        error={streetError}
        helperText={streetError ? "Vui lòng nhập số nhà, đường" : ""}
      />
    </div>
  );
};

export default AddressForm;
