import type { Metadata } from "next";
import Home from "./_home/Home";
import { SITE_NAME, SITE_DESCRIPTION } from "./site-config";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <Home />;
}
