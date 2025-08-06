import Ajv from 'ajv';
import { Genre } from '../enum/enum';


const ajv = new Ajv({allErrors: true});

export const newPostSchema ={
    type: 'object',
    properties: {
        title: {type: 'string', maxLength: 50}, //kMaxLength
        text: {type: 'string', maxLength: 256},
        genre: {
        type: 'string',
        enum: Object.values(Genre),
      //  enum: ['Politic', 'Business', 'Sport', 'Other'] // If you want to hardcode genres
        },
        isPrivate: {type: 'boolean'},

    },
    required :['title', 'text', 'genre', 'isPrivate'],
    additionalProperties: false,
}

export const validateNewPost = ajv.compile(newPostSchema)