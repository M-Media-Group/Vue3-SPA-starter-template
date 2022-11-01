export interface User {
  id?: number;
  username: string;
  name: string | null;
  surname: string | null;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  seen_at: Date;
  created_at: Date;
  updated_at: Date;
  description: string | null;
  is_public: boolean;
  stripe_id: string | null;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  personal_access_tokens?: PersonalAccessToken[];
}

export interface PersonalAccessToken {
  id: string;
  user_id: number;
  client_id: number;
  name: string | null;
  scopes: string[];
  revoked: boolean;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
  client?: Client;
}

export interface Client {
  id: number;
  user_id: null;
  name: string;
  provider: null;
  redirect: string;
  personal_access_client: boolean;
  password_client: boolean;
  revoked: boolean;
  created_at: Date;
  updated_at: Date;
}
