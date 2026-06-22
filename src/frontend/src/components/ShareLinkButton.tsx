import { Button } from "@/components/ui/button";
import { copyTextToClipboard } from "@/lib/clipboard";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareLinkButtonProps {
  url: string;
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

export function ShareLinkButton({
  url,
  label = "Copy link",
  className,
  "data-ocid": dataOcid,
}: ShareLinkButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={className ?? "h-7 gap-1.5 text-xs"}
      onClick={async (event) => {
        event.stopPropagation();
        const copied = await copyTextToClipboard(url);
        if (copied) {
          toast.success("Link copied to clipboard");
        } else {
          toast.error("Could not copy link");
        }
      }}
      data-ocid={dataOcid}
    >
      <Share2 className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
