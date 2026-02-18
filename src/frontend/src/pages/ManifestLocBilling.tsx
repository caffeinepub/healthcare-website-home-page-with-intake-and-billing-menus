import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDisplayLOCInquiry, useCreateInvoice } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { CreateLocInvoiceDialog } from '@/components/CreateLocInvoiceDialog';
import { toast } from 'sonner';
import type { LOCInquiry } from '../backend';

export default function ManifestLocBilling() {
  const [displayedInquiry, setDisplayedInquiry] = useState<LOCInquiry | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDisplayLoading, setIsDisplayLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { loginStatus } = useInternetIdentity();
  
  const { refetch: refetchLOCInquiry } = useDisplayLOCInquiry();
  const createInvoice = useCreateInvoice();

  // Helper function to format backend date (2026-01-02) to display format (1/1/2026)
  const formatDateForDisplay = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      // Format as M/D/YYYY
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } catch {
      return isoDate;
    }
  };

  const handleDisplay = async () => {
    // No authentication check - allow anonymous users to display
    setIsDisplayLoading(true);
    setShowSuccess(false);
    
    try {
      // Fetch the LOC inquiry from backend
      const result = await refetchLOCInquiry();
      
      if (result.error) {
        throw result.error;
      }

      // Handle undefined by treating it as null
      const inquiry = result.data ?? null;

      // Set the displayed inquiry (null if not available)
      setDisplayedInquiry(inquiry);
      setIsSelected(false);
      
      if (inquiry) {
        toast.success('LOC inquiry loaded successfully');
      } else {
        // When null, the inquiry has already been invoiced
        // Show the existing "No record" message without attempting reset
        toast.info('No LOC inquiry available');
      }
    } catch (error: any) {
      console.error('Failed to display LOC inquiry:', error);
      
      const errorMessage = error?.message || 'Failed to load LOC inquiry. Please try again.';
      toast.error(errorMessage);
      
      // Reset state to allow retry
      setDisplayedInquiry(null);
      setIsSelected(false);
    } finally {
      setIsDisplayLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
    setShowSuccess(false);
  };

  const handleCreateInvoiceClick = () => {
    if (!isSelected || !displayedInquiry) return;
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (invoiceDate: string, transactionDate: string) => {
    if (!displayedInquiry) return;

    try {
      // Create invoice with the inquiry details, dates, and status fields
      // Keep socDate in backend format (2026-01-02) for backend detection logic
      await createInvoice.mutateAsync({
        projectName: 'LOC Inquiry',
        amountDue: displayedInquiry.amount,
        dueDate: displayedInquiry.statementPeriod.split('–')[1] || displayedInquiry.statementPeriod.split('-')[1] || new Date().toLocaleDateString(),
        clientName: displayedInquiry.client,
        payerSource: displayedInquiry.payer,
        invoiceDate,
        transactionDate,
        socDate: displayedInquiry.socDate, // Keep in ISO format for backend
        dischargeDate: displayedInquiry.dischargeDate || undefined, // Ensure null becomes undefined
      });

      setShowSuccess(true);
      toast.success('Invoice created successfully');
      
      // Clear the displayed inquiry after creating invoice
      setDisplayedInquiry(null);
      setIsSelected(false);
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      
      // Show error message without auth-specific handling
      const errorMessage = error?.message || 'Failed to create invoice. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          Manifest LOC Billing
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Display and manage Level of Care (LOC) billing inquiries.
        </p>

        <div className="mb-6 flex gap-3">
          <Button
            onClick={handleDisplay}
            variant="default"
            disabled={isDisplayLoading}
          >
            {isDisplayLoading ? 'Loading...' : 'Display'}
          </Button>
          <Button
            onClick={handleCreateInvoiceClick}
            disabled={!isSelected || createInvoice.isPending}
            variant="default"
          >
            {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Client</TableHead>
                <TableHead>MR#</TableHead>
                <TableHead>Statement period</TableHead>
                <TableHead>Payersource</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedInquiry ? (
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={handleCheckboxChange}
                      aria-label="Select inquiry"
                    />
                  </TableCell>
                  <TableCell>{displayedInquiry.client}</TableCell>
                  <TableCell>{displayedInquiry.mrNumber}</TableCell>
                  <TableCell>{displayedInquiry.statementPeriod}</TableCell>
                  <TableCell>{displayedInquiry.payer}</TableCell>
                  <TableCell>${displayedInquiry.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">SOC Date: </span>
                        <span className="font-medium text-foreground">
                          {formatDateForDisplay(displayedInquiry.socDate)}
                        </span>
                      </div>
                      {displayedInquiry.dischargeDate && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Discharge Date: </span>
                          <span className="font-medium text-foreground">
                            {formatDateForDisplay(displayedInquiry.dischargeDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No record, Click on display button
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CreateLocInvoiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleDialogSubmit}
          isPending={createInvoice.isPending}
        />
      </div>
    </div>
  );
}
