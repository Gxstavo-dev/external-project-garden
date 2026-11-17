import { createFileRoute } from "@tanstack/react-router";

import { MewflowLanding } from "@/components/landing/MewflowLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mewflow – the CRM for artists" },
      {
        name: "description",
        content:
          "Mewflow keeps your commission quotes, client messages, price list and payments in one calm studio inbox. Make the art, we’ll handle the paperwork.",
      },
      { property: "og:title", content: "Mewflow – the CRM for artists" },
      {
        property: "og:description",
        content: "One inbox for Instagram, Discord and email. Quote from any message, keep every client in its place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MewflowLanding,
});
