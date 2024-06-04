import { ChevronDownIcon } from "@lifesg/react-icons/chevron-down";
import { ChevronUpIcon } from "@lifesg/react-icons/chevron-up";
import { useEffect, useRef, useState } from "react";
import { ToggleIcon, ToggleIconType } from "../shared/toggle-icon/toggle-icon";
import { TextList } from "../text-list";
import { SimpleIdGenerator } from "../util";
import {
    AlertContainer,
    Children,
    ChildrenContainer,
    Container,
    ErrorListContainer,
    ErrorListItem,
    ErrorListli,
    HeaderContainer,
    IndicatorLabelContainer,
    Input,
    Label,
    RemoveButton,
    SubLabel,
    TextContainer,
    ViewMoreOrLessButtonContainer,
    ViewMoreOrLessButtonLabel,
} from "./toggle.styles";
import { ToggleProps } from "./types";

export const Toggle = ({
    type = "checkbox",
    indicator,
    checked,
    styleType = "default",
    children,
    childrenMaxLines,
    subLabel,
    disabled,
    error,
    name,
    id,
    className,
    compositeSection,
    removable,
    onRemove,
    "data-testid": testId,
    onChange,
}: ToggleProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const {
        collapsible = true,
        errors,
        children: compositeOptionSection,
        show: showCompositeOptionSection,
    } = compositeSection || {};
    const [selected, setSelected] = useState<boolean | undefined>(checked);
    const [showMore, setShowMore] = useState<boolean>(
        !!showCompositeOptionSection
    );

    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [uniqueId] = useState(SimpleIdGenerator.generate());
    const generatedId = id ? `${id}` : `tg-${uniqueId}`;

    const inputRef = useRef<HTMLInputElement>();

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        setSelected(checked);
    }, [checked]);

    useEffect(() => {
        if (
            selected !== undefined &&
            showCompositeOptionSection === undefined
        ) {
            setShowMore(selected);
        }
    }, [selected, showCompositeOptionSection]);

    useEffect(() => {
        if (errors) {
            const showErrorIfString =
                !showMore && Array.isArray(errors) && errors?.length > 0;
            const showErrorIfElement = !showMore && !Array.isArray(errors);
            if (!selected) {
                setShowErrors(!selected);
            } else {
                setShowErrors(showErrorIfString || showErrorIfElement);
            }
        }
    }, [showMore, errors, selected]);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        if (!disabled) {
            if (onChange) {
                onChange(event);
                return;
            }
            switch (type) {
                case "checkbox":
                    setSelected((prevSelected) => {
                        return !prevSelected;
                    });
                    break;
                case "radio":
                case "yes":
                case "no":
                    {
                        if (!selected) {
                            setSelected(true);
                        }
                    }
                    break;
            }
        }
    };

    const handleExpandCollapseClick = () => {
        if (!disabled) {
            setShowMore(!showMore);
        }
    };
    const handleOnRemove = () => {
        if (!disabled) {
            if (onRemove) {
                onRemove();
                return;
            }
        }
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const renderIndicator = () => {
        let toggleIconType: ToggleIconType;

        switch (type) {
            case "yes":
                toggleIconType = "tick";
                break;
            case "no":
                toggleIconType = "cross";
                break;
            case "checkbox":
            case "radio":
                toggleIconType = type;
                break;
        }

        return (
            <ToggleIcon
                type={toggleIconType}
                active={selected}
                disabled={disabled}
            />
        );
    };
    const renderSubLabel = () => {
        if (!subLabel) {
            return null;
        }

        let component: string | JSX.Element;

        if (typeof subLabel === "function") {
            component = subLabel();
        } else {
            component = subLabel;
        }

        return (
            <SubLabel
                data-id="toggle-sublabel"
                $disabled={disabled}
                $selected={selected}
            >
                {component}
            </SubLabel>
        );
    };

    const renderCompositeOptionSection = () => {
        return (
            <Children
                $selected={showMore}
                $isFinalItem={!collapsible}
                $disabled={disabled}
            >
                {compositeOptionSection}
            </Children>
        );
    };

    const renderViewMoreOrLessButton = () => {
        const showLessWithoutErrors = !showMore && !showErrors;
        return (
            <ViewMoreOrLessButtonContainer
                $paddingTopRequired={showLessWithoutErrors}
                $show={!collapsible ? false : selected}
                $disabled={disabled}
                onClick={handleExpandCollapseClick}
                data-testid="toggle-button"
            >
                <ViewMoreOrLessButtonLabel
                    weight="semibold"
                    $disabled={disabled}
                    data-testid="toggle-button-label"
                >
                    {showMore ? "Show less" : "Show more"}
                </ViewMoreOrLessButtonLabel>
                {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </ViewMoreOrLessButtonContainer>
        );
    };

    const renderToggleWithRemoveButton = () => {
        return (
            <HeaderContainer
                id={`${generatedId}-header-container`}
                $disabled={disabled}
                $error={error}
                $selected={selected}
                $indicator={indicator}
                $styleType={styleType}
            >
                <IndicatorLabelContainer $addPadding={removable}>
                    <Input
                        ref={inputRef}
                        name={name}
                        id={`${generatedId}-input`}
                        type={type === "checkbox" ? "checkbox" : "radio"}
                        data-testid="toggle-input"
                        disabled={disabled}
                        onChange={handleOnChange}
                        checked={selected}
                    />
                    {indicator && renderIndicator()}
                    <TextContainer>
                        <Label
                            htmlFor={`${generatedId}-input`}
                            $selected={selected}
                            $indicator={indicator}
                            $disabled={disabled}
                            data-testid={`${generatedId}-toggle-label`}
                            $maxLines={childrenMaxLines}
                        >
                            {children}
                        </Label>
                        {subLabel && renderSubLabel()}
                    </TextContainer>
                </IndicatorLabelContainer>

                {removable && (
                    <RemoveButton
                        type="button"
                        $disabled={disabled}
                        onClick={handleOnRemove}
                        id={`${generatedId}-remove-button`}
                    >
                        Remove
                    </RemoveButton>
                )}
            </HeaderContainer>
        );
    };

    const renderErrorList = (errors: string[]) => {
        return (
            <>
                <ErrorListItem weight="semibold" $disabled={disabled}>
                    Error
                </ErrorListItem>
                <TextList.Ul>
                    {errors?.map((item, index) => {
                        return (
                            <ErrorListli
                                $disabled={disabled}
                                key={index}
                                id={`list-item-${index}`}
                            >
                                <ErrorListItem
                                    weight="semibold"
                                    $disabled={disabled}
                                >
                                    {item}
                                </ErrorListItem>
                            </ErrorListli>
                        );
                    })}
                </TextList.Ul>
            </>
        );
    };

    const renderError = () => {
        return (
            !showMore &&
            showErrors && (
                <ErrorListContainer
                    $show={!collapsible ? false : selected}
                    $disabled={disabled}
                    onClick={handleExpandCollapseClick}
                    id={`${generatedId}-error-alert`}
                >
                    <AlertContainer
                        type={disabled ? "description" : "error"}
                        className={className}
                        showIcon
                    >
                        {Array.isArray(errors)
                            ? renderErrorList(errors)
                            : errors}
                    </AlertContainer>
                </ErrorListContainer>
            )
        );
    };

    const renderCompositeSection = () => {
        return (
            compositeOptionSection && (
                <ChildrenContainer>
                    {renderCompositeOptionSection()}
                    {renderError()}
                    {renderViewMoreOrLessButton()}
                </ChildrenContainer>
            )
        );
    };

    return (
        <Container
            $selected={selected}
            $disabled={disabled}
            className={className}
            $styleType={styleType}
            $error={error}
            $indicator={indicator}
            id={id}
            data-testid={testId}
        >
            {renderToggleWithRemoveButton()}
            {renderCompositeSection()}
        </Container>
    );
};
