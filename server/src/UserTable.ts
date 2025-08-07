import { UserInterface } from './interface/userInterface';
import path from 'path';
import fs from 'fs';

export class UserTable {
   private filePath = path.join(__dirname, 'users.json');
   constructor() {
       if (!fs.existsSync(this.filePath)) {
           fs.writeFileSync(this.filePath, '[]', 'utf8');
       }
   }
    private async read(): Promise<UserInterface[]> {

              const data = await fs.promises.readFile(this.filePath, 'utf8');
              return JSON.parse(data);
    }
    private async write(users: UserInterface[]): Promise<void> {
        await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf8');
    }
    async create(user: UserInterface): Promise<UserInterface> {
        const users = await this.read();
        users.push(user);
        await this.write(users);
        return user;
    }
    async findById(id: string): Promise<UserInterface | undefined> {
        const users = await this.read();
        return users.find(user => user.id === id);
    }
    async findByEmail(email: string): Promise<UserInterface | undefined> {
        const users = await this.read();
        return users.find(user => user.email === email);
    }
}