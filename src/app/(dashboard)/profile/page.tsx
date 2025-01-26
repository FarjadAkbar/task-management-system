import { getUser } from "@/actions/get-user";
import { ProfileForm } from "./components/ProfileForm";
import { PasswordChangeForm } from "./components/PasswordChangeForm";
import { ProfilePhotoForm } from "./components/ProfilePhotoForm";
import SideBar from './components/Sidebar'

export default async function Profile() {
  const data = await getUser();

  if (!data) {
    return <div>No user data.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8 px-6">
        <div className="flex gap-6">
          <div className="hidden md:flex w-1/4 bg-white shadow-lg rounded-lg">
            <SideBar />
          </div>
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-start">
                <ProfilePhotoForm data={data} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <ProfileForm data={data} />
                {/* <H4Title>Password change</H4Title>
                <PasswordChangeForm userId={data.id} /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}