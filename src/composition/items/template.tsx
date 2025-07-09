import { ITrackItem, ITemplate, ITransition } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { cloneDeep } from "lodash";
import { groupTrackItems } from "../../utils/group-items";
import { SequenceItem } from "../sequence-item";
import { TransitionSeries } from "../../transitions";
import { Transitions } from "../presentations";

export default function Template({
	item,
	options,
}: {
	item: ITemplate;
	options: SequenceItemOptions;
}) {
	const {
		editableTextId,
		onTextBlur,
		handleTextChange,
		itemsTemplateIds,
		transitionsTemplateMap,
		itemsTemplateMap,
		size,
		fps,
		structure,
		frame,
		mergedTrackItemsDeatilsMap,
	} = options;
	const clonedItemsMap = cloneDeep(itemsTemplateMap!);
	const { trim } = item as ITemplate;
	const groupedItems = groupTrackItems({
		trackItemIds: cloneDeep(itemsTemplateIds!) || [],
		transitionsMap: cloneDeep(transitionsTemplateMap!) || {},
		trackItemsMap: clonedItemsMap || {},
	});
	const trimFrom = trim?.from || 0;

	itemsTemplateIds?.forEach((id) => {
		const item = clonedItemsMap![id];
		item.display.from = item.display.from - trimFrom;
		item.display.to = item.display.to - trimFrom;
	});

	const data = groupedItems.map((group, index) => {
		if (group.length === 1) {
			const item = clonedItemsMap![group[0].id];
			let transitionsTemplateMap: Record<string, ITransition> = {};
			let itemsTemplateMap: Record<string, ITrackItem> = {};
			let itemsTemplateIds: string[] = [];
			if (item.type === "template") {
				const data = structure?.find((s) => s.id === item.id);

				itemsTemplateIds = data?.items || [];
				for (const id in mergedTrackItemsDeatilsMap) {
					if (data?.items.includes(id)) {
						itemsTemplateMap[id] = {
							...mergedTrackItemsDeatilsMap[id],
						};
					}
				}
				for (const transition in transitionsTemplateMap) {
					if (data?.transitions.includes(transition)) {
						transitionsTemplateMap[transition] =
							transitionsTemplateMap[transition];
					}
				}
				return SequenceItem[item.type](item, {
					fps,
					handleTextChange,
					onTextBlur,
					editableTextId,
					itemsTemplateIds,
					itemsTemplateMap,
					transitionsTemplateMap,
					itemStructure: structure?.find((s) => s.id == item.id),
					frame,
					size,
					isTransition: false,
					structure,
					mergedTrackItemsDeatilsMap,
				});
			}
			let active = false;
			return SequenceItem[item.type](item, {
				fps: options.fps,
				editableTextId,
				active,
				itemsTemplateIds,
				itemsTemplateMap: clonedItemsMap,
				transitionsTemplateMap,
				isTransition: false,
			});
		}
		const firstTrackItem = clonedItemsMap![group[0].id];
		const from = (firstTrackItem.display.from / 1000) * options.fps;
		return (
			<TransitionSeries from={from} key={index}>
				{group.map((item) => {
					if (item.type === "transition") {
						const durationInFrames = (item.duration / 1000) * fps;
						return Transitions[item.kind]({
							durationInFrames,
							id: item.id,
							direction: item.direction,
							width: size!.width,
							height: size!.height,
						});
					}

					return SequenceItem[item.type](item as ITrackItem, {
						fps,
						handleTextChange,
						editableTextId,
						isTransition: true,
					});
				})}
			</TransitionSeries>
		);
	});

	return BaseSequence({ children: data, item, options });
}
