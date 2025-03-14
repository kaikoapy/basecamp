import React from "react";
import { ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

interface PillProps {
  label: string;
  link: string;
  showClipboardIcon?: boolean;
}

const Pill: React.FC<PillProps> = ({
  label,
  link,
  showClipboardIcon = true,
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success(`Copied link to clipboard`);
      },
      (err) => {
        toast.error("Could not copy text");
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="flex items-center space-x-2 ml-4 select-none">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-gray-200 text-gray-700 px-2.5 py-1.5 hover:bg-white rounded-xl text-xs hover:shadow-lg hover:text-gray-800 hover:scale-105 transition-transform duration-300 ease-in-out flex items-center"
      >
        <span className="pr-2">{label}</span>
        <ExternalLink className="h-3 w-3" />
      </a>
      {showClipboardIcon && (
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-900 hover:scale-125 transition-transform duration-300 ease-in-out hover:shadow-lg"
          aria-label={`Copy ${label} link`}
        >
          <Copy className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default Pill;
