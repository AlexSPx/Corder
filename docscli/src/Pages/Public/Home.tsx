import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <p className="text-9xl font-bold">Corder</p>
      <p className="text-lg">Documents for corder.xyz</p>
      <div className="felx flex-row mt-3">
        <button
          className="w-60 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-10 rounded-lg my-1 justify-center mx-3"
          onClick={() => {
            window.open("http://corder-bg.xyz/register", "_blank");
          }}
        >
          Register
        </button>

        <button
          className="w-60 border hover:bg-gray-100 border-indigo-300 py-2 px-10 rounded-lg my-1 justify-center mx-3"
          onClick={() => {
            window.open("http://corder-bg.xyz/login", "_blank");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
