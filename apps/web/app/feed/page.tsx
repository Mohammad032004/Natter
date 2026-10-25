import { Newspaper } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50">
      <div className="max-w-sm px-6 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <Newspaper className="h-7 w-7 text-blue-600" />
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Natter Feed
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your community feed is coming later. For now, let's focus
          on making messaging work perfectly.
        </p>
      </div>
    </div>
  );
}