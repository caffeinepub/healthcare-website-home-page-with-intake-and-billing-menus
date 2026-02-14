import { DollarSign, CreditCard, FileText, TrendingUp, Receipt, Shield } from 'lucide-react';

export default function Billing() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Billing</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Comprehensive billing and payment management system. Handle invoices, process payments, manage insurance claims, and track financial transactions with ease.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Receipt className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Invoice Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Create, send, and track invoices for medical services and procedures.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Payment Processing</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Accept multiple payment methods including credit cards, debit cards, and online payments.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Insurance Claims</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Submit and track insurance claims with automated verification and follow-up.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Financial Reports</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate detailed financial reports and analytics for better business insights.
            </p>
          </div>
        </div>

        {/* Information Panel */}
        <div className="rounded-xl border border-border bg-muted/50 p-8 space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Secure & Compliant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our billing system is designed with security and compliance at its core. All financial transactions are encrypted and processed through secure payment gateways. The system maintains full HIPAA compliance and provides detailed audit trails for all billing activities. Automated reminders help reduce outstanding balances while maintaining positive patient relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
