import { Gennre } from "enum/enum";

export interface NewsPostProps {
    header: string;
    text: string;
    genre: Gennre
    isPrivate: boolean;
}