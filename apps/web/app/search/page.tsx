import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50">
      <div className="max-w-sm px-6 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
          <Search className="h-7 w-7 text-violet-600" />
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Search Natter
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search for people, conversations, and messages. Global search
          will be implemented next.
        </p>
      </div>
    </div>
  );
}