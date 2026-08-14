import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogUserIdentifier } from "@/components/PostHogUserIdentifier";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "biasly News",
  description: "Balanced news coverage, powered by AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider dynamic>
          <PostHogUserIdentifier />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
