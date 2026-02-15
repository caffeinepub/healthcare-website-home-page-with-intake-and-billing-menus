/**
 * Utility to normalize backend authentication/authorization errors into user-friendly messages.
 * Handles Debug.trap-style errors and common authorization failures.
 */

export function normalizeAuthError(error: unknown, context: 'display' | 'write' = 'write'): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check for backend connection errors first
  if (errorMessage.includes('Backend connection not available') || errorMessage.includes('Actor not available')) {
    return 'Unable to connect to the backend. Please refresh the page and try again.';
  }
  
  // Check for common authorization patterns
  if (errorMessage.includes('Unauthorized')) {
    if (errorMessage.includes('Only users can')) {
      return context === 'display' 
        ? 'Unable to load data. Please try again.'
        : 'Please sign in to access this feature.';
    }
    if (errorMessage.includes('Only admins can')) {
      return 'This action requires administrator privileges.';
    }
    if (errorMessage.includes('Only authenticated users can delete')) {
      return 'Please sign in to delete invoices.';
    }
    if (errorMessage.includes('Can only delete your own invoices')) {
      return 'You can only delete invoices you created.';
    }
    return context === 'display'
      ? 'Unable to load data. Please try again.'
      : 'You do not have permission to perform this action.';
  }
  
  // Check for trap errors (backend Debug.trap calls)
  if (errorMessage.includes('trap') || errorMessage.includes('Reject')) {
    if (errorMessage.toLowerCase().includes('unauthorized')) {
      return context === 'display'
        ? 'Unable to load data. Please try again.'
        : 'Authentication required. Please sign in to continue.';
    }
    return context === 'display'
      ? 'An error occurred while loading data. Please try again.'
      : 'An authorization error occurred. Please try signing in again.';
  }
  
  // Check for network/fetch errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Check for deletion-specific errors
  if (errorMessage.includes('Failed to delete')) {
    // Extract count if present
    const match = errorMessage.match(/Failed to delete (\d+)/);
    if (match) {
      return `Unable to delete ${match[1]} invoice${match[1] === '1' ? '' : 's'}. Please try again.`;
    }
    return 'Some invoices could not be deleted. Please try again or contact support.';
  }
  
  // Return a sanitized version of the error (no stack traces)
  const firstLine = errorMessage.split('\n')[0];
  return firstLine.length > 100 ? 'An error occurred. Please try again.' : firstLine;
}

export function isAuthError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('trap') ||
    errorMessage.toLowerCase().includes('permission')
  );
}
