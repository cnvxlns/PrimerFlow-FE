"use client";

import dynamic from "next/dynamic";

const ResultClientPage = dynamic(() => import("./ResultClientPage"), {
  ssr: false,
});

export default function ResultPage() {
  return <ResultClientPage />;
}
