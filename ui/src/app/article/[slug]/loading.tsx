export default function ArticleLoading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-12 animate-pulse">
            <div className="space-y-4">
                <div className="h-4 w-24 bg-stone-200 rounded" />
                <div className="h-16 w-3/4 bg-stone-200 rounded" />
            </div>
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-200" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-stone-200 rounded" />
                    <div className="h-3 w-48 bg-stone-200 rounded" />
                </div>
            </div>
            <div className="aspect-[21/9] bg-stone-200" />
            <div className="space-y-4">
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-5/6 bg-stone-100 rounded" />
            </div>
        </div>
    );
}
