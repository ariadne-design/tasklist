export default function TestFlexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex-1 bg-amber-200 ">this is header</header>
      <div className="flex-4 bg-blue-200 flex">
        <div className="grow-0 shrink-0 basis-1/10">1</div>
        <div className="flex-1 bg-green-200">2</div>
        <div className="grow-0 shrink-0 basis-1/4">3</div>
      </div>
      <footer className="flex-1 bg-amber-200 ">this is footer</footer>
    </div>
  );
}
