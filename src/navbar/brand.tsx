import React from "react";
import { Clickable } from "./brand.styles";
import { NavbarBrandingProps } from "./types";

interface Props {
    resources: NavbarBrandingProps;
    compress?: boolean | undefined;
    "data-testid"?: string | undefined;
    type: string | undefined;
    onClick?:
        | ((event: React.MouseEvent<HTMLAnchorElement>, value: string) => void)
        | undefined;
}

export const Brand = ({
    resources,
    compress,
    onClick,
    "data-testid": testId = "navbar-brand",
    type,
}: Props) => {
    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick(event, type);
        }
    };
    return (
        <Clickable
            role="link"
            aria-label={resources.brandName + "-app-home-page"}
            onClick={handleClick}
            $compress={compress}
            tabIndex={0}
            data-testid={testId}
        >
            <img
                src={resources.logoSrc}
                alt={resources.brandName + "-app-logo"}
            />
        </Clickable>
    );
};

// TODO: Fix img size in drawer
