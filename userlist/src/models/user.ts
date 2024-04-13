import { usertype } from "../types/user-type";

export class User {
  id: string
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: usertype
}
