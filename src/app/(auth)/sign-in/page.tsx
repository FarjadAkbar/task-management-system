import Image from "next/image";
import { LoginComponent } from "./components/LoginComponent";

const SignInPage = async () => {
  return (
    <div className="h-full">
      <div className="py-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </h1>
      </div>
      <div>
        <LoginComponent />
      </div>
    </div>
  );
};

export default SignInPage;
