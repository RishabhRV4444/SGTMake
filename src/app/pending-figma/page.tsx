import LinkButton from "@/components/shared/link-button";

export default function ProvideFigma() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center">
      <h1 className="animate-bounce text-6xl font-bold tracking-widest">Sorry</h1>
      <h2 className="text-gry-900 text-2xl font-medium tracking-widest">
        You have not provide any design for this page
      </h2>
      <p className="my-3 text-sm text-muted-foreground">
        The page you tried to access does not exist.
      </p>
      <LinkButton href="/" className="rounded-full">
        Go to home
      </LinkButton>
    </div>
  );
}
