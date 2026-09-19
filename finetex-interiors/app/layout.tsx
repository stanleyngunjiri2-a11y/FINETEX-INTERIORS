import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://finetexinteriors.com"),

  title: {
    default:
      "FINETEX INTERIORS | Interior Design & Renovation in Nairobi",
    template: "%s | FINETEX INTERIORS",
  },

  description:
    "FINETEX INTERIORS provides professional interior design and renovation services in Nairobi and surrounding areas, including kitchens, bathrooms, wardrobes, TV cabinets, gypsum ceilings, and custom interiors.",

  keywords: [
    "FINETEX INTERIORS",
    "interior design Nairobi",
    "interior designers Nairobi",
    "interior renovation Nairobi",
    "home renovation Nairobi",
    "kitchen renovation Nairobi",
    "bathroom renovation Nairobi",
    "wardrobe installation Nairobi",
    "custom wardrobes Nairobi",
    "TV cabinet Nairobi",
    "custom TV cabinets Nairobi",
    "gypsum ceiling Nairobi",
    "custom cabinets Nairobi",
    "interior design Kenya",
    "home renovation Kenya",
    "interior renovation Kenya",
  ],

  authors: [
    {
      name: "FINETEX INTERIORS",
    },
  ],

  creator: "FINETEX INTERIORS",
  publisher: "FINETEX INTERIORS",

  icons: {
    icon: "/images/finetex-logo.png",
    shortcut: "/images/finetex-logo.png",
    apple: "/images/finetex-logo.png",
  },

  openGraph: {
    title:
      "FINETEX INTERIORS | Interior Design & Renovation in Nairobi",

    description:
      "Professional interior design and renovation services in Nairobi, including kitchens, bathrooms, wardrobes, TV cabinets, gypsum ceilings, and custom interiors.",

    type: "website",

    siteName: "FINETEX INTERIORS",

    locale: "en_KE",

    url: "https://finetexinteriors.com",

    images: [
      {
        url: "/images/finetex-logo.png",
        width: 1200,
        height: 630,
        alt:
          "FINETEX INTERIORS - Interior Design and Renovation in Nairobi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "FINETEX INTERIORS | Interior Design & Renovation in Nairobi",

    description:
      "Professional interior design and renovation services by FINETEX INTERIORS in Nairobi and surrounding areas.",

    images: ["/images/finetex-logo.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",

  name: "FINETEX INTERIORS",

  description:
    "Professional interior design and renovation services in Nairobi and surrounding areas.",

  url: "https://finetexinteriors.com",

  telephone: "+254768176570",

  image: "https://finetexinteriors.com/images/finetex-logo.png",

  logo: "https://finetexinteriors.com/images/finetex-logo.png",

  priceRange: "$$",

  areaServed: [
    {
      "@type": "City",
      name: "Nairobi",
    },
    {
      "@type": "AdministrativeArea",
      name: "Kiambu County",
    },
    {
      "@type": "AdministrativeArea",
      name: "Machakos County",
    },
  ],

  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },

  serviceType: [
    "Interior Design",
    "Interior Renovation",
    "Kitchen Renovation",
    "Bathroom Renovation",
    "Gypsum Ceiling Installation",
    "TV Cabinet Installation",
    "Wardrobe Installation",
    "Custom Cabinetry",
  ],

  sameAs: [
    "https://www.instagram.com/finetex_interiors",
    "https://www.tiktok.com/@finetexinteriors",
    "https://www.facebook.com/100087753003652/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}