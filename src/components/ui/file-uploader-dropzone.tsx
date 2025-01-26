import { UploadDropzone } from "@uploadthing/react";
import { ourFileRouter, OurFileRouter } from "@/app/api/uploadthing/core";

import "@uploadthing/react/styles.css";
import axios from "axios";

interface Props {
  onUploadSuccess?: (newAvatar: string) => void;
  taskId?: string;
}


export const FileUploaderDropzone = ({ onUploadSuccess, taskId }: Props) => (
  //@ts-ignore
  //TODO: Fix this issue with the type OurFileRouter
  <UploadDropzone<OurFileRouter>
    endpoint={"fileUploader"}
    onClientUploadComplete={async (res) => {
      // Do something with the response
      if(taskId !== undefined && res) {
        await axios.post(`/api/projects/tasks/${res[0]?.serverData?.id}/assign`, {
          taskId: taskId!,
        });
      }
      if (onUploadSuccess && res) {
        onUploadSuccess(res[0]?.url);
      }
    }}
    onUploadError={(error: Error) => {
      alert(`ERROR! ${error.message}`);
    }}
  />
);
