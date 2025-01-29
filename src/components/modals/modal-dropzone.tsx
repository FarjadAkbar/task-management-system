"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import UploadFileModal from "@/components/modals/upload-file-modal";
import { Button } from "@/components/ui/button";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";

type Props = {
  taskId?: string;
};

const ModalDropzone = ({ taskId }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Upload</Button>
      <UploadFileModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          router.refresh();
        }}
      >
        <FileUploaderDropzone taskId={taskId} />
      </UploadFileModal>
    </div>
  );
};

export default ModalDropzone;
