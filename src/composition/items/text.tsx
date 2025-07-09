import { IText } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles, calculateTextStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";
import MotionText from "../motion-text";

export default function Text({
	item,
	options,
}: {
	item: IText;
	options: SequenceItemOptions;
}) {
	const { handleTextChange, onTextBlur, fps, editableTextId } = options;
	const { id, details, animations } = item as IText;
	const { durationInFrames } = calculateFrames(item.display, fps);
	const { animationIn, animationOut } = getAnimations(animations!, item);
	const textAnimationIn = animations?.in?.name || "";
	const textAnimationOut = animations?.out?.name || "";
	const textAnimationLoop = animations?.loop?.name || "";
	const animationTextInFrames =
		animations?.in?.composition[0].durationInFrames || 0;
	const animationTextOutFrames =
		animations?.out?.composition[0].durationInFrames || 0;
	const animationTextLoopFrames =
		animations?.loop?.composition[0].durationInFrames || 0;
	const animationFonts: { fontFamily: string; url: string }[] = [];
	if (animations?.loop) {
		animations.loop.composition.forEach((composition) => {
			if (composition.details?.fonts) {
				animationFonts.push(...composition.details.fonts);
			}
		});
	}
	if (animations?.in) {
		animations.in.composition.forEach((composition) => {
			if (composition.details?.fonts) {
				animationFonts.push(...composition.details.fonts);
			}
		});
	}
	if (animations?.out) {
		animations.out.composition.forEach((composition) => {
			if (composition.details?.fonts) {
				animationFonts.push(...composition.details.fonts);
			}
		});
	}

	const children = (
		<Animated
			style={calculateContainerStyles(details)}
			animationIn={editableTextId === id ? null : animationIn}
			animationOut={editableTextId === id ? null : animationOut}
			durationInFrames={durationInFrames}
		>
			<MotionText
				key={id}
				id={id}
				fps={fps}
				content={details.text}
				editable={editableTextId === id}
				onChange={handleTextChange}
				textAnimationNameIn={textAnimationIn}
				textAnimationNameOut={textAnimationOut}
				textAnimationNameLoop={textAnimationLoop}
				onBlur={onTextBlur}
				style={calculateTextStyles(details)}
				details={details}
				animationTextInFrames={animationTextInFrames}
				animationTextOutFrames={animationTextOutFrames}
				animationTextLoopFrames={animationTextLoopFrames}
				durationInFrames={durationInFrames}
				animationFonts={animationFonts}
			/>
		</Animated>
	);
	return BaseSequence({ item, options, children });
}
