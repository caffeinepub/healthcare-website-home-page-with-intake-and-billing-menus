import { FileText, User, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export default function Intake() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Intake</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Patient registration and information collection system. This section allows healthcare providers to efficiently gather and manage patient information during the intake process.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Patient Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Collect comprehensive patient demographics, medical history, and contact details.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Appointment Scheduling</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule and manage patient appointments with integrated calendar functionality.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Contact Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Maintain up-to-date contact information and emergency contacts for all patients.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Communication</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Send automated reminders and notifications to patients via email or SMS.
            </p>
          </div>
        </div>

        {/* Information Panel */}
        <div className="rounded-xl border border-border bg-muted/50 p-8 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Getting Started</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The intake process is designed to be simple and efficient. Patients can complete their registration forms online before their appointment, or staff can assist with data entry during check-in. All information is securely stored and easily accessible to authorized healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
