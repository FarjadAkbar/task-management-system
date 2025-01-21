import axiosInstance from "@/utils/axiosInstance";

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosInstance.post('/auth/signIn', data);
    if (res.status === 200) {
      const { email, id } = res.data; 
      return { id, email };
    }
  throw new Error("Invalid credentials");
} catch (error) {
  console.error("Login error:", error);
  throw new Error("Login failed, please try again.");
}
}
    // try {
    //   const res = await axiosInstance.post('/auth/signIn', data);
    //   const dummyUser = {
    //     name: "John Doe",
    //     email: data.email,
    //   };
    //   const dummyToken = "dummyToken1234567890";
    //   localStorage.setItem("token", dummyToken);
    //   localStorage.setItem("user", JSON.stringify(dummyUser));
    //   return { token: dummyToken, user: dummyUser };
    // } catch (error) {
    //   console.error("Login error:", error);
    //   throw new Error("Login failed, please try again.");
    // }



export const logoutUser = async () => {
    try {
      const res = await axiosInstance.post('/auth/signOut'); 
      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("User logged out successfully.");
      } else {
        throw new Error("Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed, please try again.");
    }
  };
