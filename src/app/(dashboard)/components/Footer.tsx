import Link from "next/link";
import React from "react";

const Footer = async () => {
  return (
    <footer className="flex flex-row h-8 justify-end items-center w-full text-xs bg-black text-white p-5">
      <div className="hidden md:flex pr-5">
        <Link href="https://www.dolcefrutti.com/">
          <h1 className="text-gray-600">
            {" "}
            {process.env.NEXT_PUBLIC_APP_NAME} - {process.env.NEXT_PUBLIC_APP_V}
          </h1>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
