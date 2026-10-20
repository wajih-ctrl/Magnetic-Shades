"use client";

import { useEffect, useState } from "react";
import { Download, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { artworkStore } from "@/lib/artwork-storage";

export function ArtworkAsset({
  artworkKey,
  filename,
  compact = false,
}: {
  artworkKey?: string;
  filename: string;
  compact?: boolean;
}) {
  const [source, setSource] = useState("");
  useEffect(() => {
    let active = true;
    if (!artworkKey) {
      setSource("");
      return;
    }
    artworkStore(artworkKey)
      .then((value) => active && setSource(value))
      .catch(() => active && setSource(""));
    return () => {
      active = false;
    };
  }, [artworkKey]);

  const isPdf = filename.toLowerCase().endsWith(".pdf");
  return (
    <div className="overflow-hidden rounded-xl border bg-[#f4f5f5]">
      <div
        className={`grid place-items-center bg-white ${compact ? "min-h-36" : "min-h-64"}`}
      >
        {source && !isPdf ? (
          <img
            src={source}
            alt={`Uploaded artwork: ${filename}`}
            className={`${compact ? "max-h-44" : "max-h-80"} w-full object-contain p-3`}
          />
        ) : source && isPdf ? (
          <object
            data={source}
            type="application/pdf"
            aria-label={`Uploaded PDF artwork: ${filename}`}
            className={`${compact ? "h-44" : "h-80"} w-full`}
          >
            <span>PDF preview available by download.</span>
          </object>
        ) : (
          <div className="p-6 text-center text-sm text-[#626a73]">
            <FileImage className="mx-auto mb-3 size-8 text-[#d96b36]" />
            {artworkKey
              ? "Loading the exact uploaded file…"
              : "No uploaded file is linked to this record."}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t p-3">
        <span className="min-w-0 truncate text-sm font-semibold">
          {filename}
        </span>
        {source && (
          <Button size="sm" variant="outline" asChild>
            <a href={source} download={filename}>
              <Download className="size-4" /> Download
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
