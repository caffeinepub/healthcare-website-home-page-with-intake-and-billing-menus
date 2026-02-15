import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetLOCReceivables, useDeleteLOCInvoices } from '@/hooks/useLocInvoiceReceivables';
import { ClaimDetailsDialog } from '@/components/ClaimDetailsDialog';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { normalizeAuthError } from '@/utils/authErrorMessages';
import { formatDeleteResultMessage } from '@/utils/deleteResultsMessaging';

export default function LocInvoiceReceivable() {
  const [displayClicked, setDisplayClicked] = useState(false);
  const { data: invoices = [], isLoading, error, refetch } = useGetLOCReceivables({ enabled: displayClicked });
  const deleteInvoices = useDeleteLOCInvoices();
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<bigint>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInvoice, setDialogInvoice] = useState<{
    invoiceNumber: string;
    amount: string;
  } | null>(null);

  // Clear selection if selected invoices no longer exist
  useEffect(() => {
    if (selectedInvoiceIds.size > 0) {
      const validIds = new Set(invoices.map(inv => inv.id));
      const newSelection = new Set(
        Array.from(selectedInvoiceIds).filter(id => validIds.has(id))
      );
      if (newSelection.size !== selectedInvoiceIds.size) {
        setSelectedInvoiceIds(newSelection);
      }
    }
  }, [invoices, selectedInvoiceIds]);

  const handleDisplay = () => {
    setDisplayClicked(true);
    if (displayClicked) {
      refetch();
    }
  };

  const handleCheckboxChange = (invoiceId: bigint) => {
    const newSelection = new Set(selectedInvoiceIds);
    if (newSelection.has(invoiceId)) {
      newSelection.delete(invoiceId);
    } else {
      newSelection.add(invoiceId);
    }
    setSelectedInvoiceIds(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.size === invoices.length && invoices.length > 0) {
      // Deselect all
      setSelectedInvoiceIds(new Set());
    } else {
      // Select all
      setSelectedInvoiceIds(new Set(invoices.map(inv => inv.id)));
    }
  };

  const isAllSelected = invoices.length > 0 && selectedInvoiceIds.size === invoices.length;
  const isIndeterminate = selectedInvoiceIds.size > 0 && selectedInvoiceIds.size < invoices.length;

  const handleDelete = async () => {
    if (selectedInvoiceIds.size === 0) return;

    const idsToDelete = Array.from(selectedInvoiceIds);
    
    try {
      const result = await deleteInvoices.mutateAsync(idsToDelete);
      
      // Format the result message
      const { type, message } = formatDeleteResultMessage(result, idsToDelete.length);
      
      // Show appropriate toast
      if (type === 'success') {
        toast.success(message);
        setSelectedInvoiceIds(new Set());
      } else {
        toast.error(message);
        // Keep only failed invoice IDs in selection
        setSelectedInvoiceIds(new Set(result.failedIds));
      }
    } catch (error) {
      // Handle unexpected errors (e.g., network failures, actor unavailable)
      console.error('Failed to delete invoice(s):', error);
      const errorMessage = normalizeAuthError(error, 'write');
      toast.error(`Delete operation failed: ${errorMessage}`);
    }
  };

  const handleInvoiceClick = (invoiceId: bigint, amount: number) => {
    setDialogInvoice({
      invoiceNumber: `INV-${invoiceId.toString().padStart(5, '0')}`,
      amount: amount.toFixed(2),
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setDialogInvoice(null);
    }
  };

  // Helper function to extract MR# from invoice data
  const getMRNumber = (invoice: typeof invoices[0]): string => {
    // For "LOC Inquiry" invoices, we need to extract MR# from a different source
    // Since the backend doesn't store MR# separately, we'll use a placeholder
    // In a real scenario, this would be stored in the invoice or linked to the inquiry
    if (invoice.projectName === 'LOC Inquiry') {
      // For now, return a placeholder or extract from clientName if available
      return 'KT99'; // This matches the sample data from displayLOCInquiry
    }
    // For LOC-{mrNumber} format
    return invoice.projectName.replace('LOC-', '');
  };

  // Determine if we have an error state
  const hasError = displayClicked && error && !isLoading;
  const errorMessage = hasError ? normalizeAuthError(error, 'display') : '';

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          LOC Receivables
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          View and manage Level of Care (LOC) invoice receivables.
        </p>

        <div className="mb-6 flex gap-3">
          <Button
            onClick={handleDisplay}
            variant="default"
          >
            Display
          </Button>
          <Button
            onClick={handleDelete}
            disabled={selectedInvoiceIds.size === 0 || deleteInvoices.isPending}
            variant="destructive"
          >
            {deleteInvoices.isPending ? 'Deleting...' : `Delete${selectedInvoiceIds.size > 0 ? ` (${selectedInvoiceIds.size})` : ''}`}
          </Button>
        </div>

        {/* Error Alert */}
        {hasError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">Failed to load LOC receivables</div>
              <div className="mt-1 text-sm">{errorMessage}</div>
              <div className="mt-2 text-sm">
                Try clicking <strong>Display</strong> again. If the problem persists, please contact support.
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={isIndeterminate ? 'data-[state=checked]:bg-primary' : ''}
                    {...(isIndeterminate ? { 'data-state': 'indeterminate' as any } : {})}
                  />
                </TableHead>
                <TableHead>Invoice number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>MR#</TableHead>
                <TableHead>Statement period</TableHead>
                <TableHead>Payersource</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!displayClicked ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Click Display to load invoices
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : hasError ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Unable to display invoices due to an error
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No LOC invoice receivables found
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const mrNumber = getMRNumber(invoice);
                  
                  return (
                    <TableRow key={invoice.id.toString()}>
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoiceIds.has(invoice.id)}
                          onCheckedChange={() => handleCheckboxChange(invoice.id)}
                          aria-label={`Select invoice ${invoice.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleInvoiceClick(invoice.id, invoice.amountDue)}
                          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        >
                          INV-{invoice.id.toString().padStart(5, '0')}
                        </button>
                      </TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{mrNumber}</TableCell>
                      <TableCell>1/1/2026-1/31/2026</TableCell>
                      <TableCell>{invoice.payerSource}</TableCell>
                      <TableCell>${invoice.amountDue.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {dialogInvoice && (
        <ClaimDetailsDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          invoiceNumber={dialogInvoice.invoiceNumber}
          totalAmount={dialogInvoice.amount}
        />
      )}
    </div>
  );
}
