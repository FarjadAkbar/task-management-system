
import { User as DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
  }

  interface Session {
    user: User & {
      id: UserId;
      _id: UserId;
      role?: string;
      avatar?: string | null | undefined;
      isAdmin: boolean;
      userStatus: string;
    };
  }
}