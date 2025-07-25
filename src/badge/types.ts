export type BadgeVariant =
    | "number"
    | "number-with-border"
    | "dot"
    | "dot-with-border";

export type BadgeColor = "default" | "important";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    badgeOffset?: [string, string] | undefined;
    children?: JSX.Element | undefined;
    count?: number | undefined;
    variant?: BadgeVariant | undefined;
    color?: BadgeColor | undefined;
    "data-testid"?: string | undefined;
}
