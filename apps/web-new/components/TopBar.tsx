import { getActivePromotions } from "@repo/actions";

import TopBarClient from "./TopBarClient";

export default async function TopBar() {
	const promotions = await getActivePromotions();

	if (!promotions || promotions.length === 0) return null;

	// Pass only serializable fields to client component
	const serializable = promotions.map((p) => ({
		id: p.id,
		name: p.name,
		link: p.link,
	}));

	// Use client animation component for one or many items (5s per item)
	return <TopBarClient promotions={serializable} />;
}
