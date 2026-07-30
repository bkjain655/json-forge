export const GA_TRACKING_ID = process.env.NODE_ENV === "production" ? "G-YF0MZF0GGG" : "G-J3MNQZE15J";

// The gtag `config` call in the root layout runs with `send_page_view: false`,
// so every pageview - including the first one - is sent from here exactly once.
export const pageview = (path: string): void => {
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        isGuest: true,
    });
};
type GTAG_ACTION = "btn_click" | "link_click" | "api_response"
type GTAG_EVENT_CATEGORY = "click" | "api";
type GTagEvent = {
  action: GTAG_ACTION;
  category: GTAG_EVENT_CATEGORY;
  label: string;
  value: any;
};

export const gaCustomEvent = ({ action, category, label, value }: GTagEvent): void => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            additional_info: JSON.stringify({
                isGuest: true,
                value
            }),
        });
    }
};