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
const fileDb_1 = require("./fileDb");
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const newsPostTable = yield (0, fileDb_1.getTable)('newsPosts');
        const newPostData = {
            title: 'Лисичка народила!',
            text: 'У Чернігові в зоопарку лисичка народила лисенятко!',
        };
        const created = yield newsPostTable.create(newPostData);
        console.log('🔹 Created:', created);
        const all = yield newsPostTable.getAll();
        console.log('📄 All:', all);
        const byId = yield newsPostTable.getById(created.id);
        console.log('🔍 By ID:', byId);
        const updated = yield newsPostTable.update(created.id, { title: 'Оновлений заголовок' });
        console.log('✏️ Updated:', updated);
        const deletedId = yield newsPostTable.delete(created.id);
        console.log('🗑️ Deleted ID:', deletedId);
    });
}
app().catch(console.error);
