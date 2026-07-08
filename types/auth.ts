import { User } from "firebase/auth";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  displayName: string;
}

export interface AuthUserContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}