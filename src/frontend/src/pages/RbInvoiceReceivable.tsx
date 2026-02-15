import { useState, useEffect } from 'react';
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
import { useGetAllInvoices, useDeleteInvoice } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function RbInvoiceReceivable() {
  const [displayClicked, setDisplayClicked] = useState(false);
  const { data: allInvoices = [], isLoading, refetch } = useGetAllInvoices({ enabled: displayClicked });
  const deleteInvoice = useDeleteInvoice();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<bigint | null>(null);

  // Filter to R&B invoices only (RB- or R&B- prefix)
  const invoices = allInvoices.filter(invoice => 
    invoice.projectName.startsWith('RB-') || invoice.projectName.startsWith('R&B-')
  );

  // Clear selection if the selected invoice no longer exists
  useEffect(() => {
    if (selectedInvoiceId !== null) {
      const exists = invoices.some(inv => inv.id === selectedInvoiceId);
      if (!exists) {
        setSelectedInvoiceId(null);
      }
    }
  }, [invoices, selectedInvoiceId]);

  const handleDisplay = () => {
    setDisplayClicked(true);
    if (displayClicked) {
      refetch();
    }
  };

  const handleCheckboxChange = (invoiceId: bigint) => {
    setSelectedInvoiceId(selectedInvoiceId === invoiceId ? null : invoiceId);
  };

  const handleDelete = async () => {
    if (selectedInvoiceId === null) return;

    try {
      await deleteInvoice.mutateAsync(selectedInvoiceId);
      toast.success('Invoice deleted successfully');
      setSelectedInvoiceId(null);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast.error('Failed to delete invoice. Please try again.');
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          R&B Receivables
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          View and manage Room & Board (R&B) invoice receivables.
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
            disabled={selectedInvoiceId === null || deleteInvoice.isPending}
            variant="destructive"
          >
            {deleteInvoice.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
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
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No R&B invoice receivables found
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  // Parse project name to extract MR# (format: RB-{mrNumber} or R&B-{mrNumber})
                  const mrNumber = invoice.projectName.replace(/^(RB-|R&B-)/, '');
                  
                  return (
                    <TableRow key={invoice.id.toString()}>
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoiceId === invoice.id}
                          onCheckedChange={() => handleCheckboxChange(invoice.id)}
                        />
                      </TableCell>
                      <TableCell>INV-{invoice.id.toString().padStart(5, '0')}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{mrNumber}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell>${invoice.amountDue.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
