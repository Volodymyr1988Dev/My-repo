import { Genre } from "../enum/enum";

export interface NewsPostProps {
    title: string;
    text: string;
    genre: Genre;
    isPrivate: boolean;
}