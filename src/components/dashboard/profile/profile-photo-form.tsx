"use client";

import Image from "next/image";
import { Users } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";

import useAvatarStore from "@/store/useAvatarStore";
import axios from "axios";

interface ProfileFormProps {
  data: Users;
}

export function ProfilePhotoForm({ data }: ProfileFormProps) {
  const [avatar, setAvatar] = useState(data.avatar);

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
    <div className="flex items-center space-x-5">
      <div>
        <Image
          src={avatar || "/images/nouser.png"}
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
      <div>
        {/* <FileUploaderDropzone
          uploader={"profilePhotoUploader"}
          onUploadSuccess={handleUploadSuccess}
        /> */}
      </div>
    </div>
  );
}
