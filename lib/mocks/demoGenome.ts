import type { GenomeData } from "@/lib/types/Genome";

export const demoGenome: GenomeData = {
    length: 12000,
    tracks: [
        {
            id: "track-1",
            name: "Primer 후보군",
            height: 28,
            features: [
                { id: "f1", start: 400, end: 1200, label: "P-01", color: "#2563eb" },
                { id: "f2", start: 1800, end: 2600, label: "P-02", color: "#0ea5e9" },
                { id: "f3", start: 3200, end: 4300, label: "P-03", color: "#22c55e" },
            ],
        },
        {
            id: "track-2",
            name: "Target 구간",
            height: 18,
            features: [
                { id: "t1", start: 1500, end: 5200, label: "Amplicon", color: "#f97316" },
            ],
        },
    ],
};
