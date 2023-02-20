import React, { useEffect, useRef, useState } from "react";
import { AddonProps, LabelAddon, ListAddon } from "../input-group/types";
import { InputGroup } from "../input-group/input-group";
import { PhoneNumberInputHelper } from "./phone-number-input-helper";
import { Wrapper } from "./phone-number-input.styles";
import {
    CountryValue,
    PhoneNumberInputProps,
    PhoneNumberInputValue,
} from "./types";

export const PhoneNumberInput = ({
    onChange,
    value,
    allowClear,
    onClear,
    error,
    fixedCountry = false,
    optionPlaceholder = "Select",
    optionSearchPlaceholder,
    enableSearch,
    onHideOptions,
    onShowOptions,
    placeholder,
    ...otherProps
}: PhoneNumberInputProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const [inputNumber, setInputNumber] = useState(value?.number || "");
    const [selectedCountryCode, setSelectedCountryCode] = useState(
        value?.countryCode || ""
    );

    const selectedOption: CountryValue =
        PhoneNumberInputHelper.getCountries.filter(
            (country: CountryValue) =>
                country.countryCode === selectedCountryCode.replace("+", "")
        )[0];

    const nodeRef = useRef();

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        const formattedNumber = getFormattedNumber(value?.number);
        setInputNumber(formattedNumber);
    }, [value]);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleKeyDown = (event: React.KeyboardEvent) => {
        const re = /^[0-9\b]+$/;
        if (!re.test(event.key) && event.key !== "Backspace") {
            event.preventDefault();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value;
        if (onChange) {
            const returnValue = getReturnValue(currentValue);
            onChange(returnValue);
        } else {
            const formattedNumber = getFormattedNumber(currentValue);
            setInputNumber(formattedNumber);
        }
    };

    const handleSelectOption = (
        country: CountryValue,
        extractedValue: string
    ) => {
        setSelectedCountryCode(extractedValue);
        if (onChange) {
            const returnValue = getReturnValue(inputNumber, extractedValue);
            onChange(returnValue);
        } else {
            if (inputNumber && typeof inputNumber === "string") {
                const formattedNumber = getFormattedNumber(
                    inputNumber,
                    country
                );
                setInputNumber(formattedNumber);
            }
        }
    };

    const handleOnClear = () => {
        if (onClear) onClear();
    };

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    const getFormattedNumber = (
        number: string,
        country: CountryValue = selectedOption
    ): string => {
        const numberWithoutSpace = number?.replace(/[\s()]+/g, "");
        const formattedNumber = PhoneNumberInputHelper.formatNumber(
            numberWithoutSpace,
            country
        );
        return formattedNumber;
    };

    const getReturnValue = (
        number: string = inputNumber,
        countryCode: string = selectedCountryCode
    ): PhoneNumberInputValue => {
        const numberWithoutSpace = number?.replace(/[\s()]+/g, "");
        return {
            number: numberWithoutSpace,
            countryCode: countryCode.includes("+")
                ? countryCode
                : `+${countryCode}`,
        };
    };

    const getAddonProps = (): AddonProps<CountryValue, string> => {
        if (fixedCountry) {
            return {
                type: "label",
                attributes: {
                    value: selectedCountryCode,
                } as LabelAddon,
            };
        } else {
            return {
                type: "list",
                attributes: {
                    value: selectedOption,
                    placeholder: optionPlaceholder,
                    options: PhoneNumberInputHelper.getCountries,
                    selectedOption: selectedOption,
                    enableSearch: enableSearch,
                    searchPlaceholder: optionSearchPlaceholder,
                    valueExtractor: (option) => `+${option.countryCode}`,
                    listExtractor: (option) => ({
                        title: option.name,
                        secondaryLabel: `+${option.countryCode}`,
                    }),
                    onSelectOption: handleSelectOption,
                    onHideOptions: onHideOptions,
                    onShowOptions: onShowOptions,
                } as ListAddon<CountryValue, string>,
            };
        }
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    return (
        <Wrapper>
            <InputGroup
                ref={nodeRef}
                onKeyDown={handleKeyDown}
                value={inputNumber}
                onChange={handleInputChange}
                allowClear={allowClear && !!inputNumber}
                onClear={handleOnClear}
                error={error}
                placeholder={placeholder}
                addon={getAddonProps()}
                {...otherProps}
            />
        </Wrapper>
    );
};
