import { supabase } from '../lib/supabase';
import { 
  InvitationCode, 
  GenerateCodeResponse, 
  ValidateCodeResponse 
} from '../types/invitation';

/**
 * Generate a new invitation code
 * Only authenticated users can generate codes
 */
export async function generateInvitationCode(): Promise<{
  data: GenerateCodeResponse | null;
  error: Error | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase.rpc('generate_invitation_code', {
      user_id: user.id,
    });

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Validate an invitation code
 */
export async function validateInvitationCode(code: string): Promise<{
  data: ValidateCodeResponse | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.rpc('validate_invitation_code', {
      input_code: code.toUpperCase().trim(),
    });

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Mark invitation code as used after successful signup
 */
export async function markCodeAsUsed(code: string, userId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.rpc('mark_code_as_used', {
      input_code: code.toUpperCase().trim(),
      user_id: userId,
    });

    if (error) throw error;

    return { success: data, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Get user's invitation codes
 */
export async function getMyInvitationCodes(): Promise<{
  data: InvitationCode[] | null;
  error: Error | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete expired codes (cleanup)
 */
export async function cleanupExpiredCodes(): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.rpc('delete_expired_invitation_codes');

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
