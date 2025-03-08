export type PaginationType = {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    skip: number;
    limit: number;
  };

//********** */ TOOL TYPES ************************
//************************************************* */

export type CreateToolPayloadType = {
    name: string;
    username: string;
    password: string;
    department: string;
    documentID: string;
    createdBy: string;
  };
  
  export type UpdateToolPayloadType = {
    id: string;
    name?: string;
    username?: string;
    password?: string;
    department?: string;
    documentID?: string;
  };
  
  export type AllToolsPayloadType = {
    keyword?: string | null;
    department?: string | null;
    pageNumber?: number | null;
    pageSize?: number | null;
    skip?: boolean;
  };
  
  export type ToolType = {
    id: string;
    name: string;
    username: string;
    password: string;
    department: string;
    documentID: string;
    document: {
      id: string;
      name: string;
      document_file_url: string;
    };
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt?: string;
  };
  
  export type AllToolsResponseType = {
    message: string;
    tools: ToolType[];
    pagination: PaginationType;
  };
  