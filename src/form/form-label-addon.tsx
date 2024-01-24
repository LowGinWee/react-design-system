import { ICircleFillIcon } from "@lifesg/react-icons/i-circle-fill";
import { PopoverTrigger } from "../popover-v2/popover-trigger";
import { AddonWrapper, TriggerArea } from "./form-label-addon.style";
import { FormLabelAddonProps } from "./types";

// =============================================================================
// POPOVER ADDON COMPONENT
// Note: We need to re-construct as using with the HOC causes some rendering
// issues
// =============================================================================
interface PopoverAddonProps {
    addon: FormLabelAddonProps;
}

export const PopoverAddon = ({ addon }: PopoverAddonProps): JSX.Element => {
    // =========================================================================
    // CONST, STATE, RE
    // =========================================================================
    const { content, type, icon, id, "data-testid": dataTestid } = addon;

    // =========================================================================
    // RENDER FUNCTION
    // =========================================================================
    const renderIcon = () => {
        if (icon) {
            return icon;
        } else {
            return <ICircleFillIcon id={`${type}-icon`} />;
        }
    };

    return (
        <PopoverTrigger
            trigger="click"
            id={id}
            data-testid={dataTestid}
            popoverContent={content}
        >
            <AddonWrapper>
                <TriggerArea>{renderIcon()}</TriggerArea>
            </AddonWrapper>
        </PopoverTrigger>
    );
};
