export enum ESearchMode {
    Read = "read",
    Search = "search",
}

export enum KeywordColor {
    Default = "default",
    Primary = "primary",
    Secondary = "secondary",
    Success = "success",
    Warning = "warning",
    Danger = "danger"
}

export type TagProps = {
    key: string,
    type: string,
    link?: string
}
