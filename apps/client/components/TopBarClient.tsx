"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Promotion = {
	id: number;
	name: string;
	link: string;
};

const IN_DURATION_MS = 500;
const OUT_DURATION_MS = 500;
const VISIBLE_DURATION_MS = 4000; // 0.5s in + 4s visible + 0.5s out = 5s total

export default function TopBarClient({
	promotions,
}: {
	promotions: Promotion[];
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [phase, setPhase] = useState<"in" | "steady" | "out">("in");
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		if (!promotions || promotions.length === 0) return;

		let cancelled = false;

		function runCycle(nextIndex: number) {
			if (cancelled) return;
			setCurrentIndex(nextIndex);
			setPhase("in");

			// After in
			timerRef.current = window.setTimeout(() => {
				if (cancelled) return;
				setPhase("steady");

				// Visible phase
				timerRef.current = window.setTimeout(() => {
					if (cancelled) return;
					setPhase("out");

					// After out, move to next item
					timerRef.current = window.setTimeout(() => {
						if (cancelled) return;
						const newIndex = (nextIndex + 1) % promotions.length;
						runCycle(newIndex);
					}, OUT_DURATION_MS);
				}, VISIBLE_DURATION_MS);
			}, IN_DURATION_MS);
		}

		runCycle(currentIndex);

		return () => {
			cancelled = true;
			if (timerRef.current) window.clearTimeout(timerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [promotions?.length]);

	const promotion = promotions?.[currentIndex];
	if (!promotion) return null;

	return (
		<div className="relative z-[60] bg-[#8B9467]">
			<div className="h-[2.5rem] sm:h-[3rem] overflow-hidden relative">
				<div
					key={`${currentIndex}-${phase}`}
					className={
						phase === "in"
							? "animate-topbar-in"
							: phase === "out"
								? "animate-topbar-out"
								: ""
					}
					style={{ willChange: "transform" }}
				>
					<div className="h-[2.5rem] sm:h-[3rem] flex items-center justify-center text-white text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-bold translate-y-0 opacity-100 px-4">
						<Link
							href={promotion.link}
							target="_blank"
							rel="noopener noreferrer"
							className="text-center font-sans hover:text-gray-200 transition-colors break-words max-w-full"
						>
							* {promotion.name.toUpperCase()} *
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
