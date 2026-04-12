import ConvexClientProvider from "./ConvexClientProvider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
