import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingDotsSpinner } from "../animations";
import {
    BodyCell,
    BodyCellContent,
    BodyRow,
    CheckBoxWrapper,
    EmptyViewCell,
    ErrorDisplayElement,
    HeaderCell,
    HeaderCellWrapper,
    HeaderRow,
    LoaderWrapper,
    SelectionBar,
    Table,
    TableBody,
    TableContainer,
    TableWrapper,
} from "./data-table.styles";
import { DataTableProps, HeaderProps, RowProps } from "./types";
import { ArrowDownIcon, ArrowUpIcon } from "@lifesg/react-icons";
import { Text } from "../text";
import { Checkbox } from "../checkbox";
import { Button } from "../button";

export const DataTable = ({
    id,
    headers,
    rows,
    className,
    sortIndicators,
    alternatingRows,
    loadState = "success",
    enableMultiSelect,
    selectedIds,
    disabledIds,
    enableSelectAll,
    enableActionBar,
    emptyView,
    actionBarContent,
    renderCustomEmptyView,
    onHeaderClick,
    onSelect,
    onSelectAll,
    onClearSelectionClick,
    ...otherProps
}: DataTableProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const [showLastBorder, setShowLastBorder] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [alignActionBarWithScreen, setAlignActionBarWithScreen] =
        useState(false);
    const tableRef = useRef<HTMLTableElement>();

    const { ref: stickyRef, inView: isLastRowInView } = useInView({
        threshold: 0,
    });
    const { ref: endRef, inView: atEnd } = useInView({
        threshold: 0,
    });
    const { ref: containerRef, inView: isContainerInView } = useInView({
        threshold: 0,
        rootMargin: "0px 0px -100px 0px",
    });

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        checkLastBorder();
    }, [rows]);

    useEffect(() => {
        setIsFloating(isContainerInView && !isLastRowInView);
        setAlignActionBarWithScreen(!atEnd);
    }, [isLastRowInView, atEnd, isContainerInView]);

    // ===========================================================================
    // HELPER FUNCTIONS
    // ===========================================================================
    const isAllCheckboxSelected = (): boolean => {
        return selectedIds?.length === rows.length;
    };

    const isIndeterminateCheckbox = (): boolean => {
        return (
            selectedIds && selectedIds.length !== 0 && !isAllCheckboxSelected()
        );
    };

    const isRowSelected = (rowId: string): boolean => {
        return !!selectedIds?.includes(rowId);
    };

    const isAlternatingRow = (index: number): boolean => {
        return !!alternatingRows && index % 2 === 1;
    };

    const isDisabledRow = (rowId: string): boolean => {
        return !!disabledIds?.includes(rowId);
    };

    const getDataTestId = (subStr: string) => {
        if (!otherProps["data-testid"]) return undefined;
        return `${otherProps["data-testid"]}-${subStr}`;
    };

    const getTotalColumns = (): number => {
        return headers.length + (enableMultiSelect ? 1 : 0);
    };

    const checkLastBorder = () => {
        setShowLastBorder(
            tableRef.current?.scrollHeight >
                (tableRef.current?.childNodes[0] as HTMLElement).clientHeight
        );
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const renderHeaders = () => (
        <thead>
            <HeaderRow>
                {enableMultiSelect && renderHeaderCheckBox()}
                {headers.map(renderHeaderCell)}
            </HeaderRow>
        </thead>
    );

    const renderHeaderCell = (header: HeaderProps) => {
        const {
            fieldKey,
            label,
            clickable = false,
            style,
        } = typeof header === "string"
            ? {
                  fieldKey: header,
                  label: header,
                  style: undefined,
              }
            : header;

        return (
            <HeaderCell
                data-testid={getDataTestId(`header-${fieldKey}`)}
                key={fieldKey}
                $clickable={clickable}
                onClick={() => clickable && onHeaderClick?.(fieldKey)}
                style={style}
                $isCheckbox={false}
            >
                <HeaderCellWrapper>
                    {typeof label === "string" ? (
                        <Text.H4 weight="bold">{label}</Text.H4>
                    ) : (
                        label
                    )}
                    {renderSortedArrow(fieldKey)}
                </HeaderCellWrapper>
            </HeaderCell>
        );
    };

    const renderSortedArrow = (fieldKey: string) => {
        const isSorted = sortIndicators?.[fieldKey];

        if (!isSorted) {
            return <></>;
        }
        if (isSorted === "asc") {
            return (
                <ArrowUpIcon
                    data-testid={getDataTestId(`header-${fieldKey}-arrowup`)}
                />
            );
        }
        return (
            <ArrowDownIcon
                data-testid={getDataTestId(`header-${fieldKey}-arrowdown`)}
            />
        );
    };

    const renderHeaderCheckBox = () => {
        return (
            <HeaderCell
                data-testid={getDataTestId("header-selection")}
                $clickable={false}
                $isCheckbox={true}
            >
                <CheckBoxWrapper>
                    {enableSelectAll && (
                        <Checkbox
                            displaySize="small"
                            checked={isAllCheckboxSelected()}
                            indeterminate={isIndeterminateCheckbox()}
                            onClick={() => {
                                onSelectAll(isAllCheckboxSelected());
                            }}
                        />
                    )}
                </CheckBoxWrapper>
            </HeaderCell>
        );
    };

    const renderRows = () => {
        return rows?.length < 1 ? (
            <tr>
                <EmptyViewCell colSpan={getTotalColumns()}>
                    {renderCustomEmptyView
                        ? renderCustomEmptyView()
                        : renderBasicEmptyView()}
                </EmptyViewCell>
            </tr>
        ) : (
            <>
                {rows?.map((row: RowProps, index: number) => (
                    <BodyRow
                        data-testid={getDataTestId(`row-${row.id.toString()}`)}
                        key={row.id.toString()}
                        $alternating={isAlternatingRow(index)}
                        $isSelectable={enableMultiSelect}
                        $isSelected={isRowSelected(row.id.toString())}
                        ref={rows.length - 1 === index ? stickyRef : null}
                    >
                        {enableMultiSelect &&
                            renderRowCheckBox(row.id.toString())}

                        {headers.map((header) => renderRowCell(header, row))}
                    </BodyRow>
                ))}
            </>
        );
    };

    const renderRowCell = (header: HeaderProps, row: RowProps) => {
        const style = typeof header !== "string" ? header.style : undefined;
        const fieldKey = typeof header === "string" ? header : header.fieldKey;
        const rowId = row.id.toString();
        const cellData = row[fieldKey];
        const cellId = `${rowId}-${fieldKey}`;

        return (
            <BodyCell
                data-testid={getDataTestId(`row-${cellId}`)}
                key={cellId}
                style={style}
                $isCheckbox={false}
            >
                {typeof cellData === "string" ||
                typeof cellData === "number" ? (
                    <BodyCellContent>{cellData}</BodyCellContent>
                ) : typeof cellData === "function" ? (
                    cellData(row, { isSelected: isRowSelected(rowId) })
                ) : (
                    cellData
                )}
            </BodyCell>
        );
    };

    const renderRowCheckBox = (rowId: string) => {
        return (
            <BodyCell
                data-testid={getDataTestId(`row-${rowId}-selection`)}
                $isCheckbox={true}
            >
                <CheckBoxWrapper>
                    <Checkbox
                        displaySize="small"
                        checked={isRowSelected(rowId)}
                        onClick={() => {
                            onSelect(rowId, !isRowSelected(rowId));
                        }}
                        disabled={isDisabledRow(rowId)}
                    />
                </CheckBoxWrapper>
            </BodyCell>
        );
    };

    const renderBasicEmptyView = () => {
        return (
            <ErrorDisplayElement
                type={"no-item-found"}
                title={
                    emptyView?.title ? (
                        typeof emptyView.title === "string" ? (
                            <Text.H3>{emptyView.title}</Text.H3>
                        ) : (
                            emptyView.title
                        )
                    ) : (
                        <Text.H3>{"No <items> found"}</Text.H3>
                    )
                }
                description={
                    emptyView?.description
                        ? emptyView.description
                        : "No matching rows"
                }
                actionButton={emptyView?.actionButton}
                img={emptyView?.img}
            />
        );
    };

    const renderLoader = () => {
        return (
            <tr>
                <td colSpan={getTotalColumns()}>
                    <LoaderWrapper>
                        {loadState === "loading" && <LoadingDotsSpinner />}
                    </LoaderWrapper>
                </td>
            </tr>
        );
    };

    const renderSelectionBar = () => {
        return (
            <SelectionBar
                $isFloating={isFloating}
                $alignWithScreen={alignActionBarWithScreen}
                $width={tableRef.current?.clientWidth}
            >
                <Text.H5 weight="semibold">{`${selectedIds.length} item${
                    selectedIds.length > 1 ? "s" : ""
                } selected`}</Text.H5>
                <Button.Small styleType="link" onClick={onClearSelectionClick}>
                    Clear selection
                </Button.Small>
                {actionBarContent}
            </SelectionBar>
        );
    };

    return (
        <TableWrapper
            id={id || "table-wrapper"}
            data-testid={otherProps["data-testid"] || "table"}
            className={className}
            ref={containerRef}
        >
            <TableContainer
                ref={tableRef}
                $isRoundBorder={
                    !enableActionBar || !isLastRowInView || !selectedIds?.length
                }
            >
                <Table>
                    {renderHeaders()}
                    <TableBody $showLastRowBottomBorder={showLastBorder}>
                        {loadState === "success"
                            ? renderRows()
                            : renderLoader()}
                    </TableBody>
                </Table>
            </TableContainer>
            {enableActionBar &&
                selectedIds &&
                selectedIds.length > 0 &&
                renderSelectionBar()}
            <div ref={endRef}></div>
        </TableWrapper>
    );
};
