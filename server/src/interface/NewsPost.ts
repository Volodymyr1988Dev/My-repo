import {NewsPostProps} from "./NewsPostProps"
export interface NewsPost extends NewsPostProps {
    id: number;
    createDate: string;
}