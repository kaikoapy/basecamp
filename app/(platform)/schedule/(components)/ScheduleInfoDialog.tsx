import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function ScheduleInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Info className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">
            How Our Schedule Works
          </DialogTitle>
        </DialogHeader>
        <div
          className="space-y-4 overflow-y-auto pr-6"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          <section>
            <h3 className="font-bold text-base mb-1">
              Daily Shifts (Monday-Saturday)
            </h3>
            <ul className="list-disc pl-4 space-y-0.5 text-sm">
              <li>Opening: 8:30am - 5:30pm</li>
              <li>Mid: 9am - 6pm</li>
              <li>Close: 11am - 8pm (11am - 7pm on Fridays & Saturdays)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-1">Sundays</h3>
            <ul className="list-disc pl-4 space-y-0.5 text-sm">
              <li>One shift: 12pm - 5pm</li>
              <li>You&apos;ll work every other Sunday</li>
              <li>
                Your schedule will alternate: if you&apos;re off this Sunday,
                you&apos;ll work next Sunday
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-1">
              Regular Days Off & Scheduling Rules
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">Fixed Weekly Off Days:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Ron & Moudy: Tuesdays</li>
                  <li>Juan & Amr: Wednesdays</li>
                  <li>Kai & Alex: Mondays</li>
                  <li>Gabriel: Thursdays</li>
                  <li>Gio & Tito: Fridays</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-1">Off Day Scheduling Rules:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>
                    The day before your off day: You&apos;ll be scheduled to
                    open
                  </li>
                  <li>
                    The day after your off day: You&apos;ll be scheduled to
                    close
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-1">Weekend Rotation:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>
                    Every Saturday, one person gets both Saturday and Sunday off
                  </li>
                  <li>This weekend off rotates fairly through all employees</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-1">End of Month Rules</h3>
            <ul className="list-disc pl-4 space-y-0.5 text-sm">
              <li>Everyone works the last weekend of the sales month</li>
              <li>Everyone works the last business day of the sales month</li>
              <li>Regular days off don&apos;t apply during these days</li>
              <li>
                If the month ends on a weekend or holiday, the sales month will
                continue to the first available non-holiday weekday
              </li>
            </ul>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-1">For example:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>
                  If December 31st is a Tuesday but it&apos;s New Year&apos;s
                  Eve (holiday), and January 1st is New Year&apos;s Day
                  (holiday), then Thursday January 2nd becomes our final day of
                  the sales month
                </li>
                <li>
                  If the month ends on a Sunday, the sales month continues to
                  Monday (unless Monday is a holiday, then it would be Tuesday)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-1">Special Days</h3>
            <p className="mb-1 text-sm">Dealership is closed on:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-sm">
              <li>New Year&apos;s Day</li>
              <li>Christmas Day</li>
              <li>Thanksgiving Day</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
