"use client";

import Image from "next/image";
import { Users } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";

import useAvatarStore from "@/store/useAvatarStore";
import axios from "axios";

interface ProfileFormProps {
  data: Users;
}

export function ProfilePhotoForm({ data }: ProfileFormProps) {
  const [avatar, setAvatar] = useState(data.avatar);

  const { toast } = useToast();
  const router = useRouter();
  const setAvatarStore = useAvatarStore((state) => state.setAvatar);

  useEffect(() => {
    setAvatar(data.avatar);
  }, [data.avatar, toast]);

  const handleUploadSuccess = async (files: { id: string; name: string; url: string }[]) => {
    try {
      setAvatar(files[0].url);
      setAvatarStore(files[0].url);
      await axios.put("/api/profile/updateProfilePhoto", { avatar: files[0].url });
      toast({
        title: "Profile photo updated.",
        description: "Your profile photo has been updated.",
        duration: 5000,
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "default",
        title: "Error updating profile photo.",
        description: "There was an error updating your profile photo.",
        duration: 5000,
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
      <div>
        <Image
          src={avatar || "/images/nouser.png"}
          alt="avatar"
          width={100}
          height={100}
          className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-full object-cover"
        />
      </div>
      <div className="w-full sm:w-auto">
        <FileUploaderDropzone onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
