import Link from "next/link";

export default function NotFound() {
  return (
    <div className="garden-shell flex min-h-screen items-center justify-center px-4 py-16">
      <div className="paper-panel w-full max-w-4xl rounded-[2.5rem] px-6 py-10 text-center md:px-10 md:py-14">
        <p className="eyebrow justify-center">Verdwaald pad</p>
        <div className="mt-6 text-7xl text-botanical-gold md:text-8xl">404</div>
        <h1 className="mt-4 font-display text-4xl text-botanical-forest md:text-6xl">
          Deze tuinroute bestaat niet.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-botanical-ink/80">
          Je bent van het botanische pad geraakt. De pagina die je zoekt is
          niet gevonden, maar de rest van de tuin blijft wel gewoon open.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary text-center">
            Terug naar home
          </Link>
          <Link href="/plants" className="btn-outline text-center">
            Open de collectie
          </Link>
        </div>
      </div>
    </div>
  );
}

