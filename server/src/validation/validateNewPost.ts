import Ajv from 'ajv';

import { Genre } from '../enum/enum';


const ajv = new Ajv({allErrors: true});

export const newPostSchema ={
    type: 'object',
    properties: {
        header: {type: 'string', maxLength: 50},
        text: {type: 'string', maxLength: 256},
        genre: {
        type: 'string',
        enum: Object.values(Genre),
        },
        isPrivate: {type: 'boolean'},

    },
    required :['header', 'text', 'genre', 'isPrivate'],
    additionalProperties: false,
}

export const validateNewPost = ajv.compile(newPostSchema)