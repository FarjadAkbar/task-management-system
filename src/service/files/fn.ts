import API from "@/lib/axios-client";

export const deleteFileMutationFn = async (
    fileId: string
  ): Promise<{ message: string }> => {
    const response = await API.delete(`/uploadthing/${fileId}`);
    return response.data;
  };