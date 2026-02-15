import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ClaimDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  totalAmount: string;
  rhcDays?: number;
  continuousCareDays?: number;
  gipDays?: number;
  respiteDays?: number;
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
}: ClaimDetailsDialogProps) {
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
