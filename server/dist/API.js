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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const fileDb_1 = require("../../server/src/fileDb");
const newsPostTablePromise = (0, fileDb_1.getTable)('newsPosts');
const newPostData = {
    title: 'Лисичка народила!',
    text: 'У Чернігові в зоопарку лисичка народила лисенятко!',
};
function createPost(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield newsPostTablePromise;
        return yield newsPostTable.create(data);
    });
}
function getAllPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield newsPostTablePromise;
        return yield newsPostTable.getAll();
    });
}
function getPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield newsPostTablePromise;
        return yield newsPostTable.getById(id);
    });
}
// const byId = await newsPostTable.getById(created.id);
function updatePost(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield newsPostTablePromise;
        return newsPostTable.update(id, data);
    });
}
// const updated = await newsPostTable.update(created.id, { title: 'Оновлений заголовок' });
function deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield newsPostTablePromise;
        return yield newsPostTable.delete(id);
    });
}
