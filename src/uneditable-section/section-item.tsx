import { EyeIcon } from "@lifesg/react-icons/eye";
import { EyeSlashIcon } from "@lifesg/react-icons/eye-slash";
import {
    UneditableSectionItemMaskState,
    UneditableSectionItemProps,
} from "./types";
import {
    Clickable,
    Container,
    ErrorIcon,
    ErrorLabel,
    IconContainer,
    LoadingLabel,
    Spinner,
    TryAgainLabel,
} from "./section-item.styles";
import { FormLabel } from "../form/form-label";
import { Text } from "../text";
import { StringHelper } from "../util/string-helper";
import { useEffect, useState } from "react";

interface Props extends UneditableSectionItemProps {
    onMask?: (() => void) | undefined;
    onUnmask?: (() => void) | undefined;
    onTryAgain?: (() => void) | undefined;
}

export const UneditableSectionItem = ({
    label,
    value,
    displayWidth = "full",
    maskState,
    maskLoadingState,
    maskChar = "•",
    maskRange,
    unmaskRange,
    maskRegex,
    disableMaskUnmask,
    maskTransformer,
    onMask,
    onUnmask,
    onTryAgain,
}: Props) => {
    // =========================================================================
    // CONST, STATE, REF
    // =========================================================================
    const [displayMaskState, setMaskState] = useState<
        UneditableSectionItemMaskState | undefined
    >(maskState);

    // =========================================================================
    // EFFECTS
    // =========================================================================
    useEffect(() => {
        setMaskState(maskState);
    }, [maskState]);

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleClickableClick = () => {
        if (maskLoadingState === "fail") {
            if (onTryAgain) onTryAgain();
        }

        switch (displayMaskState) {
            case "masked": {
                if (onUnmask) {
                    onUnmask();
                }
                setMaskState("unmasked");
                break;
            }
            case "unmasked": {
                if (onMask) {
                    onMask();
                }
                setMaskState("masked");
                break;
            }
        }
    };

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    const getMaskedValue = () => {
        return StringHelper.maskValue(value, {
            maskChar,
            maskRange,
            unmaskRange,
            maskRegex,
            maskTransformer,
        });
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    const renderMaskingState = () => {
        switch (maskLoadingState) {
            case "fail":
                return (
                    <>
                        <ErrorIcon />
                        <ErrorLabel>Error</ErrorLabel>
                        <TryAgainLabel weight="semibold">
                            Try again?
                        </TryAgainLabel>
                    </>
                );
            case "loading":
                return (
                    <>
                        <Spinner />
                        <LoadingLabel>Retrieving...</LoadingLabel>
                    </>
                );
            default:
                return (
                    <>
                        <Text.Body>
                            {displayMaskState === "masked"
                                ? getMaskedValue()
                                : value}
                        </Text.Body>
                        <IconContainer>
                            {displayMaskState === "masked" ? (
                                <EyeIcon data-testid="masked-icon" />
                            ) : (
                                <EyeSlashIcon data-testid="unmasked-icon" />
                            )}
                        </IconContainer>
                    </>
                );
        }
    };

    const renderContent = () => {
        if (!displayMaskState) {
            return <Text.Body>{value}</Text.Body>;
        }

        if (disableMaskUnmask) {
            return <Text.Body>{getMaskedValue()}</Text.Body>;
        }

        return (
            <Clickable
                data-testid="clickable-label"
                onClick={handleClickableClick}
                aria-busy={maskLoadingState === "loading"}
                aria-live="polite"
            >
                {renderMaskingState()}
            </Clickable>
        );
    };

    return (
        <Container $widthStyle={displayWidth}>
            <FormLabel>{label}</FormLabel>
            {renderContent()}
        </Container>
    );
};
