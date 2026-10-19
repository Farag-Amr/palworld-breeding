export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between px-6 py-4">
          <p className="text-sm font-medium tracking-wide text-amber-300">
            Palworld Breeding
          </p>
          <p className="text-xs text-zinc-500">Unofficial fan project</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
        <section className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300/80">
            In progress
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Breed with a plan, not a spreadsheet.
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Pick two parents and see the child. Open any Pal and see every pair
            that produces it. Calculations run in your browser from static Pal
            data — no account, no database.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-sm font-semibold text-amber-200">
              Two-parent calculator
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Choose Pal A and Pal B. The site applies unique recipes first,
              then the breeding-power midpoint formula.
            </p>
            <p className="mt-4 text-xs text-zinc-500">Coming next</p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-sm font-semibold text-amber-200">
              Paldex parent list
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A numbered list of Pals. Click one to expand every parent
              combination that hatches that child.
            </p>
            <p className="mt-4 text-xs text-zinc-500">Coming next</p>
          </article>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <p className="mx-auto max-w-3xl px-6 py-6 text-xs leading-5 text-zinc-500">
          Palworld is a trademark of Pocketpair, Inc. This site is unofficial
          and not endorsed by Pocketpair.
        </p>
      </footer>
    </div>
  );
}
