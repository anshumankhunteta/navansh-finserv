export default function MileeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto overflow-y-hidden bg-[#001407] p-6">
      {children}
    </div>
  )
}
