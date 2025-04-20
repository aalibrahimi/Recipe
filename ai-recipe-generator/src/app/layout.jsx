
import "./globals.css";



export const metadata = {
  title: "AI Recipe Generator",
  description: "Generate recipes based on ingredients you have",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
