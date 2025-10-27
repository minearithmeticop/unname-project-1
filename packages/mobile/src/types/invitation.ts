export interface InvitationCode {
  id: string;
  code: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  used_by: string | null;
  used_at: string | null;
  is_used: boolean;
}

export interface GenerateCodeResponse {
  code: string;
  expires_at: string;
}

export interface ValidateCodeResponse {
  valid: boolean;
  message: string;
}
