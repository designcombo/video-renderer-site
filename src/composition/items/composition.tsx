import { IComposition } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { cloneDeep } from "lodash";
import { groupTrackItems } from "../../utils/group-items";
import { SequenceItem } from "../sequence-item";

export default function Composition({
	item,
	options,
}: {
	item: IComposition;
	options: SequenceItemOptions;
}) {
	const {
		editableTextId,
		itemsTemplateIds,
		itemsTemplateMap,
		fps,
		onTextBlur,
		handleTextChange,
		itemStructure,
	} = options;
	const clonedItemsMap = cloneDeep(itemsTemplateMap!);
	const groupedItems = groupTrackItems({
		trackItemIds: cloneDeep(itemsTemplateIds!),
		transitionsMap: {},
		trackItemsMap: clonedItemsMap,
	});
	itemsTemplateIds?.forEach((id) => {
		const item = clonedItemsMap![id];
		item.display.from = item.display.from;
		item.display.to = item.display.to;
	});
	const data = groupedItems.map((group, index) => {
		if (group.length === 1) {
			const item = clonedItemsMap[group[0].id];

			let zIndex = index;
			if (itemStructure) {
				const { tracks } = itemStructure;
				zIndex =
					tracks.length -
					tracks.findIndex((track) => track.items.includes(item.id));
			}

			return SequenceItem[item.type](item, {
				fps,
				handleTextChange,
				onTextBlur,
				editableTextId,
				zIndex,
			});
		}
	});

	const children = data && data.map((item) => item);

	return BaseSequence({ item, options, children });
}
