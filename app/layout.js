export const metadata = {
  title: 'ProjectHub',
  description: 'My Project Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
