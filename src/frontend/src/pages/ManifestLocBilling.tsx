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
import { toast } from 'sonner';
import type { LOCInquiry } from '../backend';

export default function ManifestLocBilling() {
  const [displayedInquiry, setDisplayedInquiry] = useState<LOCInquiry | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDisplayLoading, setIsDisplayLoading] = useState(false);

  const { loginStatus } = useInternetIdentity();
  
  const { refetch: refetchLOCInquiry } = useDisplayLOCInquiry();
  const createInvoice = useCreateInvoice();

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

  const handleCreateInvoice = async () => {
    if (!isSelected || !displayedInquiry) return;

    try {
      // Create invoice with the inquiry details
      await createInvoice.mutateAsync({
        projectName: 'LOC Inquiry',
        amountDue: displayedInquiry.amount,
        dueDate: displayedInquiry.statementPeriod.split('–')[1] || displayedInquiry.statementPeriod.split('-')[1] || new Date().toLocaleDateString(),
        clientName: displayedInquiry.client,
        payerSource: displayedInquiry.payer,
      });

      setShowSuccess(true);
      toast.success('Invoice created successfully');
      
      // Clear the displayed inquiry after creating invoice
      setDisplayedInquiry(null);
      setIsSelected(false);
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      
      // Show error message without auth-specific handling
      const errorMessage = error?.message || 'Failed to create invoice. Please try again.';
      toast.error(errorMessage);
    }
  };

  const isLoading = isDisplayLoading || createInvoice.isPending;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          Manifest LOC Billing
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Manage Level of Care (LOC) billing manifests for hospice services.
        </p>

        <div className="mb-6 flex items-center gap-4">
          <Button onClick={handleDisplay} disabled={isLoading || loginStatus === 'logging-in'}>
            {isDisplayLoading ? 'Loading...' : 'Display'}
          </Button>
          <Button
            onClick={handleCreateInvoice}
            disabled={!isSelected || createInvoice.isPending}
            variant="default"
          >
            {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>

        {showSuccess && (
          <div className="mb-4 rounded-lg border border-primary bg-primary/10 p-4 text-sm text-foreground">
            Invoice successfully created for the selected record.
          </div>
        )}

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {!displayedInquiry ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No record, Click on display button
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={handleCheckboxChange}
                    />
                  </TableCell>
                  <TableCell>{displayedInquiry.client}</TableCell>
                  <TableCell>{displayedInquiry.mrNumber}</TableCell>
                  <TableCell>{displayedInquiry.statementPeriod}</TableCell>
                  <TableCell>{displayedInquiry.payer}</TableCell>
                  <TableCell>{displayedInquiry.amount}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
