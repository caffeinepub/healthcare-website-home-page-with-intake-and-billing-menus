/**
 * Utility to format bulk delete results into user-friendly messages.
 * Handles all-success, partial-success, and all-failed scenarios.
 */

import { normalizeAuthError } from './authErrorMessages';

export interface DeleteResult {
  id: bigint;
  success: boolean;
  error: string | null;
}

export interface DeleteSummary {
  successfulIds: bigint[];
  failedIds: bigint[];
  results: DeleteResult[];
}

/**
 * Format delete results into a user-friendly message.
 * Returns { type: 'success' | 'error', message: string }
 */
export function formatDeleteResultMessage(
  summary: DeleteSummary,
  totalAttempted: number
): { type: 'success' | 'error'; message: string } {
  const { successfulIds, failedIds, results } = summary;
  const successCount = successfulIds.length;
  const failedCount = failedIds.length;

  // All succeeded
  if (failedCount === 0) {
    return {
      type: 'success',
      message: `${successCount} invoice${successCount === 1 ? '' : 's'} deleted successfully`,
    };
  }

  // All failed
  if (successCount === 0) {
    // Try to extract a meaningful error reason from the first failure
    const firstError = results.find(r => !r.success)?.error;
    const reason = firstError ? extractFailureReason(firstError) : '';
    const reasonText = reason ? ` ${reason}` : '';
    
    return {
      type: 'error',
      message: `Failed to delete ${failedCount} invoice${failedCount === 1 ? '' : 's'}.${reasonText}`,
    };
  }

  // Partial success
  return {
    type: 'error',
    message: `Partially completed: ${successCount} deleted, ${failedCount} failed. Failed invoices remain selected.`,
  };
}

/**
 * Extract a concise, actionable failure reason from an error message.
 */
function extractFailureReason(errorMessage: string): string {
  // Normalize the error using our auth error utility
  const normalized = normalizeAuthError(errorMessage, 'write');
  
  // If it's a generic message, return empty (we'll just show the count)
  if (
    normalized.includes('An error occurred') ||
    normalized.includes('Please try again') ||
    normalized.length > 80
  ) {
    return '';
  }
  
  // Return the normalized message as a reason
  return normalized;
}
