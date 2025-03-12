import API from "@/lib/axios-client";
import { FileQueryParams, FilesResponseType, ShareFilePayload } from "./type";

export const deleteFileMutationFn = async (
    fileId: string
  ): Promise<{ message: string }> => {
    const response = await API.delete(`/uploadthing/${fileId}`);
    return response.data;
  };


  export const  getPrivarteFilesQueryFn = async (
    params: FileQueryParams
  ): Promise<FilesResponseType> => {
    const { search = "", type = "", sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20 } = params;
    const response = await API.get(
      `/files/private?search=${search}&type=${type}&sortBy=${sortBy}&sortOrder=${sortOrder}&pageSize=${page}&pageNumber=${limit}`,
    );
    return response.data;
  }


  export const  getSharedFilesQueryFn = async (
    params: FileQueryParams
  ): Promise<FilesResponseType> => {
    const { search = "", type = "", sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20 } = params;
    const response = await API.get(
      `/files/shared?search=${search}&type=${type}&sortBy=${sortBy}&sortOrder=${sortOrder}&pageSize=${page}&pageNumber=${limit}`,
    );
    return response.data;
  }

  export const  getFilesSharedWithMeFn = async (
    params: FileQueryParams
  ): Promise<FilesResponseType> => {
    const { search = "", type = "", sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20 } = params;
    const response = await API.get(
      `/files/shared-with-me?search=${search}&type=${type}&sortBy=${sortBy}&sortOrder=${sortOrder}&pageSize=${page}&pageNumber=${limit}`,
    );
    return response.data;
  }


  export const addShareMutationFn = async (data: ShareFilePayload) => {
    const response = await API.post("/files/share", data)
    return response.data
  }

  export const removeShareMutationFn = async ({ fileId, userId }: { fileId: string; userId: string }) => {
    const response = await API.delete(`/files/share?fileId=${fileId}&userId=${userId}`)
    return response.data
  }