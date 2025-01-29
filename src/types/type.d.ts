export interface Session {
    id: string;
    _id: string;
    name: string;
    job_title?: string;
    avatar?: string | null | undefined;
    isAdmin: boolean;
    userStatus: string;
  }
  