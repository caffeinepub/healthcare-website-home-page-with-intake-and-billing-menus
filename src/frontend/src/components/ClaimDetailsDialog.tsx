import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ClaimDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  totalAmount: string;
  rhcDays?: number;
  continuousCareDays?: number;
  gipDays?: number;
  respiteDays?: number;
  invoiceDate?: string;
  transactionDate?: string;
  socDate?: string;
  invoiceId?: bigint;
  onCancelInvoice?: (invoiceId: bigint) => Promise<void>;
  isCancelling?: boolean;
  cancelError?: string | null;
}

export function ClaimDetailsDialog({
  open,
  onOpenChange,
  invoiceNumber,
  totalAmount,
  rhcDays = 0,
  continuousCareDays = 0,
  gipDays = 0,
  respiteDays = 0,
  invoiceDate,
  transactionDate,
  socDate,
  invoiceId,
  onCancelInvoice,
  isCancelling = false,
  cancelError = null,
}: ClaimDetailsDialogProps) {
  const handleCancelInvoice = async () => {
    if (invoiceId && onCancelInvoice) {
      await onCancelInvoice(invoiceId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Claim details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Invoice Number */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium text-muted-foreground">Invoice Number</span>
            <span className="text-sm font-semibold text-foreground">{invoiceNumber}</span>
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-base font-medium text-foreground">Total Amount</span>
            <span className="text-lg font-bold text-primary">{totalAmount}</span>
          </div>

          <Separator />

          {/* Invoice Date, Transaction Date, and SOC Date */}
          {(invoiceDate || transactionDate || socDate) && (
            <>
              <div className="space-y-3 rounded-lg border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">Invoice Information</h3>
                
                <div className="space-y-2">
                  {invoiceDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Invoice date</span>
                      <span className="text-sm font-medium text-foreground">{invoiceDate}</span>
                    </div>
                  )}
                  
                  {transactionDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transaction date</span>
                      <span className="text-sm font-medium text-foreground">{transactionDate}</span>
                    </div>
                  )}

                  {socDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SOC Date</span>
                      <span className="text-sm font-medium text-foreground">{socDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Hospice Day Counts */}
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">Hospice Day Counts</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">RHC Days</span>
                <span className="text-sm font-medium text-foreground">{rhcDays}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Continuous care Days</span>
                <span className="text-sm font-medium text-foreground">{continuousCareDays}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">GIP Days</span>
                <span className="text-sm font-medium text-foreground">{gipDays}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Respite Days</span>
                <span className="text-sm font-medium text-foreground">{respiteDays}</span>
              </div>
            </div>
          </div>

          {/* Cancel Error Alert */}
          {cancelError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{cancelError}</AlertDescription>
            </Alert>
          )}

          {/* Cancel Invoice Button */}
          {invoiceId && onCancelInvoice && (
            <>
              <Separator />
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleCancelInvoice}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Invoice'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
