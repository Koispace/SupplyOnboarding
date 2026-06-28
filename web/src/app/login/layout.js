import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-koi-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-koi-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: 'Sign In | KOI Health',
  description: 'Sign in to your KOI supplier account',
};

export default function LoginLayout({ children }) {
  return (
    <div
      className={`${bricolage.variable} ${hanken.variable} min-h-screen`}
      style={{ 
        fontFamily: "var(--font-koi-body), sans-serif", 
        background: "#F2F6EC",
        "--font-display": "var(--font-koi-heading)"
      }}
    >
      {children}
    </div>
  );
}
