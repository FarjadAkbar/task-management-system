import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

import "@uploadthing/react/styles.css";
import axios from "axios";

interface Props {
  onUploadSuccess?: (files: { id: string; name: string; url: string }[]) => void
  taskId?: string;
}


export const FileUploaderDropzone = ({ onUploadSuccess, taskId }: Props) => (
  //@ts-ignore
  //TODO: Fix this issue with the type OurFileRouter
  <UploadDropzone<OurFileRouter>
    endpoint={"fileUploader"}
    onClientUploadComplete={async (res) => {
      // Do something with the response
      if (taskId !== undefined && res) {
        await Promise.all(
          res.map(async (file) => {
            await axios.post(`/api/projects/tasks/${file?.serverData?.id}/assign`, {
              taskId: taskId,
            });
          })
        );
      }
      
      if (onUploadSuccess && res?.length) {
        const uploadedFiles = res.map((file) => ({
          id: file.serverData.id,
          name: file.name,
          url: file.url,
        }))
        onUploadSuccess(uploadedFiles)
      }
    }}
    onUploadError={(error: Error) => {
      alert(`ERROR! ${error.message}`);
    }}
  />
);
