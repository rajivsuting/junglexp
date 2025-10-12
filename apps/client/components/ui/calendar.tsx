"use client";

import * as React from "react";
import {
	DayPicker,
} from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout,
	buttonVariant = "ghost",
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}) {
	// Note: getDefaultClassNames is not available in react-day-picker v9

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				...formatters,
			}}
			classNames={{
				root: "w-fit",
				...classNames,
			}}
			components={{
				...components,
			}}
			{...props}
		/>
	);
}

export { Calendar };
