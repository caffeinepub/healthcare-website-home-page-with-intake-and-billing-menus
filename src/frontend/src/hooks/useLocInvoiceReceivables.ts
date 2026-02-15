import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Invoice } from '../backend';

// Query key for LOC receivables
export const LOC_RECEIVABLES_QUERY_KEY = ['locReceivables'];

/**
 * Hook to fetch LOC receivables using the dedicated backend method.
 * This method is accessible to anonymous users and returns all LOC invoices
 * with status "pending" and projectName "LOC Inquiry".
 */
export function useGetLOCReceivables(options?: { enabled?: boolean }) {
  const { actor, isFetching } = useActor();
  const enabled = options?.enabled ?? true;

  return useQuery<Invoice[]>({
    queryKey: LOC_RECEIVABLES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) throw new Error('Backend connection not available');
      return actor.getLOCReceivables();
    },
    enabled: !!actor && !isFetching && enabled,
    retry: 1, // Limit retries for faster error feedback
    retryDelay: 500,
  });
}

/**
 * Hook to delete multiple invoices and refresh LOC receivables.
 * Returns detailed results for each invoice deletion without throwing on partial failures.
 */
export function useDeleteLOCInvoices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceIds: bigint[]) => {
      if (!actor) throw new Error('Actor not available');
      
      // Delete all invoices and track individual results
      const results = await Promise.allSettled(
        invoiceIds.map(async (id) => {
          try {
            const success = await actor.deleteInvoice(id);
            return { id, success, error: null };
          } catch (error) {
            return { id, success: false, error: error instanceof Error ? error.message : String(error) };
          }
        })
      );
      
      // Extract successful and failed deletions
      const deletionResults = results.map(r => r.status === 'fulfilled' ? r.value : { id: 0n, success: false, error: 'Unknown error' });
      const successfulIds = deletionResults.filter(r => r.success).map(r => r.id);
      const failedIds = deletionResults.filter(r => !r.success).map(r => r.id);
      
      return { successfulIds, failedIds, results: deletionResults };
    },
    onSuccess: ({ successfulIds }) => {
      // Optimistically update the cache by removing successfully deleted invoices
      if (successfulIds.length > 0) {
        queryClient.setQueryData<Invoice[]>(LOC_RECEIVABLES_QUERY_KEY, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(invoice => !successfulIds.some(id => id === invoice.id));
        });
      }
      
      // Invalidate as a safety net to ensure consistency
      queryClient.invalidateQueries({ queryKey: LOC_RECEIVABLES_QUERY_KEY });
    },
  });
}
