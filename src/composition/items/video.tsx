import { IVideo } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles, calculateMediaStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";
import { OffthreadVideo } from "remotion";

export const Video = ({
	item,
	options,
}: {
	item: IVideo;
	options: SequenceItemOptions;
}) => {
	const { fps } = options;
	const { details, animations } = item;
	const playbackRate = item.playbackRate || 1;
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
				overflow: "hidden",
			})}
			animationIn={animationIn}
			animationOut={animationOut}
			durationInFrames={durationInFrames}
		>
			<div style={calculateMediaStyles(details, crop)}>
				<OffthreadVideo
					startFrom={(item.trim?.from! / 1000) * fps}
					endAt={(item.trim?.to! / 1000) * fps || 1 / fps}
					playbackRate={playbackRate}
					src={details.src}
					volume={details.volume || 0 / 100}
				/>
			</div>
		</Animated>
	);

	return BaseSequence({ item, options, children });
};

export default Video;
