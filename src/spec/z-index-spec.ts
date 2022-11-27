// note: no need to put local z-indexes here!
// e.g. fade effect is contained within the breadcrumb component,
// so there's no need to track it

/**
 * Map of global `z-index`s.
 *
 * For elements that render over other elements in the page;
 * usually fixed or sticky elements
 */
export const ZIndex = {
    popover: 500,
    tooltip: 500,
    dropdown: 600,
    notificationBanner: 700,
    navbar: 800,
    smartAppBanner: 900,
    overlay: 1000,
};
