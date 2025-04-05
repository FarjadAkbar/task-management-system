import { getUser } from "@/lib/get-user";
import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/dashboard/profile/PasswordChangeForm";
import { ProfilePhotoForm } from "@/components/dashboard/profile/ProfilePhotoForm";
import Container from "../../../components/ui/container";
import H4Title from "@/components/typography/h4";
import Link from "next/link";


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

      {/* <H4Title>Webmail</H4Title>
      <div>
        <Link href="https://webmail-oxcs.networksolutionsemail.com/appsuite/?user_domain=mail.dolcefrutti.com">
          https://webmail-oxcs.networksolutionsemail.com/appsuite/?user_domain=mail.dolcefrutti.com</Link>
      </div> */}




      {/* <H4Title>Password change</H4Title>
      <PasswordChangeForm userId={data.id} /> */}
    </>
  );
}