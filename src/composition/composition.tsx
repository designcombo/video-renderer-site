import {
  IDesign,
  ISize,
  IText,
  ITrackItemAndDetails,
} from "@designcombo/types";
import { useCallback, useEffect, useState } from "react";
import { loadFont } from "@remotion/fonts";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IFont } from "../types";
import { groupTrackItems } from "../utils/group-items";
import { SequenceItem } from "./sequence-item";
import { ITrackItem, ITransition } from "@designcombo/types";

import { Transitions } from "./presentations";
import { TransitionSeries } from "../transitions";

export const Composition = ({
  design,
  size,
}: {
  design: IDesign;
  size: ISize;
}) => {
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const fetchData = useCallback(async () => {
    const fonts: IFont[] = [];
    const trackItemsMap = design.trackItemsMap as Record<
      string,
      ITrackItemAndDetails
    >;
    for (const key in trackItemsMap) {
      const trackItem = trackItemsMap[key] as IText;
      if (trackItem.type === "text" || trackItem.type === "caption") {
        fonts.push({
          postScriptName: trackItem.details.fontFamily,
          url: trackItem.details.fontUrl,
        });
      }
    }

    if (fonts.length > 0) {
      const fontPromises = fonts.map((f) =>
        loadFont({
          family: f.postScriptName,
          url: f.url,
        }),
      );
      await Promise.all(fontPromises);
    }

    continueRender(handle);
  }, []);

  const mergedTrackItemsDeatilsMap = design.trackItemsMap;
  const groupedItems = groupTrackItems({
    trackItemIds: design.trackItemIds,
    transitionsMap: design.transitionsMap,
    trackItemsMap: mergedTrackItemsDeatilsMap,
  });
	const mediaItems = Object.values(mergedTrackItemsDeatilsMap).filter(
		(item) => {
			return item.type === "video" || item.type === "audio";
		},
	);

  useEffect(() => {
    fetchData();
  }, []);

	return (
		<>
			{groupedItems.map((group, index) => {
				if (group.length === 1) {
					let active = false;
					const transitionsTemplateMap: Record<string, ITransition> = {};
					const item = mergedTrackItemsDeatilsMap[group[0].id];
					const itemsTemplateMap: Record<string, ITrackItem> = {};
					let itemsTemplateIds: string[] = [];
					if (item.type === "composition") {
						const data = design.structure?.find((s) => s.id === item.id);
						itemsTemplateIds = data?.items || [];
						for (const id in design.trackItemsMap) {
							if (data?.items.includes(id)) {
								itemsTemplateMap[id] = {
									...design.trackItemsMap[id],
								};
							}
						}
					}
					if (item.type === "template") {
						const data = design.structure?.find((s) => s.id === item.id);
						itemsTemplateIds = data?.items || [];
						//if (data?.items.includes(activeIds[0])) active = true;
						for (const id in design.trackItemsMap) {
							if (data?.items.includes(id)) {
								itemsTemplateMap[id] = {
									...design.trackItemsMap[id],
								};
							}
						}
						for (const transition in design.transitionsMap) {
							if (data?.transitions.includes(transition)) {
								transitionsTemplateMap[transition] = design.transitionsMap[transition];
							}
						}
					}

					return SequenceItem[item.type](item, {
						fps,
						active,
						itemsTemplateIds,
						itemsTemplateMap,
						transitionsTemplateMap,
						itemStructure: design.structure?.find((s) => s.id === item.id),
						frame,
						size,
						isTransition: false,
						structure: design.structure,
						mergedTrackItemsDeatilsMap,
						mediaItems,
					});
				}
				const firstItem = mergedTrackItemsDeatilsMap[group[0].id];
				const from = (firstItem.display.from / 1000) * fps;
				return (
					<TransitionSeries key={index} from={from}>
						{group.map((item) => {
							if (item.type === "transition") {
								const durationInFrames = (item.duration / 1000) * fps;
								return Transitions[item.kind]({
									durationInFrames,
									...size,
									id: item.id,
									direction: item.direction,
								});
							}
						
							const transitionsTemplateMap: Record<string, ITransition> = {};
							const itemsTemplateMap: Record<string, ITrackItem> = {};
							let itemsTemplateIds: string[] = [];
							if (item.type === "template") {
								const data = design.structure?.find((s) => s.id === item.id);
								itemsTemplateIds = data?.items || [];
								for (const id in design.trackItemsMap) {
									if (data?.items.includes(id)) {
										itemsTemplateMap[id] = {
											...design.trackItemsMap[id],
										};
									}
								}
								for (const transition in design.transitionsMap) {
									if (data?.transitions.includes(transition)) {
										transitionsTemplateMap[transition] =
											design.transitionsMap[transition];
									}
								}
							}
							return SequenceItem[item.type](
								mergedTrackItemsDeatilsMap[item.id],
								{
									fps,
									isTransition: true,
									itemsTemplateIds,
									itemsTemplateMap,
									transitionsTemplateMap,
									size,
								},
							);
						})}
					</TransitionSeries>
				);
			})}
		</>
	);
};
