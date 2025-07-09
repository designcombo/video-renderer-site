import { IImage } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles, calculateMediaStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";
import { Img } from "remotion";

export default function Image({
	item,
	options,
}: {
	item: IImage;
	options: SequenceItemOptions;
}) {
	const { fps } = options;
	const { details, animations } = item;
	const { animationIn, animationOut } = getAnimations(animations!, item);
	const crop = details?.crop || {
		x: 0,
		y: 0,
		width: details.width,
		height: details.height,
	};
	const { durationInFrames } = calculateFrames(item.display, fps);

	const children = (
		<Animated
			style={calculateContainerStyles(details, crop, {
				transform: "scale(1)",
			})}
			animationIn={animationIn!}
			animationOut={animationOut!}
			durationInFrames={durationInFrames}
		>
			<div style={calculateMediaStyles(details, crop)}>
				{/* image layer */}
				<Img data-id={item.id} src={details.src} />
			</div>
		</Animated>
	);

	return BaseSequence({ item, options, children });
}
