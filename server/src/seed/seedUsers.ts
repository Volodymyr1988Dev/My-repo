import {User} from '../entities/User';
import { NewsPost } from '../entities/NewsPost';
import { AppDataSource } from '../utils/DataSource';
import bcryprt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Genre } from '../enum/enum';

export async function seedUsers() {
    const existing = await AppDataSource.manager.findOne(User, { where: { email: "seedTest2@gmail.com" } });
    if (!existing) {
const user = new User();
    user.email = 'seedTest2@gmail.com';
    user.passwordHash = await bcryprt.hash('123456', 10);
    //user.deleted = false;

    await AppDataSource.manager.save(user);
    console.log(`Seeded user: ${user.email} / 123456`);

    for (let i = 1; i < 20; i++) {
        const post = new NewsPost()
        post.header = faker.lorem.sentence();
        post.text = faker.lorem.paragraphs(2);
        post.isPrivate = false;
        post.genre = Genre.OTHER
        post.author = user;
        await AppDataSource.manager.save(post);
        console.log(`Seeded post: ${post.header}`);
    }
    }
    else {
        console.log('User with posts allready existing')
    }
    
}