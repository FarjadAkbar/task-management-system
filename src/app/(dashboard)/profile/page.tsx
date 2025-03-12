import { getUser } from "@/lib/get-user";
import { ProfileForm } from "./components/ProfileForm";
import { PasswordChangeForm } from "./components/PasswordChangeForm";
import { ProfilePhotoForm } from "./components/ProfilePhotoForm";
import Container from "../components/ui/Container";
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
      <ProfilePhotoForm data={data} />

      <H4Title>Profile</H4Title>
      <ProfileForm data={data} />

      <H4Title>Password change</H4Title>
      <PasswordChangeForm userId={data.id} />
    </>
  );
}