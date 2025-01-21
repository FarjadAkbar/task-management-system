import "@/app/globals.css";

export async function generateMetadata() {
  return {
    title: "Team-DolceFrutti",
    description: "dolicefrutti team user dashboard",
  };
}

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  //Get github stars from github api
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex items-center grow h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
