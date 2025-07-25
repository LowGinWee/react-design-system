import { Colour, Font } from "src/theme";
import styled from "styled-components";

// =============================================================================
// STYLING
// =============================================================================
export const SubOption = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    margin-left: 2rem;
`;

export const Label = styled.label`
    ${Font["body-baseline-regular"]}
    color: ${Colour.text};
    cursor: pointer;
`;

export const SelectAll = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;
