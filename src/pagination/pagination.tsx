import { Chevron2LeftIcon } from "@lifesg/react-icons/chevron-2-left";
import { Chevron2RightIcon } from "@lifesg/react-icons/chevron-2-right";
import { ChevronLeftIcon } from "@lifesg/react-icons/chevron-left";
import { ChevronLineLeftIcon } from "@lifesg/react-icons/chevron-line-left";
import { ChevronLineRightIcon } from "@lifesg/react-icons/chevron-line-right";
import { ChevronRightIcon } from "@lifesg/react-icons/chevron-right";
import { EllipsisHorizontalIcon } from "@lifesg/react-icons/ellipsis-horizontal";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "styled-components";
import { InputSelect } from "../input-select";
import { Breakpoint } from "../theme";
import {
    EllipsisButton,
    EllipsisContainer,
    Hover,
    InputSelectWrapper,
    InputView,
    Label,
    LabelDivider,
    NavigationButton,
    PageItem,
    PaginationList,
    PaginationMenu,
    PaginationMobileInput,
    PaginationWrapper,
} from "./pagination.styles";
import { PageSizeItemProps, PaginationProps } from "./types";

const Component = (
    {
        id,
        "data-testid": dataTestId,
        className,
        pageSize = 10,
        totalItems,
        activePage,
        pageSizeOptions = DEFAULT_OPTIONS,
        showFirstAndLastNav,
        showPageSizeChanger = false,
        onPageChange,
        onPageSizeChange,
    }: PaginationProps,
    ref: React.Ref<HTMLDivElement>
) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================

    const theme = useTheme();
    const mobileBreakpoint = Breakpoint["sm-max"]({ theme });

    const isMobile = useMediaQuery({
        maxWidth: mobileBreakpoint,
    });
    const [hoverRightButton, setHoverRightButton] = useState(false);
    const [hoverLeftButton, setHoverLeftButton] = useState(false);
    const [inputText, setInputText] = useState<string>("");

    const [selectedOption, setSelectedOption] = useState<
        PageSizeItemProps | undefined
    >(pageSizeOptions[0]);
    const [pageSizeLocal, setPageSize] = useState<number>(
        !isMobile && showPageSizeChanger
            ? selectedOption
                ? selectedOption.value
                : pageSize
            : pageSize
    );

    const boundaryRange = 1;
    const siblingRange = 1;

    const totalPages = Math.ceil(totalItems / pageSizeLocal);
    const isFirstPage = activePage === 1;
    const isLastPage = activePage === totalPages;

    const firstPaginationItem =
        activePage > 1 ? () => handlePaginationItemClick(1) : undefined;
    const lastPaginationItem =
        activePage < totalPages
            ? () => handlePaginationItemClick(totalPages)
            : undefined;
    const prevPaginationItem =
        activePage > 1
            ? () => handlePaginationItemClick(activePage - 1)
            : undefined;
    const nextPaginationItem =
        activePage < totalPages
            ? () =>
                  handlePaginationItemClick(parseInt(activePage.toString()) + 1)
            : undefined;

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        if (activePage) {
            setInputValue(activePage);
        }
    }, [activePage]);

    useEffect(() => {
        setPageSize(pageSize);
        setSelectedOption(
            pageSizeOptions.find((option) => option.value === pageSize)
        );
    }, [pageSize]);

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    const setInputValue = (value: number) => {
        setInputText(value.toString());
    };

    const closeAllTooltips = () => {
        setHoverRightButton(false);
        setHoverLeftButton(false);
    };

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handlePaginationItemClick = (pageIndex: number) => {
        if (onPageChange) {
            onPageChange(pageIndex);
            setInputValue(pageIndex);
        }
    };

    const handleFastForwardClick = () => {
        const currentIndex = Math.min(totalPages, activePage + 5);
        handlePaginationItemClick(currentIndex);
        setInputValue(currentIndex);
        setHoverRightButton(true);
        setHoverLeftButton(false);
    };

    const handleFastBackwardClick = () => {
        const currentIndex = Math.max(1, activePage - 5);
        handlePaginationItemClick(currentIndex);
        setInputValue(currentIndex);
        setHoverRightButton(false);
        setHoverLeftButton(true);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const numericRegex = /^[0-9]+$/;
        if (value === undefined || value.length === 0) {
            setInputText("");
        } else if (!numericRegex.test(value)) {
            setInputText(value.replace(/[^0-9]/g, ""));
        } else {
            const newPage = parseInt(value.replace(/[^0-9]/g, ""));
            setInputValue(Math.max(1, Math.min(totalPages, newPage)));
        }
    };

    const handleInputSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputText) {
            onPageChange?.(parseInt(inputText));
        }
    };

    const onHoverRightButton = () => {
        setHoverRightButton(true);
    };

    const onBlurRightButton = () => {
        setHoverRightButton(false);
    };

    const onHoverLeftButton = () => {
        setHoverLeftButton(true);
    };

    const onBlurLeftButton = () => {
        setHoverLeftButton(false);
    };

    const handleListItemClick = (item: PageSizeItemProps) => {
        setSelectedOption(item);
        const pagesize = item.value;
        const totalPage = Math.ceil(totalItems / pagesize);

        setPageSize(pagesize);

        const page = activePage >= totalPage ? totalPage : activePage;

        if (onPageSizeChange) {
            onPageSizeChange(page, pagesize);
        }
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const renderPaginationItems = () => {
        return [...Array(totalPages)].map((e, i) => {
            const pageIndex = i + 1;
            const startRange = boundaryRange + 2 + siblingRange * 2;
            const endRange = totalPages - startRange;
            const totalRange = (boundaryRange + siblingRange) * 2 + 3;
            const active = activePage === pageIndex;
            if (totalPages <= totalRange) {
                return (
                    <PageItem
                        key={pageIndex}
                        onClick={() => handlePaginationItemClick(pageIndex)}
                        $selected={active}
                        aria-label={"Page " + pageIndex}
                        aria-current={active ? "page" : false}
                        onMouseOver={closeAllTooltips}
                        onFocus={closeAllTooltips}
                    >
                        {pageIndex}
                    </PageItem>
                );
            }

            const ellipsisStart =
                activePage + siblingRange > startRange &&
                pageIndex === boundaryRange + 1;
            if (ellipsisStart) {
                return renderStartEllipsis(pageIndex);
            }

            const ellipsisEnd =
                activePage - siblingRange <= endRange &&
                pageIndex === totalPages - boundaryRange - 1;
            if (ellipsisEnd) {
                return renderEndEllipsis(pageIndex);
            }

            const paginationStart =
                (pageIndex <= startRange &&
                    activePage + siblingRange <= startRange) ||
                pageIndex <= boundaryRange;
            const paginationMiddle =
                pageIndex === activePage ||
                (pageIndex <= activePage + siblingRange &&
                    pageIndex >= activePage - siblingRange - 1);
            const paginationEnd =
                (pageIndex > endRange &&
                    activePage - siblingRange > endRange) ||
                pageIndex > totalPages - boundaryRange;
            if (paginationStart || paginationMiddle || paginationEnd) {
                return (
                    <PageItem
                        key={pageIndex}
                        onClick={() => handlePaginationItemClick(pageIndex)}
                        $selected={active}
                        aria-label={"Page " + pageIndex}
                        aria-current={active ? "page" : false}
                        onMouseOver={closeAllTooltips}
                        onFocus={closeAllTooltips}
                    >
                        {pageIndex}
                    </PageItem>
                );
            }

            return null;
        });
    };

    const renderStartEllipsis = (pageIndex: number) => (
        <EllipsisContainer key={pageIndex}>
            <EllipsisButton
                focusHighlight={false}
                focusOutline="browser"
                aria-label={"Previous 5 pages"}
                onMouseEnter={onHoverLeftButton}
                onMouseLeave={onBlurLeftButton}
                onFocus={onHoverLeftButton}
                onBlur={onBlurLeftButton}
                onClick={handleFastBackwardClick}
            >
                {hoverLeftButton ? (
                    <Chevron2LeftIcon aria-hidden />
                ) : (
                    <EllipsisHorizontalIcon aria-hidden />
                )}
            </EllipsisButton>
            {hoverLeftButton && <Hover>Previous 5 pages</Hover>}
        </EllipsisContainer>
    );

    const renderEndEllipsis = (pageIndex: number) => (
        <EllipsisContainer key={pageIndex}>
            <EllipsisButton
                focusHighlight={false}
                focusOutline="browser"
                aria-label={"Next 5 pages"}
                onMouseEnter={onHoverRightButton}
                onMouseLeave={onBlurRightButton}
                onFocus={onHoverRightButton}
                onBlur={onBlurRightButton}
                onClick={handleFastForwardClick}
            >
                {hoverRightButton ? (
                    <Chevron2RightIcon aria-hidden />
                ) : (
                    <EllipsisHorizontalIcon aria-hidden />
                )}
            </EllipsisButton>
            {hoverRightButton && <Hover>Next 5 pages</Hover>}
        </EllipsisContainer>
    );

    const renderMobile = () => (
        <PaginationMobileInput>
            <form onSubmit={handleInputSubmit}>
                <InputView
                    value={inputText}
                    onChange={handleInput}
                    autoComplete="off"
                    type="numeric"
                    id={(id || "pagination") + "-input"}
                    data-testid={(dataTestId || "pagination") + "-input"}
                />
            </form>
            <LabelDivider>/</LabelDivider>
            <Label>{totalPages}</Label>
        </PaginationMobileInput>
    );

    return (
        <PaginationWrapper
            className={className}
            ref={ref}
            id={id || "pagination-wrapper"}
            data-testid={dataTestId || "pagination"}
            aria-label="Pagination"
        >
            <PaginationList>
                <PaginationMenu>
                    {showFirstAndLastNav && (
                        <NavigationButton
                            onClick={firstPaginationItem}
                            disabled={isFirstPage}
                            focusHighlight={false}
                            $position="left"
                            aria-label="First page"
                            focusOutline="browser"
                        >
                            <ChevronLineLeftIcon aria-hidden />
                        </NavigationButton>
                    )}
                    <NavigationButton
                        onClick={prevPaginationItem}
                        disabled={isFirstPage}
                        focusHighlight={false}
                        $position="left"
                        aria-label="Previous page"
                        focusOutline="browser"
                    >
                        <ChevronLeftIcon aria-hidden />
                    </NavigationButton>
                    {isMobile ? renderMobile() : renderPaginationItems()}
                    <NavigationButton
                        onClick={nextPaginationItem}
                        disabled={isLastPage}
                        focusHighlight={false}
                        $position="right"
                        aria-label="Next page"
                        focusOutline="browser"
                    >
                        <ChevronRightIcon aria-hidden />
                    </NavigationButton>
                    {showFirstAndLastNav && (
                        <NavigationButton
                            onClick={lastPaginationItem}
                            disabled={isLastPage}
                            focusHighlight={false}
                            $position="right"
                            aria-label="Last page"
                            focusOutline="browser"
                        >
                            <ChevronLineRightIcon aria-hidden />
                        </NavigationButton>
                    )}
                </PaginationMenu>
            </PaginationList>
            {showPageSizeChanger && !isMobile && (
                <InputSelectWrapper>
                    <InputSelect
                        options={pageSizeOptions}
                        valueExtractor={(item) => item.value}
                        listExtractor={(item) => item.label}
                        displayValueExtractor={(item) => item.label}
                        selectedOption={selectedOption}
                        onSelectOption={handleListItemClick}
                    />
                </InputSelectWrapper>
            )}
        </PaginationWrapper>
    );
};
export const Pagination = React.forwardRef(Component);

const DEFAULT_OPTIONS: PageSizeItemProps[] = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 30, label: "30 / page" },
];
