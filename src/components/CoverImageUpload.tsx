"use client";

import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

export default function CoverImageUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Cover image
      </label>
      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt="Cover"
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
          <div className="mt-2 flex gap-2">
            <UploadButton
              endpoint="coverImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) onChange(res[0].url);
              }}
              onUploadError={(err) => console.error(err)}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <UploadButton
          endpoint="coverImage"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) onChange(res[0].url);
          }}
          onUploadError={(err) => console.error(err)}
        />
      )}
    </div>
  );
}
