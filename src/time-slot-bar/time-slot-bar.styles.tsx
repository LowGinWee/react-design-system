import { ChevronLeftIcon } from "@lifesg/react-icons/chevron-left";
import { ChevronRightIcon } from "@lifesg/react-icons/chevron-right";
import styled, { css } from "styled-components";
import { Color } from "../color";
import { ClickableIcon } from "../shared/clickable-icon";
import { Text } from "../text";
import { Direction, SlotStyle, TimeSlotBarVariant } from "./types";

const MAX_LINE_HEIGHT = 1.25; // NOTE in rem

// =============================================================================
// STYLING HELPERS
// =============================================================================

// Function to get the width of a cell in px
export const getCellWidth = (variant: TimeSlotBarVariant) => {
    if (variant === "minified") {
        return 12;
    } else {
        return 40;
    }
};

// Function to get the height of a cell in px
export const getCellHeight = (variant: TimeSlotBarVariant) => {
    if (variant === "minified") {
        return 12;
    } else {
        return 40;
    }
};

// =============================================================================
// STYLE INTERFACE, transient props are denoted with $
// See more https://styled-components.com/docs/api#transient-props
// =============================================================================

interface ArrowStyleProps {
    $direction?: Direction;
    $variant: TimeSlotBarVariant;
}

interface TimeSlotStyleProps {
    $type?: "default" | "vertical";
    $variant: TimeSlotBarVariant;
    $width?: number;
    $left?: number;
    $styleType: SlotStyle;
    $bgColor: string;
    $bgColor2?: string;
    $clickable?: boolean;
}

interface CellTextStyleProps {
    $slotWidth: number;
    $color?: string;
}

interface TimeMarkerStyleProps {
    $isLongMarker: boolean;
    $variant: TimeSlotBarVariant;
}

// =============================================================================
// STYLING
// =============================================================================
export const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const ArrowButton = styled(ClickableIcon)<ArrowStyleProps>`
    z-index: 2;
    position: absolute;
    bottom: ${({ $variant }) => ($variant === "default" ? "0.25rem" : "0rem")};
    background-color: ${Color.Neutral[8]};
    box-shadow: 0px 2px 8px rgba(104, 104, 104, 0.5);
    border-radius: 50%;
    padding: 0.5rem;
    width: 2rem;
    height: 2rem;

    ${(props) =>
        props.$direction === "right"
            ? css`
                  right: 0;
              `
            : css`
                  left: 0;
              `}

    > div {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &:focus {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
`;

export const ArrowIconRight = styled(ChevronRightIcon)`
    width: 1rem;
    height: 1rem;
    color: ${Color.Primary};
`;

export const ArrowIconLeft = styled(ChevronLeftIcon)`
    font-size: 1rem;
    color: ${Color.Primary};
`;

export const TimeSlotBarContainer = styled.div<{
    $variant: TimeSlotBarVariant;
}>`
    overflow: hidden;
    flex-grow: 1;
    position: relative;
    height: ${({ $variant }) =>
        `${MAX_LINE_HEIGHT * 16 + getCellHeight($variant)}px`};
`;

export const TimeMarkerWrapper = styled.div`
    position: relative;
    white-space: nowrap;
    height: ${MAX_LINE_HEIGHT}rem;
`;

export const TimeSlotWrapper = styled.div`
    display: flex;
    white-space: nowrap;
`;

export const TimeMarker = styled.div<TimeMarkerStyleProps>`
    display: inline-block;
    width: ${({ $variant }) => `${getCellWidth($variant)}px`};
    position: relative;
    border-left: 1px solid ${Color.Neutral[2]};
    ${(props) => {
        let markerHeight = 0;

        switch (props.$variant) {
            case "default":
                markerHeight = props.$isLongMarker ? MAX_LINE_HEIGHT : 0.625;
                break;
            case "minified":
                markerHeight = props.$isLongMarker ? MAX_LINE_HEIGHT : 0;
                break;
            default:
                markerHeight = 0;
                break;
        }

        return css`
            height: ${markerHeight}rem;
        `;
    }}
`;

export const TimeLabel = styled(Text.XSmall)`
    color: ${Color.Neutral[2]};
    position: absolute;
    bottom: 10%;
    left: 10%;
`;

export const TimeSlot = styled.div<TimeSlotStyleProps>`
    ${(props) => {
        if (props.$type === "vertical") {
            return css`
                display: flex;
                flex-grow: 1;
                align-items: center;
                justify-content: center;
                width: 100%;
                margin: 1px 0px;
            `;
        } else {
            return css`
                position: absolute;
                height: ${getCellHeight(props.$variant)}px;
                width: ${props.$width}px;
                left: ${props.$left}px;
            `;
        }
    }}
    background-color: ${({ $bgColor }) => $bgColor};
    cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

    ${(props) =>
        props.$styleType === "stripes" &&
        css`
            background: repeating-linear-gradient(
                135deg,
                ${props.$bgColor2 || Color.Neutral[5]} 0px,
                ${props.$bgColor2 || Color.Neutral[5]} 10px,
                ${props.$bgColor} 10px,
                ${props.$bgColor} 20px
            );
        `}
`;

export const Border = styled.div<{ $variant: TimeSlotBarVariant }>`
    position: absolute;
    top: ${MAX_LINE_HEIGHT}rem;
    height: ${({ $variant }) => `${getCellHeight($variant)}px`};
    z-index: 1;
    border-right: 1px solid ${Color.Neutral[2]};
`;

export const CellText = styled(Text.XSmall)<CellTextStyleProps>`
    color: ${(props) => props.$color || Color.Neutral[2](props)};
    position: absolute;
    bottom: 0;
    padding-left: 4px;
    padding-bottom: 4px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
