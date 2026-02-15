import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Invoice, Inquiry, LOCInquiry } from '../backend';

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

// LOC Inquiry hooks
export function useDisplayLOCInquiry() {
  const { actor, isFetching } = useActor();

  return useQuery<LOCInquiry | null>({
    queryKey: LOC_INQUIRY_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return null;
      return actor.displayLOCInquiry();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResetLOCSample() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLOCInvoice();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOC_INQUIRY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEY });
    },
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
    mutationFn: async (data: {
      projectName: string;
      amountDue: number;
      dueDate: string;
      clientName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInvoice(
        data.projectName,
        data.amountDue,
        data.dueDate,
        data.clientName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    },
  });
}

export function useDeleteInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.deleteInvoice(invoiceId);
      if (!result) {
        throw new Error('Failed to delete invoice');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate both invoices and inquiries to refresh the UI
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEY });
    },
  });
}
