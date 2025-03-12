export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

export type UsersResponseType = {
  message: string;
  users: UserType[];
};