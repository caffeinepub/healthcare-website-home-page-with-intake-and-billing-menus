import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Ub04Form() {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <div className="mb-6">
          <Link to="/receivables/loc">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to LOC Receivables
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-[1400px] rounded-lg bg-white p-8 shadow-lg">
          <div className="relative">
            {/* UB04 Red Form Template Background */}
            <div className="relative mx-auto max-w-full">
              <img
                src="/assets/generated/ub04-red-form-template.dim_1400x1000.png"
                alt="UB04 Form Template"
                className="h-auto w-full"
              />
              
              {/* Overlay Invoice Number on the form */}
              <div className="absolute left-[5%] top-[3%]">
                <div className="rounded bg-white/90 px-3 py-1.5 shadow-sm">
                  <span className="text-sm font-semibold text-foreground">
                    Invoice #: Sample
                  </span>
                </div>
              </div>

              {/* Optional: Add more overlays for other data fields as needed */}
              <div className="absolute bottom-[5%] right-[5%]">
                <div className="rounded bg-white/90 px-3 py-1.5 shadow-sm">
                  <span className="text-xs text-muted-foreground">
                    Service Type: Level of Care (LOC)
                  </span>
                </div>
              </div>
            </div>

            {/* Information Note */}
            <div className="mt-6 rounded-md border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                This UB04 form displays the standard red-lined healthcare claim form template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
