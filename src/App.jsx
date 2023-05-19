import React from "react";
import Table from "./Components/Table";

const App = () => {
  return (
    <div className="relative flex h-screen flex-col justify-center gap-10 overflow-hidden bg-gray-50 py-6 sm:py-12">
      <img
        src="./assets/beams.jpg"
        alt=""
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        width="1308"
      />
      <div className="absolute inset-0 bg-[url(./assets/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="text-center text-7xl text-orange-400">Welcome</div>
      <div className="relative overflow-auto bg-white shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-[80vW] sm:rounded-lg">
        {/* allo0000000000000000000000000000000000000000000000000000000000000000000000000 */}
        <Table />
      </div>
    </div>
  );
};

export default App;
