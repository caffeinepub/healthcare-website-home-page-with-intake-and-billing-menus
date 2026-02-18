import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Invoice, Inquiry, LOCInquiry, InvoiceRequest } from '../backend';

// Query keys
export const INVOICES_QUERY_KEY = ['invoices'];
export const INQUIRIES_QUERY_KEY = ['inquiries'];
export const LOC_INQUIRY_QUERY_KEY = ['locInquiry'];

// Inquiry hooks
export function useGetInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: INQUIRIES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInquiry(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEY });
    },
  });
}

export function useMarkInquiryAsInvoiced() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inquiryId, isInvoiced }: { inquiryId: bigint; isInvoiced: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markInquiryAsInvoiced(inquiryId, isInvoiced);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEY });
    },
  });
}

// LOC Inquiry hooks - lazy query that doesn't auto-fetch
// This is a read-only query that any authenticated user can call
export function useDisplayLOCInquiry() {
  const { actor, isFetching } = useActor();

  return useQuery<LOCInquiry | null>({
    queryKey: LOC_INQUIRY_QUERY_KEY,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // displayLOCInquiry is a query call that requires user permission
      // The backend will return the sample LOC inquiry for any authenticated user
      return actor.displayLOCInquiry();
    },
    enabled: false, // Lazy query - only fetch when explicitly called via refetch()
    retry: false, // Don't auto-retry on auth failures
    staleTime: 0, // Always fetch fresh data
  });
}

// Invoice hooks
export function useGetAllInvoices(options?: { enabled?: boolean }) {
  const { actor, isFetching } = useActor();
  const enabled = options?.enabled ?? true;

  return useQuery<Invoice[]>({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceRequest: InvoiceRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInvoice(invoiceRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      // Also invalidate LOC receivables since creating an invoice may affect that list
      queryClient.invalidateQueries({ queryKey: ['locReceivables'] });
      // Invalidate LOC inquiry query so Display will fetch fresh state
      queryClient.invalidateQueries({ queryKey: LOC_INQUIRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete multiple invoices and refresh all invoice queries.
 * Returns detailed results for each invoice deletion without throwing on partial failures.
 */
export function useDeleteInvoices() {
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
        queryClient.setQueryData<Invoice[]>(INVOICES_QUERY_KEY, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(invoice => !successfulIds.some(id => id === invoice.id));
        });
        
        // Also update LOC receivables cache if applicable
        queryClient.setQueryData<Invoice[]>(['locReceivables'], (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(invoice => !successfulIds.some(id => id === invoice.id));
        });
      }
      
      // Invalidate as a safety net to ensure consistency
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['locReceivables'] });
      // Invalidate LOC inquiry query so Display will fetch fresh state after deletion
      queryClient.invalidateQueries({ queryKey: LOC_INQUIRY_QUERY_KEY });
    },
  });
}
