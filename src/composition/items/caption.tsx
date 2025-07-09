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
}
type Orientation = "horizontal" | "vertical" | "bilateral";

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
	console.log({ opacity });
	return opacity;
};

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
];
const animationScaleMin = ["captionAnimation17", "captionAnimation8"];

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
					props.animation === "captionAnimation10" &&
					css`
          animation: ${scalePulse} 0.4s ease-in-out;
          transform-origin: center;
        `
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
}) => {
	const { start, end } = word;
	const startAtFrame = ((start + offsetFrom) / 1000) * 30;
	const endAtFrame = ((end + offsetFrom) / 1000) * 30;
	const isActive = currentFrame > startAtFrame && currentFrame < endAtFrame;
	const isAppeared = currentFrame > startAtFrame;
	const wordColor = isActive ? activeColor : isAppeared ? appearedColor : color;

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
	switch (animation) {
		case "letteeTracy":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;

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
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation24":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
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
		case "captionAnimation15":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
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
		case "captionAnimation20":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation27":
			scale = interpolate(currentFrame, [startAtFrame, endAtFrame], [1.4, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			break;
		case "captionAnimation30":
			opacity = interpolate(currentFrame, [startAtFrame, endAtFrame], [0, 1], {
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
	let relativeFrame = Math.max((frame ?? 0) - from, 0);
	let transformValues: {
		translateX?: number;
		translateY?: number;
		scale?: number;
		opacity?: number;
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
	}

	const globalOpacity =
		details?.animation === "captionAnimation11"
			? OpacityAnimationCaption(relativeFrame, item.display.to, fps, 5)
			: undefined;

	const transformStyles = {
		...(transformValues.translateX !== undefined &&
			transformValues.translateY !== undefined && {
				transform: `translate(${transformValues.translateX}px, ${transformValues.translateY}px)`,
			}),
		...(transformValues.scale !== undefined && {
			transform: `scale(${transformValues.scale})`,
		}),
		...(transformValues.opacity !== undefined && {
			opacity: transformValues.opacity,
		}),
	};
	const extraStyles: React.CSSProperties = {};

	if (details?.animation === "captionAnimation3") {
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
				}}
			>
				{item.details.words.map((word: any, index: number) => (
					<CaptionWord
						key={index}
						color={details.color}
						appearedColor={details.appearedColor || details.color}
						activeColor={details.activeColor || details.color}
						activeFillColor={details.activeFillColor || "transparent"}
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
