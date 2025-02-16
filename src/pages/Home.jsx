import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import productSerivce from "../services/productService";
import { Rating } from "@mui/material";

function Home() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await productSerivce.getAllProduct();
      console.log(response.data);
      setData(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const user = JSON.parse(urlParams.get("user"));

    if (token && user) {
      dispatch(
        login({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
        }),
      );
    }
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [dispatch]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {data.map((item, index) => {
          return (
            <div key={index}>
              <img src={item.image} alt={item.name} />
              <h1>{item.name}</h1>
              <Rating name="read-only" value={5} readOnly />
              <p>{item.description}</p>
              <p>
                {data.price
                  ? parseFloat(data.price.$numberDecimal || data.price)
                  : "$ 100.00"}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;
