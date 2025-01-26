"use client";

import Image from "next/image";
import { Users } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";
import useAvatarStore from "@/store/useAvatarStore";
import axios from "axios";

interface ProfileFormProps {
  data: Users;
}

export function ProfilePhotoForm({ data }: ProfileFormProps) {
  const [avatar, setAvatar] = useState(data.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const setAvatarStore = useAvatarStore((state) => state.setAvatar);

  useEffect(() => {
    setAvatar(data.avatar);
  }, [data.avatar, toast]);

  const handleUploadSuccess = async (newAvatar: string) => {
    try {
      setAvatar(newAvatar);
      setAvatarStore(newAvatar);
      await axios.put("/api/profile/updateProfilePhoto", { avatar: newAvatar });
      toast.success("Profile photo updated successfully.");
    } catch (e) {
      console.log(e);
      toast.error("Error updating profile photo.");
    } finally {
      router.refresh();
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
        <Image
          src={avatar || "/images/nouser.png"}
          alt="avatar"
          width={140}
          height={160}
          className="w-full h-full object-cover"
        />
      </div>
      <Label htmlFor="file-upload" className="block mb-2 text-sm font-medium hover:underline cursor-pointer">
        Upload Image
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          // onChange={handleFileChange}
          disabled={isUploading}
        />
      </Label>
      {/* <FileUploaderDropzone
          uploader={"profilePhotoUploader"}
          onUploadSuccess={handleUploadSuccess}
        /> */}
    </div>

  )

}
