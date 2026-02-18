import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CreateLocInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (invoiceDate: string, transactionDate: string) => void;
  isPending?: boolean;
}

export function CreateLocInvoiceDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: CreateLocInvoiceDialogProps) {
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined);

  const handleSubmit = () => {
    if (invoiceDate && transactionDate) {
      onSubmit(
        format(invoiceDate, 'MM/dd/yyyy'),
        format(transactionDate, 'MM/dd/yyyy')
      );
      // Reset dates after submission
      setInvoiceDate(undefined);
      setTransactionDate(undefined);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset dates when closing
      setInvoiceDate(undefined);
      setTransactionDate(undefined);
    }
    onOpenChange(newOpen);
  };

  const isSubmitEnabled = !!invoiceDate && !!transactionDate && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Date */}
          <div className="space-y-2">
            <Label htmlFor="invoice-date">Invoice date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="invoice-date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceDate ? format(invoiceDate, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={setInvoiceDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label htmlFor="transaction-date">Transaction date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="transaction-date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {transactionDate ? format(transactionDate, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={transactionDate}
                  onSelect={setTransactionDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
          >
            {isPending ? 'Creating...' : 'Create Invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
