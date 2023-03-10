import React, { useEffect, useRef, useState } from "react";
import { OtpInputProps } from "./types";
import {
    CTAButton,
    InputContainer,
    InputField,
    Wrapper,
} from "./otp-input.styles";

import { FormErrorMessage } from "src/form/form-label";

export const OtpInput = ({
    id,
    "data-testid": dataTestId,
    className,
    cooldownDuration,
    actionButtonProps,
    errorMessage,
    numOfInput,
    onChange,
    onCooldownStart,
    onCooldownEnd,
    ...otherProps
}: OtpInputProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const {
        disabled,
        onClick,
        styleType = "secondary",
        ...otherCtaProps
    } = actionButtonProps ?? {};
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const onChangeRef = useRef(onChange);

    const [otpValues, setOtpValues] = useState<string[]>(
        new Array(numOfInput).fill("")
    );
    const [countDown, setCountDown] = useState<number>(cooldownDuration);
    const [lastCtaTimestamp, setLastCtaTimestamp] = useState<Date | undefined>(
        new Date()
    );

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        inputRefs?.current[0]?.focus();
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, []);

    useEffect(() => {
        if (cooldownDuration !== 0) {
            if (onCooldownStart) onCooldownStart();
            const cleanup = beginCountdown();

            return () => cleanup();
        }
    }, [lastCtaTimestamp]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================

    const handleChange =
        (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value.replace(/[^0-9]/g, "");
            if (validateUserInput(value)) {
                const newOtpValues = [...otpValues];

                newOtpValues[index] = value.substring(value.length - 1);
                inputRefs.current[index + 1]?.focus();

                setOtpValues(newOtpValues);

                if (onChange) {
                    onChange(newOtpValues.join(""));
                }
            }
        };

    const handleKeyDown =
        (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
            const { key, code } = event;

            if (key === "Backspace" || code === "Backspace") {
                const newOtpValues = [...otpValues];
                if (newOtpValues[index] !== "") {
                    newOtpValues[index] = "";
                } else {
                    newOtpValues[index - 1] = "";
                    inputRefs.current[index - 1]?.focus();
                }

                setOtpValues(newOtpValues);

                if (onChange) {
                    onChange(newOtpValues.join(""));
                }
            }
        };

    const handlePaste = (event: ClipboardEvent): void => {
        const pastedValue = event.clipboardData.getData("text");
        if (pastedValue && validateUserInput(pastedValue, numOfInput)) {
            setOtpValues(pastedValue.split(""));
            if (onChangeRef.current) {
                onChangeRef.current(pastedValue);
            }
        } else {
            event.preventDefault();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOtpValues(new Array(numOfInput).fill(""));

        if (!isWithinCooldown()) {
            setLastCtaTimestamp(new Date());
            setCountDown(cooldownDuration);
        }

        if (onClick) {
            onClick(event);
        }
    };

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    const validateUserInput = (value: string, length = 1) =>
        !value ? false : RegExp(`^[0-9]{${length}}$`).test(value);

    const isWithinCooldown = (): boolean => {
        const currentTime = Date.now();
        const coolDownInMilliseconds = cooldownDuration * 1000;

        return (
            currentTime < lastCtaTimestamp.valueOf() + coolDownInMilliseconds
        );
    };

    const beginCountdown = () => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            const coolDownInMilliseconds = cooldownDuration * 1000;

            const timer = Math.ceil(
                (lastCtaTimestamp.valueOf() +
                    coolDownInMilliseconds -
                    currentTime) /
                    1000
            );
            setCountDown(timer);
            if (timer <= 0) {
                if (onCooldownEnd) onCooldownEnd();
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    };

    const generateId = (index: number, name: string, prefix?: string) => {
        return prefix
            ? `${prefix}-${name}-${index + 1}`
            : `${name}-${index + 1}`;
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const renderCTALabel = () => {
        return otherCtaProps.children
            ? otherCtaProps.children
            : `Resend OTP${
                  countDown
                      ? ` in ${countDown} second${countDown > 1 ? "s" : ""}`
                      : ""
              }`;
    };

    return (
        <Wrapper id={id} data-testid={dataTestId} className={className}>
            <InputContainer>
                {otpValues.map((data, index) => {
                    return (
                        <InputField
                            id={generateId(index, "otp-input", id)}
                            data-testid={generateId(
                                index,
                                "otp-input",
                                dataTestId
                            )}
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            value={data}
                            error={!!errorMessage}
                            onChange={handleChange(index)}
                            onKeyDown={handleKeyDown(index)}
                            {...otherProps}
                        />
                    );
                })}
            </InputContainer>
            {errorMessage && (
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
            <CTAButton
                styleType={styleType}
                {...otherCtaProps}
                onClick={handleClick}
                disabled={disabled || isWithinCooldown()}
            >
                {renderCTALabel()}
            </CTAButton>
        </Wrapper>
    );
};
