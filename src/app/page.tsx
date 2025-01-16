import EditProfileForm from '@/components/EditProfileForm'
import Navbar from '@/components/Navbar'
import SideBar from '@/components/SideBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-8 px-6">
        <div className="flex gap-6">
          <div className="hidden md:flex w-1/4 bg-white shadow-lg rounded-lg">
            <SideBar />
          </div>
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
            <EditProfileForm />
          </div>
        </div>
      </main>
    </div>
  );
}
