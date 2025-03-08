import API from "@/lib/axios-client"; // Adjust the import path based on your project structure
import {
  CreateToolPayloadType,
  UpdateToolPayloadType,
  AllToolsPayloadType,
  ToolType,
  AllToolsResponseType,
} from "@/types/api.type"; // Adjust import path accordingly

//********* */
//********* TOOLS

export const createToolMutationFn = async (
  data: CreateToolPayloadType
): Promise<{ message: string; tool: ToolType }> => {
  console.log(data, "data");
  const response = await API.post(`/tool`, data);
  return response.data;
};

export const editToolMutationFn = async (
  data: UpdateToolPayloadType
): Promise<{ message: string; tool: ToolType }> => {
  const response = await API.put(`/tool/${data.id}`, data);
  return response.data;
};

export const getAllToolsQueryFn = async (
  params: AllToolsPayloadType
): Promise<AllToolsResponseType> => {
  const { keyword, department, pageSize = 10, pageNumber = 1 } = params;
  const response = await API.get(
    `/tool?&keyword=${keyword || ""}&department=${department || ""}&pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getToolByIdQueryFn = async (
  toolId: string
): Promise<{ message: string; tool: ToolType }> => {
  const response = await API.get(`/tool/${toolId}`);
  return response.data;
};

export const deleteToolMutationFn = async (
  toolId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/tool/${toolId}`);
  return response.data;
};

//********* */
//********* FILES
export const deleteFileMutationFn = async (
  fileId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/uploadthing/${fileId}`);
  return response.data;
};
