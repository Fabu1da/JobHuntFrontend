import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
} from "lucide-react";
import { useCvContext } from "../hooks/useCv";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export const CvList = () => {
  const { cvs, loading, error } = useCvContext();
  const [selectedCvId, setSelectedCvId] = useState("");
  const selectedCv = cvs.find((cv) => cv.id === selectedCvId);

  return (
    <section className="w-full max-w-xl rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 shadow-lg shadow-black/10 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c6af7]/10 text-[#a59cfb]">
              <FileText size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#e8e8f0]">
                Your CV profile
              </h2>
              <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#6b6b80]">
                Choose a source for matching
              </p>
            </div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#4fd1c5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1c5] shadow-[0_0_8px_#4fd1c5]" />
          {loading ? "Syncing" : `${cvs.length} saved`}
        </span>
      </div>

      <Combobox
        items={cvs}
        value={selectedCvId}
        onValueChange={(value) => setSelectedCvId(value ?? "")}
      >
        <ComboboxInput
          placeholder={loading ? "Loading your CVs..." : "Search saved CVs..."}
          disabled={loading || cvs.length === 0}
          showClear
          className="border-[#2a2a38] bg-[#0f0f15] text-[#e8e8f0] [&_[data-slot=input-group-input]]:placeholder:text-[#6b6b80] [&_[data-slot=input-group-button]]:text-[#6b6b80]"
        />
        <ComboboxContent className="border border-[#2a2a38] bg-[#1c1c26] text-[#e8e8f0]">
          <ComboboxEmpty>No saved CV matches that search.</ComboboxEmpty>
          <ComboboxList>
            {cvs.map((cv) => (
              <ComboboxItem
                key={cv.id}
                value={cv.id}
                className="text-[#e8e8f0] data-highlighted:bg-[#7c6af7]/15 data-highlighted:text-white"
              >
                <FileText size={15} className="text-[#a59cfb]" />
                <span className="truncate">{cv.originalFileName}</span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {error ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#f87171]/20 bg-[#f87171]/[0.08] px-3 py-2 text-xs text-[#f87171]">
          <UploadCloud size={15} />
          Could not load your saved CVs.
        </div>
      ) : selectedCv ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#4fd1c5]/20 bg-[#4fd1c5]/[0.06] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-[#4fd1c5]" />
            <span className="truncate text-xs text-[#b9bbc9]">
              {selectedCv.originalFileName}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#4fd1c5]">
            Selected
          </span>
        </div>
      ) : loading ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#6b6b80]">
          <LoaderCircle size={14} className="animate-spin text-[#7c6af7]" />
          Checking your saved profiles...
        </div>
      ) : cvs.length === 0 ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#6b6b80]">
          <UploadCloud size={14} className="text-[#7c6af7]" />
          Upload a CV to unlock personalized matching.
        </div>
      ) : null}
    </section>
  );
};
