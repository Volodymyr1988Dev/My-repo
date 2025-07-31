"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsPostTable = void 0;
exports.getTable = getTable;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class NewsPostTable {
    constructor(tableName) {
        this.filePath = path_1.default.join(__dirname, `${tableName}.json`);
        if (!fs_1.default.existsSync(this.filePath)) {
            fs_1.default.writeFileSync(this.filePath, '[]', 'utf8');
        }
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs_1.default.promises.readFile(this.filePath, 'utf8');
                return JSON.parse(data);
            }
            catch (err) {
                throw new Error(`Read error: ${err.message}`);
            }
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.default.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
            }
            catch (err) {
                throw new Error(`Write error: ${err.message}`);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.read();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.read();
            return posts.find(post => post.id === id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.read();
            const lastId = posts.length > 0 ? posts[posts.length - 1].id : 0;
            const newPost = Object.assign(Object.assign({ id: lastId + 1 }, data), { createDate: new Date().toISOString() });
            posts.push(newPost);
            yield this.write(posts);
            return newPost;
        });
    }
    update(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.read();
            const index = posts.findIndex(post => post.id === id);
            if (index === -1)
                throw new Error(`Record with id ${id} not found`);
            posts[index] = Object.assign(Object.assign({}, posts[index]), updatedData);
            yield this.write(posts);
            return posts[index];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.read();
            const index = posts.findIndex(post => post.id === id);
            if (index === -1)
                throw new Error(`Record with id ${id} not found`);
            posts.splice(index, 1);
            yield this.write(posts);
            return id;
        });
    }
}
exports.NewsPostTable = NewsPostTable;
// Фабрика для створення екземпляра
function getTable(tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new NewsPostTable(tableName);
    });
}
