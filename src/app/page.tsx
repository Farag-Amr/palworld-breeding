import { PaldexList } from "@/components/PaldexList";
import { dataMeta, pals } from "@/lib/pals";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between px-6 py-4">
          <p className="text-sm font-medium tracking-wide text-sky-300">
            Palworld Breeding
          </p>
          <p className="text-xs text-zinc-500">Unofficial fan project</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
        <section className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300/80">
            In progress
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Palworld breeding calculator
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Pick two parents to see the child, or click a Pal to see which
            pairs make it. Runs in your browser. No account.
          </p>
          <p className="text-sm text-zinc-500">
            Loaded {dataMeta.palCount} pals and {dataMeta.uniqueComboCount} unique
            recipes (Palworld {dataMeta.gameVersion}).
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-sm font-semibold text-sky-200">
              Two-parent calculator
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Choose two Pals. You get the child they would produce.
            </p>
            <p className="mt-4 text-xs text-zinc-500">Coming next</p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-sm font-semibold text-sky-200">
              Paldex parent list
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Numbered list of Pals. Click one to see every parent pair that
              makes that child.
            </p>
            <p className="mt-4 text-xs text-zinc-500">Coming next</p>
          </article>
        </section>

        <PaldexList pals={pals} />
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
