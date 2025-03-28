export interface Session {
    id: string;
    _id: string;
    name: string;
    role?: string;
    avatar?: string | null | undefined;
    isAdmin: boolean;
    userStatus: string;
  }
  