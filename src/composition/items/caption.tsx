import { ICaption } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { Animated } from "../animated";
import { calculateContainerStyles, calculateTextStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { interpolate } from "remotion";

interface WordSpanProps {
	isActive: boolean;
	activeFillColor: string;
	wordColor: string;
	scale: number;
	animation: string;
	isAppeared: boolean;
}
type Orientation = "horizontal" | "vertical" | "bilateral";

// interface WordEffect {
//   word: string;
//   applyScale: boolean;
// }

// function decideScaleForWord(word: string): WordEffect {
//   const applyScale = Math.random() < 0.5;
//   return { word, applyScale };
// }

const TranslateAnimationCaption = (
	frame: number,
	orientation: Orientation = "bilateral",
) => {
	const phase1Duration = 15;
	const phase2Duration = 15;
	const totalDuration = phase1Duration + phase2Duration;

	const cycleFrame = frame % totalDuration;

	let translateX = 0;
	let translateY = 0;

	if (cycleFrame < phase1Duration) {
		const progress = cycleFrame / phase1Duration;
		if (orientation === "horizontal") {
			translateX = -40 * progress;
		} else if (orientation === "vertical") {
			translateY = -60 * progress;
		} else if (orientation === "bilateral") {
			translateX = -40 * progress;
			translateY = -60 * progress;
		}
	} else {
		const progress = (cycleFrame - phase1Duration) / phase2Duration;
		if (orientation === "horizontal") {
			translateX = -40 + 40 * progress;
		} else if (orientation === "vertical") {
			translateY = -60 + 60 * progress;
		} else if (orientation === "bilateral") {
			translateX = -40 + 40 * progress;
			translateY = -60 + 60 * progress;
		}
	}

	return { translateX, translateY };
};

const TranslateOnceAnimation = (
	frame: number,
	duration: number = 30,
	orientation: Orientation = "horizontal",
) => {
	const clampedFrame = Math.min(frame, duration);
	const progress = clampedFrame / duration;

	let translateX = 0;
	let translateY = 0;

	if (orientation === "horizontal") {
		translateX = 100 * (1 - progress);
	} else if (orientation === "vertical") {
		translateY = 100 * (1 - progress);
	} else if (orientation === "bilateral") {
		translateX = 100 * (1 - progress);
		translateY = 100 * (1 - progress);
	}

	return { translateX, translateY };
};

const scalePulse = keyframes`
  0% {
	transform: scale(1);
  }
  50% {
	transform: scale(1.2);
  }
  100% {
	transform: scale(1);
  }
`;

const ScaleAnimationCaption = (
	frame: number,
	to: number,
	fps: number,
	speedMultiplier: number = 10,
	direction: "min" | "max" = "max",
) => {
	const totalDuration = to / (1000 * speedMultiplier);
	const cycleFrame = Math.min(frame / fps, totalDuration);
	const progress = cycleFrame / totalDuration;
	let scale;
	if (direction === "min") {
		scale = 1 + (1.2 - 1) * (1 - progress);
	} else {
		scale = progress >= 1 ? 1 : progress;
	}
	return scale;
};
const ScalePulseAnimationCaption = (frame: number, to: number, fps: number) => {
	const totalDurationSec = to / 1000;
	const currentTime = frame / fps;
	const progress = Math.min(currentTime / totalDurationSec, 1);

	let scale;

	if (progress <= 0.5) {
		scale = 1 + 0.2 * (progress / 0.5);
	} else {
		scale = 1.2 - 0.2 * ((progress - 0.5) / 0.5);
	}

	return scale;
};

const ScaleAnimationLoop = (
	frame: number,
	phase1Duration: number = 15,
	phase2Duration: number = 15,
) => {
	const totalDuration = phase1Duration + phase2Duration;
	const cycleFrame = frame % totalDuration;

	let scale = 1;

	if (cycleFrame < phase1Duration) {
		const progress = cycleFrame / phase1Duration;
		scale = 1 + 0.2 * progress;
	} else {
		const progress = (cycleFrame - phase1Duration) / phase2Duration;
		scale = 1.2 - 0.2 * progress;
	}

	return scale;
};

const OpacityAnimationCaption = (
	frame: number,
	to: number,
	fps: number,
	speedMultiplier: number = 10,
) => {
	const totalDuration = to / (1000 * speedMultiplier);
	const cycleFrame = Math.min(frame / fps, totalDuration);
	const progress = cycleFrame / totalDuration;
	const opacity = progress >= 1 ? 1 : progress;
	return opacity;
};
const captionRotationCache = new Map<string, number>();
const optionsAnimationLetter = ["letter", "letterUmi", "letterTracy"];
const scaleAnimationLetter = [
	"letterKaraoke",
	"letterPopline",
	"captionAnimation16",
];
const animationCaption = [
	"captionAnimation1",
	"captionAnimation4",
	"captionAnimation18",
	"captionAnimation19",
	"captionAnimation20",
	"captionAnimation21",
	"captionAnimation22",
	"captionAnimation24",
	"captionAnimation27",
	"captionAnimation28",
	"captionAnimation29",
	"captionAnimation30",
	"captionAnimation31",
	"captionAnimationKeyword13",
	"captionAnimationKeyword15",
	"captionAnimationKeyword17",
	"captionAnimationKeyword25",
	"captionAnimationKeyword39",
	"captionAnimationKeyword45",
	"captionAnimationKeyword49",
	"captionAnimationKeyword60",
	"captionAnimationKeyword65",
	"captionAnimationKeyword71",
	"captionAnimationKeyword73",
	"captionAnimationKeyword95",
	"captionAnimationKeyword96",
];
const animationScaleMin = ["captionAnimation17", "captionAnimation8"];

const animationHidden = [
	"captionAnimationKeyword19",
	"captionAnimationKeyword20",
	"captionAnimationKeyword22",
	"captionAnimationKeyword23",
	"captionAnimationKeyword28",
	"captionAnimationKeyword29",
	"captionAnimationKeyword33",
	"captionAnimationKeyword34",
	"captionAnimationKeyword35",
	"captionAnimationKeyword46",
	"captionAnimationKeyword62",
	"captionAnimationKeyword87",
	"captionAnimationKeyword98",
];

const animationScaleDinamic = [
	"captionAnimation32",
	"captionAnimationKeyword12",
	"captionAnimationKeyword14",
	"captionAnimationKeyword21",
];
const captionAnimationKeyword = [
	"captionAnimation32",
	"captionAnimationKeyword2",
	"captionAnimationKeyword3",
	"captionAnimationKeyword4",
	"captionAnimationKeyword5",
	"captionAnimation34",
	"captionAnimation35",
	"captionAnimation36",
	"captionAnimationKeyword6",
	"captionAnimation37",
	"captionAnimation38",
	"captionAnimationKeyword7",
	"captionAnimationKeyword8",
	"captionAnimationKeyword9",
	"captionAnimationKeyword10",
	"captionAnimationKeyword11",
	"captionAnimationKeyword12",
	"captionAnimationKeyword13",
	"captionAnimationKeyword14",
	"captionAnimationKeyword15",
	"captionAnimationKeyword16",
	"captionAnimationKeyword17",
	"captionAnimationKeyword18",
	"captionAnimationKeyword19",
	"captionAnimationKeyword20",
	"captionAnimationKeyword21",
	"captionAnimationKeyword22",
	"captionAnimationKeyword23",
	"captionAnimationKeyword26",
	"captionAnimationKeyword27",
	"captionAnimationKeyword29",
	"captionAnimationKeyword30",
	"captionAnimationKeyword31",
	"captionAnimationKeyword32",
	"captionAnimationKeyword36",
	"captionAnimationKeyword38",
	"captionAnimationKeyword40",
	"captionAnimationKeyword41",
	"captionAnimationKeyword42",
	"captionAnimationKeyword43",
	"captionAnimationKeyword44",
	"captionAnimationKeyword45",
	"captionAnimationKeyword46",
	"captionAnimationKeyword47",
	"captionAnimationKeyword48",
	"captionAnimationKeyword49",
	"captionAnimationKeyword50",
	"captionAnimationKeyword51",
	"captionAnimationKeyword52",
	"captionAnimationKeyword53",
	"captionAnimationKeyword54",
	"captionAnimationKeyword56",
	"captionAnimationKeyword57",
	"captionAnimationKeyword58",
	"captionAnimationKeyword59",
	"captionAnimationKeyword61",
	"captionAnimationKeyword62",
	"captionAnimationKeyword63",
	"captionAnimationKeyword64",
	"captionAnimationKeyword65",
	"captionAnimationKeyword66",
	"captionAnimationKeyword67",
	"captionAnimationKeyword68",
	"captionAnimationKeyword69",
	"captionAnimationKeyword70",
	"captionAnimationKeyword71",
	"captionAnimationKeyword72",
	"captionAnimationKeyword73",
	"captionAnimationKeyword74",
	"captionAnimationKeyword76",
	"captionAnimationKeyword77",
	"captionAnimationKeyword81",
	"captionAnimationKeyword83",
	"captionAnimationKeyword84",
	"captionAnimationKeyword85",
	"captionAnimationKeyword86",
	"captionAnimationKeyword88",
	"captionAnimationKeyword89",
	"captionAnimationKeyword91",
	"captionAnimationKeyword92",
	"captionAnimationKeyword93",
	"captionAnimationKeyword94",
	"captionAnimationKeyword95",
	"captionAnimationKeyword96",
	"captionAnimationKeyword98",
	"captionAnimationKeyword99",
	"captionAnimationKeyword101",
	"captionAnimationKeyword103",
	"captionAnimationKeyword104",
	"captionAnimationKeyword105",
];

const preservedColorAnimation = [
	"captionAnimationKeyword21",
	"captionAnimationKeyword23",
	"captionAnimationKeyword26",
	"captionAnimationKeyword27",
	"captionAnimationKeyword29",
	"captionAnimationKeyword30",
	"captionAnimationKeyword31",
	"captionAnimationKeyword32",
	"captionAnimationKeyword38",
	"captionAnimationKeyword40",
	"captionAnimationKeyword41",
	"captionAnimationKeyword42",
	"captionAnimationKeyword43",
	"captionAnimationKeyword44",
	"captionAnimationKeyword46",
	"captionAnimationKeyword47",
	"captionAnimationKeyword48",
	"captionAnimationKeyword50",
	"captionAnimationKeyword51",
	"captionAnimationKeyword52",
	"captionAnimationKeyword53",
	"captionAnimationKeyword54",
	"captionAnimationKeyword56",
	"captionAnimationKeyword57",
	"captionAnimationKeyword58",
	"captionAnimationKeyword59",
	"captionAnimationKeyword61",
	"captionAnimationKeyword62",
	"captionAnimationKeyword63",
	"captionAnimationKeyword64",
	"captionAnimationKeyword65",
	"captionAnimationKeyword66",
	"captionAnimationKeyword67",
	"captionAnimationKeyword68",
	"captionAnimationKeyword69",
	"captionAnimationKeyword70",
	"captionAnimationKeyword71",
	"captionAnimationKeyword72",
	"captionAnimationKeyword74",
	"captionAnimationKeyword76",
	"captionAnimationKeyword77",
	"captionAnimationKeyword81",
	"captionAnimationKeyword83",
	"captionAnimationKeyword84",
	"captionAnimationKeyword85",
	"captionAnimationKeyword86",
	"captionAnimationKeyword88",
	"captionAnimationKeyword89",
	"captionAnimationKeyword91",
	"captionAnimationKeyword92",
	"captionAnimationKeyword93",
	"captionAnimationKeyword94",
	"captionAnimationKeyword96",
	"captionAnimationKeyword98",
	"captionAnimationKeyword99",
	"captionAnimationKeyword101",
	"captionAnimationKeyword103",
	"captionAnimationKeyword104",
	"captionAnimationKeyword105",
];

const WordSpan = styled.span<WordSpanProps>`
  position: relative;
  display: inline-block;
  padding: 0 0.2em;
  color: ${(props) => props.wordColor};
  scale: ${(props) => props.scale};
  border-radius: 16px;
  z-index: 99;
  transition: opacity 0.2s ease;
  ${(props) => {
		if (props.isActive && props.animation === "letterPopline") {
			return `
	  text-decoration: underline;
	  text-decoration-color: #9238ef;
	  text-decoration-thickness: 0.2em;
	`;
		}

		if (!props.isActive && animationCaption.includes(props.animation)) {
			return `
	  display: none;
	`;
		}

		if (!props.isAppeared && animationHidden.includes(props.animation)) {
			return `
	  display: none;
	`;
		}

		return "";
	}}

  &::before {
	content: "";
	position: absolute;
	z-index: -1;
	border-radius: 0.1em;
	left: -0.2em;
	right: -0.2em;
	top: 0;
	bottom: 0;
	transition: background-color 0.2s ease;
	border-radius: 16px;
  }

  ${(props) =>
		props.isActive &&
		css`
	  &::before {
		background-color: ${props.activeFillColor};

		${
					props.animation === "captionAnimation10" ||
					props.animation === "captionAnimationKeyword42" ||
					props.animation === "captionAnimationKeyword57" ||
					(props.animation === "captionAnimationKeyword48" &&
						css`
			animation: ${scalePulse} 0.4s ease-in-out;
			transform-origin: center;
		  `)
				}
	  }
	`}
`;

const CaptionWord = ({
	word,
	offsetFrom,
	activeColor,
	activeFillColor,
	appearedColor,
	color,
	animation,
	currentFrame,
	globalOpacity,
	isKeywordColor,
}: {
	word: any;
	offsetFrom: number;
	activeColor: string;
	activeFillColor: string;
	appearedColor: string;
	color: string;
	animation: string;
	currentFrame: number;
	globalOpacity?: number;
	isKeywordColor: string;
}) => {
	const { start, end } = word;
	const startAtFrame = ((start + offsetFrom) / 1000) * 30;
	const endAtFrame = ((end + offsetFrom) / 1000) * 30;
	const isActive = currentFrame > startAtFrame && currentFrame < endAtFrame;
	const isAppeared = currentFrame > startAtFrame;
	let wordColor = isActive ? activeColor : isAppeared ? appearedColor : color;

	if (
		captionAnimationKeyword.includes(animation) &&
		word.is_keyword &&
		isKeywordColor !== "transparent" &&
		isActive
	) {
		wordColor = isKeywordColor;
	}

	if (
		preservedColorAnimation.includes(animation) &&
		word.is_keyword &&
		isKeywordColor !== "transparent" &&
		isAppeared
	) {
		wordColor = isKeywordColor;
	}

	if (
		animation === "captionAnimationKeyword1" &&
		word.is_keyword &&
		isKeywordColor !== "transparent"
	) {
		wordColor = isKeywordColor;
	}

	const totalLetters = word.word.length;
	const animationDuration = endAtFrame - startAtFrame;
	const lettersToShow = Math.min(
		totalLetters,
		Math.floor(
			((currentFrame - startAtFrame) / animationDuration) * totalLetters,
		),
	);
	let opacity = 1;
	let scale = 1;
	let translateX = 0;
	let translateY = 0;
	if (scaleAnimationLetter.includes(animation)) {
		scale = isActive ? 1.4 : 0.9;
	}
	if (animationScaleMin.includes(animation)) {
		scale = 0.8;
	}
	if (animation == "captionAnimation26") {
		opacity = isActive ? 1 : 0.6;
	}
	if (animationScaleDinamic.includes(animation)) {
		scale = word.is_keyword ? 1.4 : 0.9;
	}

	switch (animation) {
		case "captionAnimation5":
			if (isActive) {
				opacity = interpolate(
					currentFrame,
					[startAtFrame, endAtFrame],
					[0.7, 1],
					{
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					},
				);
			}
			break;

		case "captionAnimation7":
		case "captionAnimation24":
		case "captionAnimation13":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation14":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [0.8, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation22":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [0.8, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation23":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [1.2, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});

			translateX = interpolate(
				currentFrame,
				[startAtFrame, endAtFrame],
				[0, 10],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				},
			);

			translateY = interpolate(
				currentFrame,
				[startAtFrame, endAtFrame],
				[0, 10],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: (t) => t * t,
				},
			);
			break;

		case "captionAnimation11":
			opacity = globalOpacity || 0;
			break;
		case "captionAnimation18":
			opacity = interpolate(
				currentFrame,
				[startAtFrame, endAtFrame],
				[0.5, 1],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				},
			);
			break;

		case "captionAnimation27":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [1.4, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;

		case "captionAnimationKeyword24": {
			const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;

			if (currentFrame <= midFrame) {
				scale = interpolate(currentFrame, [startAtFrame, midFrame], [1, 1.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			} else {
				scale = interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			}
			break;
		}

		case "captionAnimationKeyword30": {
			const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;

			if (currentFrame <= midFrame) {
				scale = interpolate(currentFrame, [startAtFrame, midFrame], [1, 1.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			} else {
				scale = interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			}
			break;
		}
		case "captionAnimationKeyword34": {
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;

			if (currentFrame <= midFrame) {
				scale = interpolate(currentFrame, [startAtFrame, midFrame], [1, 1.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			} else {
				scale = interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			}
			break;
		}

		case "captionAnimationKeyword38":
		case "captionAnimationKeyword95": {
			const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;

			if (currentFrame <= midFrame) {
				opacity = interpolate(currentFrame, [startAtFrame, midFrame], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				scale = interpolate(currentFrame, [startAtFrame, midFrame], [1, 1.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			} else {
				scale = interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			}
			break;
		}
		case "letteeTracy":
		case "captionAnimation15":
		case "captionAnimation20":
		case "captionAnimation30":
		case "captionAnimation33":
		case "captionAnimation62":
		case "captionAnimationKeyword8":
		case "captionAnimationKeyword10":
		case "captionAnimationKeyword17":
		case "captionAnimationKeyword37":
		case "captionAnimationKeyword41":
		case "captionAnimationKeyword44":
		case "captionAnimationKeyword76":
		case "captionAnimationKeyword79":
		case "captionAnimationKeyword82":
		case "captionAnimationKeyword86":
		case "captionAnimationKeyword93":
		case "captionAnimationKeyword94":
		case "captionAnimationKeyword97":
		case "captionAnimationKeyword99":
		case "captionAnimationKeyword106":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;

		case "captionAnimationKeyword77":
		case "captionAnimationKeyword85":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			translateX = interpolate(
				currentFrame,
				[startAtFrame, endAtFrame],
				[30, 0],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				},
			);

			break;

		case "captionAnimationKeyword89": {
			const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;

			if (currentFrame <= midFrame) {
				opacity = interpolate(currentFrame, [startAtFrame, midFrame], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				scale = interpolate(currentFrame, [startAtFrame, midFrame], [0, 1.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			} else {
				scale = interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
			}
			break;
		}
		case "captionAnimation14":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [1.2, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
	}

	const displayText: string = optionsAnimationLetter.includes(animation)
		? word.word.slice(0, lettersToShow)
		: word.word;

	return (
		<WordSpan
			isActive={isActive}
			wordColor={wordColor}
			activeFillColor={activeFillColor}
			scale={scale}
			animation={animation}
			style={{
				opacity,
				transform: `translate(${translateX}px, ${translateY}px)`,
			}}
			isAppeared={isAppeared}
		>
			{displayText}
		</WordSpan>
	);
};

export default function Caption({
	item,
	options,
}: {
	item: ICaption;
	options: SequenceItemOptions;
}) {
	const { fps, frame } = options;
	const { details, display, animations } = item as ICaption;
	const { animationIn, animationOut } = getAnimations(animations!, item);
	const { from, durationInFrames } = calculateFrames(item.display, fps);
	const [firstWord] = details.words;
	const offsetFrom = display.from - firstWord.start;
	const rotationOptions = [-10, 0, 10];
	const rotationOptions2 = [-10, 10];

	let relativeFrame = Math.max((frame ?? 0) - from, 0);
	let transformValues: {
		translateX?: number;
		translateY?: number;
		scale?: number;
		opacity?: number;
		rotate?: number;
	} = {};

	switch (details?.animation) {
		case "letterElla":
			transformValues = TranslateAnimationCaption(relativeFrame, "bilateral");
			break;
		case "letterHormozi":
			transformValues.scale = ScaleAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
			);
			break;
		case "letterBeasty":
			transformValues.scale = ScaleAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				50,
			);
			break;
		case "captionAnimation12":
			transformValues.scale = ScaleAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				50,
			);
			break;
		case "captionAnimation2":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
			);
			break;
		case "captionAnimation9":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
			);
			break;
		case "captionAnimation6":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;
		case "captionAnimation25":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			transformValues.scale = ScaleAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				50,
				"min",
			);
			break;

		case "captionAnimation4":
			transformValues = TranslateAnimationCaption(relativeFrame, "horizontal");
			break;
		case "captionAnimation28":
			transformValues = TranslateAnimationCaption(relativeFrame, "vertical");
			break;

		case "captionAnimation34":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;
		case "captionAnimation35":
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;

		case "captionAnimation36":
			transformValues = TranslateAnimationCaption(relativeFrame, "vertical");
			break;

		case "captionAnimation37": {
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimationKeyword2":
		case "captionAnimationKeyword64":
		case "captionAnimationKeyword66":
		case "captionAnimationKeyword68":
		case "captionAnimationKeyword70":
		case "captionAnimationKeyword73":
		case "captionAnimationKeyword78":
		case "captionAnimationKeyword85": {
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimation38":
		case "captionAnimationKeyword90":
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			const translation = TranslateAnimationCaption(relativeFrame, "bilateral");
			transformValues = {
				...transformValues,
				...translation,
			};
			break;
		case "captionAnimationKeyword11": {
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimationKeyword6":
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;

		case "captionAnimationKeyword7": {
			transformValues.scale = ScaleAnimationLoop(relativeFrame);

			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions2[Math.floor(Math.random() * rotationOptions2.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimationKeyword14": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			transformValues.scale = ScalePulseAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
			);
			break;
		}
		case "captionAnimationKeyword15": {
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			break;
		}

		case "captionAnimationKeyword16": {
			transformValues.rotate = 10;
			const translation = TranslateAnimationCaption(relativeFrame, "vertical");
			transformValues = {
				...transformValues,
				...translation,
			};
			break;
		}

		case "captionAnimationKeyword18": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;
		}
		case "captionAnimationKeyword21": {
			transformValues = TranslateAnimationCaption(relativeFrame, "vertical");
			break;
		}
		case "captionAnimationKeyword22": {
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			break;
		}
		case "captionAnimationKeyword26": {
			transformValues.rotate = 10;
			break;
		}
		case "captionAnimationKeyword27": {
			transformValues = TranslateAnimationCaption(relativeFrame, "vertical");
			break;
		}
		case "captionAnimationKeyword29": {
			transformValues = TranslateAnimationCaption(relativeFrame, "vertical");
			break;
		}

		case "captionAnimationKeyword32": {
			transformValues.scale = ScaleAnimationLoop(relativeFrame);

			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions2[Math.floor(Math.random() * rotationOptions2.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimationKeyword43":
		case "captionAnimationKeyword47": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			Object.assign(transformValues, TranslateOnceAnimation(relativeFrame, 5));
			break;
		}

		case "captionAnimationKeyword51":
		case "captionAnimationKeyword53":
		case "captionAnimationKeyword57": {
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions2[Math.floor(Math.random() * rotationOptions2.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			break;
		}

		case "captionAnimationKeyword55": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;
		}
		case "captionAnimationKeyword56": {
			transformValues = TranslateOnceAnimation(relativeFrame, 10, "vertical");
			break;
		}

		case "captionAnimationKeyword58": {
			transformValues = TranslateOnceAnimation(relativeFrame, 10);
			break;
		}

		case "captionAnimationKeyword69":
		case "captionAnimationKeyword75": {
			const captionId = item.id;
			if (!captionRotationCache.has(captionId)) {
				const randomRotation =
					rotationOptions[Math.floor(Math.random() * rotationOptions.length)];
				captionRotationCache.set(captionId, randomRotation);
			}

			transformValues.rotate = captionRotationCache.get(captionId)!;
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			break;
		}

		case "captionAnimationKeyword71": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			transformValues.scale = ScaleAnimationLoop(relativeFrame);
			break;
		}

		case "captionAnimationKeyword81":
		case "captionAnimationKeyword88":
		case "captionAnimationKeyword102": {
			transformValues.opacity = OpacityAnimationCaption(
				relativeFrame,
				item.display.to,
				fps,
				2,
			);
			break;
		}
	}

	const globalOpacity =
		details?.animation === "captionAnimation11"
			? OpacityAnimationCaption(relativeFrame, item.display.to, fps, 5)
			: undefined;

	const transformParts: string[] = [];

	if (
		transformValues.translateX !== undefined ||
		transformValues.translateY !== undefined
	) {
		const x = transformValues.translateX ?? 0;
		const y = transformValues.translateY ?? 0;
		transformParts.push(`translate(${x}px, ${y}px)`);
	}

	if (transformValues.scale !== undefined) {
		transformParts.push(`scale(${transformValues.scale})`);
	}

	if (transformValues.rotate !== undefined) {
		transformParts.push(`rotate(${transformValues.rotate}deg)`);
	}

	const transformStyles = {
		...(transformParts.length > 0 && { transform: transformParts.join(" ") }),
		...(transformValues.opacity !== undefined && {
			opacity: transformValues.opacity,
		}),
	};

	const extraStyles: React.CSSProperties = {};

	if (
		details?.animation === "captionAnimation3" ||
		details?.animation === "captionAnimation33"
	) {
		Object.assign(extraStyles, {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
		});
	}

	const children = (
		<Animated
			style={calculateContainerStyles(details)}
			animationIn={animationIn}
			animationOut={animationOut}
			durationInFrames={durationInFrames}
		>
			<div
				style={{
					...calculateTextStyles(details),
					...transformStyles,
					...extraStyles,
					transition: "transform 0.2s ease",
					borderRadius: "16px",
					display: relativeFrame > 0 ? "block" : "none",
					maxWidth: "max-content",
				}}
				className="p-4"
			>
				{item.details.words.map((word: any, index: number) => (
					<CaptionWord
						key={index}
						color={details.color}
						appearedColor={details.appearedColor || details.color}
						activeColor={details.activeColor || details.color}
						activeFillColor={details.activeFillColor || "transparent"}
						isKeywordColor={details?.isKeywordColor || "transparent"}
						offsetFrom={offsetFrom}
						animation={details.animation || ""}
						globalOpacity={globalOpacity}
						word={word}
						currentFrame={frame ?? 0}
					/>
				))}
			</div>
		</Animated>
	);

	return BaseSequence({ item, options, children });
}