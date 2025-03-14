import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Copy, Info } from "lucide-react";
import { toast } from "sonner";

interface APlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  pills: { label: string; link: string }[];
}

const APlanModal: React.FC<APlanModalProps> = ({ isOpen, onClose, pills }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>A-Plan & Affinity Links</DialogTitle>
        </DialogHeader>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="mr-2 h-4 w-4" />
          If applicable, get proof of household affiliation.
        </div>

        <div className="my-6 space-y-2">
          {pills.map((pill, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg py-2 px-4 hover:bg-gray-100"
            >
              <a
                href={pill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 flex items-center group"
              >
                {pill.label}
                <ExternalLink className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pill.link);
                  toast.success("Link copied to clipboard");
                }}
                className="ml-2 text-gray-500 text-sm hover:text-gray-900 flex items-center"
              >
                Copy Link
                <Copy className="ml-2 h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APlanModal;
