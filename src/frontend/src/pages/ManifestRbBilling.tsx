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

interface BillingRecord {
  client: string;
  mrNumber: string;
  statementPeriod: string;
  payerSource: string;
  amount: string;
}

export default function ManifestRbBilling() {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDisplay = () => {
    // No backend integration - records remain empty
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  const handleCreateInvoice = () => {
    // Frontend-only invoice creation logic
    if (selectedIndex !== null) {
      // Future implementation
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          Manifest R&B Billing
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Manage Room & Board (R&B) billing manifests for hospice services.
        </p>

        <div className="mb-6 flex items-center gap-4">
          <Button onClick={handleDisplay}>Display</Button>
          <Button
            onClick={handleCreateInvoice}
            disabled={selectedIndex === null}
            variant="default"
          >
            Create Invoice
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No record, Click on display button
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIndex === index}
                        onCheckedChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                    <TableCell>{record.client}</TableCell>
                    <TableCell>{record.mrNumber}</TableCell>
                    <TableCell>{record.statementPeriod}</TableCell>
                    <TableCell>{record.payerSource}</TableCell>
                    <TableCell>{record.amount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
