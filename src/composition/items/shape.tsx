import { IShape } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";

export const Shape = ({
	item,
	options,
}: {
	item: IShape;
	options: SequenceItemOptions;
}) => {
	const { fps } = options;
	const { details, animations } = item;
	const { animationIn, animationOut } = getAnimations(animations!, item);
	const { durationInFrames } = calculateFrames(item.display, fps);
	const children = (
		<Animated
			style={calculateContainerStyles(details)}
			animationIn={animationIn}
			animationOut={animationOut}
			durationInFrames={durationInFrames}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					WebkitMaskImage: `url(${details.src})`,
					WebkitMaskSize: "cover",
					WebkitMaskPosition: "center",
					WebkitMaskRepeat: "no-repeat",
					backgroundColor: details.backgroundColor || "#808080",
				}}
			/>
		</Animated>
	);
	return BaseSequence({ item, options, children });
};

export default Shape;
