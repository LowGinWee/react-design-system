import { HTMLAttributes, useContext, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useSpring } from "react-spring";
import { SidenavContext } from "./sidenav-context";
import {
    ChevronIcon,
    Container,
    DrawerContent,
    DrawerSubitemContainer,
    LinkButton,
    TextElement,
} from "./sidenav-drawer-item.styles";
import { SidenavDrawerItemProps } from "./types";

export const SidenavDrawerItem = ({
    id,
    title,
    onClick,
    children,
    ...otherProps
}: SidenavDrawerItemProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const [expanded, setExpanded] = useState<boolean>(true);
    const [highlight, setHighlight] = useState<boolean>(false);
    const {
        currentItem,
        setSelectedItem,
        setPreviouslySelectedItemId,
        setCurrentItem,
    } = useContext(SidenavContext);

    const [internalId] = useState<boolean>(true);
    const subitemId = `${internalId}-submenu`;

    const containerAnimationProps = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
    });
    const resizeDetector = useResizeDetector();
    const childRef = resizeDetector.ref;
    const contentAnimationProps = useSpring({
        height: children && expanded ? resizeDetector.height : 0,
    });

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleMouseEnter = () => {
        setHighlight(true);
    };

    const handleMouseLeave = () => {
        setHighlight(false);
    };

    const handleOnClick = () => {
        if (children) {
            setExpanded(!expanded);
            return;
        }
        setSelectedItem({ itemId: currentItem?.itemId, content: undefined });
        setCurrentItem(undefined);
        setPreviouslySelectedItemId(undefined);
        if (onClick) {
            onClick(id);
        }
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    const ariaControlProps: HTMLAttributes<HTMLButtonElement> = children
        ? {
              "aria-controls": subitemId,
              "aria-expanded": expanded,
          }
        : {};

    return (
        <Container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...otherProps}
            style={containerAnimationProps}
        >
            <LinkButton
                type="button"
                onClick={handleOnClick}
                $highlight={highlight && expanded}
                $noChildren={!children}
                {...ariaControlProps}
            >
                <TextElement>{title}</TextElement>
                {children && <ChevronIcon aria-hidden $expanded={expanded} />}
            </LinkButton>
            <DrawerSubitemContainer style={contentAnimationProps}>
                <DrawerContent id={subitemId} ref={childRef}>
                    {children}
                </DrawerContent>
            </DrawerSubitemContainer>
        </Container>
    );
};
