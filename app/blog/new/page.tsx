import { createPost } from '@/app/actions/posts'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/ui/header'
import { ru } from '@/lib/i18n/ru'

export default function NewPostPage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <div className="rounded-2xl glass-card p-6 sm:p-8 fade-in">
            <h1 className="text-3xl font-bold text-sky-900 mb-8">{ru.forms.newPostTitle}</h1>
            <form action={createPost} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-slate-700">
                  {ru.forms.titleLabel}
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full border border-sky-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder={ru.forms.titlePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1 text-slate-700">
                  {ru.forms.contentLabel}
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={8}
                  className="w-full border border-sky-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder={ru.forms.contentPlaceholder}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  className="h-4 w-4 rounded border-sky-200 text-sky-600 focus:ring-sky-200"
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">
                  {ru.forms.publishImmediately}
                </label>
              </div>

              <button
                type="submit"
                className="btn-dynamic text-white px-6 py-2 rounded-lg"
              >
                {ru.forms.create}
              </button>
            </form>
          </div>
        </Container>
      </main>
    </div>
  )
}
