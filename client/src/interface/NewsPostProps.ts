import { Gennre } from "enum/enum";

export interface NewsPostProps {
    title: string;
    text: string;
    genre: Gennre
    isPrivate: boolean;
}