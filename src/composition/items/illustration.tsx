import { IIllustration } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";

export const Illustration = ({
	item,
	options,
}: {
	item: IIllustration;
	options: SequenceItemOptions;
}) => {
	const { fps } = options;
	const { details, animations } = item;
	const { animationIn, animationOut } = getAnimations(animations!, item);
	const { durationInFrames } = calculateFrames(item.display, fps);
	const children = (
		<Animated
			style={calculateContainerStyles(details)}
			animationIn={animationIn!}
			animationOut={animationOut!}
			durationInFrames={durationInFrames}
		>
			<div dangerouslySetInnerHTML={{ __html: item.details.svgString }} />
		</Animated>
	);
	return BaseSequence({ item, options, children });
};
export default Illustration;
