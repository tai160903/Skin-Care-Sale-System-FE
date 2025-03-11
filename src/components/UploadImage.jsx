import { useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Vui lòng chọn một ảnh!");

    setLoading(true);
    const fileName = `${Date.now()}_${image.name}`;

    const { data, error } = await supabase.storage
      .from("skincare")
      .upload(fileName, image);

    if (error) {
      console.error("Lỗi khi upload:", error);
    } else {
      const { data: publicUrl } = supabase.storage
        .from("skincare")
        .getPublicUrl(fileName);
      setImageUrl(publicUrl.publicUrl);
      console.log("File đã được upload thành công:", data);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <button
        onClick={handleChooseFile}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Chọn ảnh
      </button>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ width: "150px", marginTop: "10px", borderRadius: "10px" }}
        />
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#6c757d" : "#28a745",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "Đang tải..." : "Upload"}
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{ width: "200px", marginTop: "10px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
};

export default UploadImage;
