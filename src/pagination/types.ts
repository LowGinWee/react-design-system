export interface PaginationsProps {
    id?: string | undefined;
    "data-testid"?: string | undefined;
    className?: string | undefined;
    pageSize?: number | undefined;
    totalItems: number;
    activePage: number;
    pageSizeOptions?: DropdownItemProps[];
    showFirstAndLastNav?: boolean | undefined;
    showPageSizeChanger?: boolean | undefined;
    onPageChange?: ((page: number) => void) | undefined;
    onPageSizeChange?: ((page: number, pageSize: number) => void) | undefined;
}

export interface DropdownItemProps {
    value?: number | undefined;
    label?: string | undefined;
}
