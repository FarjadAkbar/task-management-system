import { getUser } from "@/lib/get-user";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";
import { PasswordForm } from "@/components/dashboard/profile/password-form";
import { ProfilePic } from "@/components/dashboard/profile/profile-pic";
import { Credentials } from "@/components/dashboard/profile/credentials";
import H4Title from "@/components/typography/h4";


export default async function Profile() {
  const data = await getUser();
  console.log("user data", data.first_name)

  if (!data) {
    return <div>No user data.</div>;
  }
  return (
    <>
      <H4Title>Profile photo</H4Title>
      <ProfilePic data={data} />

      <H4Title>Profile</H4Title>
      <ProfileForm data={data} />
      <Credentials data={data} />

      {/* <H4Title>Password change</H4Title>
      <PasswordForm userId={data.id} /> */}
    </>
  );
}