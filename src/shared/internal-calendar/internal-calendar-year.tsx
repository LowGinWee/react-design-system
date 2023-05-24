import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { CalendarHelper } from "../../util/calendar-helper";
import { CellLabel, Wrapper, YearCell } from "./internal-calendar-year.style";
import { FocusType, InternalCalendarProps } from "./types";

export type YearVariant =
    | "default"
    | "current-year"
    | "other-decade"
    | "selected-year";

interface Props extends Pick<InternalCalendarProps, "type" | "between"> {
    calendarDate: Dayjs;
    currentFocus?: FocusType | undefined;
    selectedStartDate: string;
    selectedEndDate?: string | undefined;
    viewCalendarDate: Dayjs;
    isNewSelection: boolean;
    onYearSelect: (value: Dayjs) => void;
}

export const InternalCalendarYear = ({
    calendarDate,
    currentFocus,
    selectedStartDate,
    selectedEndDate,
    viewCalendarDate,
    type,
    isNewSelection,
    between,
    onYearSelect,
}: Props) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const years = useMemo<Dayjs[]>(
        () => CalendarHelper.generateDecadeOfYears(dayjs(calendarDate)),
        [calendarDate]
    );

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleYearClick = (value: Dayjs, isDisabled: boolean) => {
        if (isDisabled) return;

        onYearSelect(value);
    };

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    const isDisabled = (day: Dayjs): boolean => {
        const isOutsideBetweenRange =
            between && !day.isBetween(between[0], between[1], "year", "[]");

        const isStartAfterEnd =
            currentFocus === "start" &&
            selectedEndDate &&
            day.isAfter(selectedEndDate, "year") &&
            isNewSelection;

        const isEndBeforeStart =
            currentFocus === "end" &&
            selectedStartDate &&
            day.isBefore(selectedStartDate, "year") &&
            isNewSelection;

        return isOutsideBetweenRange || isStartAfterEnd || isEndBeforeStart;
    };

    const generateYearStatus = (date: Dayjs) => {
        const otherDecadeIndexes = [0, 11];

        const isOtherDecade = otherDecadeIndexes.includes(years.indexOf(date));
        const year = date.year();
        const disabled = isDisabled(date);

        const variant: YearVariant = isOtherDecade
            ? "other-decade"
            : viewCalendarDate.isSame(date, "year")
            ? "selected-year"
            : dayjs().isSame(date, "year")
            ? "current-year"
            : "default";

        return {
            disabled,
            year,
            variant: variant,
        };
    };

    // =============================================================================
    // RENDER FUNCTION
    // =============================================================================
    if (!years.length) return null;

    return (
        <Wrapper $type={type}>
            {years.map((date) => {
                const { disabled, variant, year } = generateYearStatus(date);

                return (
                    <YearCell
                        key={year}
                        $variant={variant}
                        $disabled={disabled}
                        onClick={() => handleYearClick(date, disabled)}
                    >
                        <CellLabel
                            weight="regular"
                            $variant={variant}
                            $disabled={disabled}
                        >
                            {year}
                        </CellLabel>
                    </YearCell>
                );
            })}
        </Wrapper>
    );
};
