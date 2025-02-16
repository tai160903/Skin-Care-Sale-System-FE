import ListProduct from "../Customer/ListtProduct";
import FilterProduct from "../Customer/FilterProduct";
function Home() {
  return (
    <>
      <div className="flex">
      {/* Sidebar bên trái */}
      <FilterProduct />

      {/* Danh sách sản phẩm */}
      <div className="flex-1 p-6">
        <ListProduct />
      </div>
    </div>
    </>
  );
}

export default Home;
