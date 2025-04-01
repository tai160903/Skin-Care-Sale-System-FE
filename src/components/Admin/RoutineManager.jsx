// src/components/RoutineManager.js
import { useEffect, useState } from "react";
import routineService from "../../services/adminService/routineService";

const RoutineManager = () => {
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await routineService.getAllRoutines();
        setRoutines(response.data); // Lấy mảng routines từ response.data
      } catch (error) {
        setError("Failed to fetch routines: " + error.message);
      }
    };

    fetchRoutines();
  }, []);

  return (
    <div>
      <h2>Routine List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {routines.length === 0 && !error ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {routines.map((routine) => (
            <li key={routine._id}>
              {/* Hiển thị thông tin routine, ví dụ: skinType và các bước */}
              <strong>Routine ID: {routine._id}</strong>
              <p>Skin Type ID: {routine.skinType}</p>
              <ul>
                {routine.steps.map((step) => (
                  <li key={step._id}>
                    Step {step.stepNumber}: {step.title} - {step.description}
                    <ul>
                      {step.recommendProducts.map((product) => (
                        <li key={product._id}>
                          {product.name} - {product.price} VND
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoutineManager;
