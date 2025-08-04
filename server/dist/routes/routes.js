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
const express_1 = require("express");
const API_1 = require("../API");
const router = (0, express_1.Router)();
router.get("/newsposts", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield (0, API_1.getAllPosts)();
        res.json(posts);
    }
    catch (_a) {
        res.status(500).send("Server error");
    }
}));
router.get("/newsposts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, API_1.getPostById)(Number(req.params.id));
        if (!post)
            return res.status(404).send("Not found");
        res.json(post);
    }
    catch (_a) {
        res.status(500).send("Server error");
    }
}));
router.post("/newsposts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, API_1.createPost)(req.body);
        res.json(post);
    }
    catch (_a) {
        res.status(500).send("Server error");
    }
}));
router.put("/newsposts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield (0, API_1.updatePost)(Number(req.params.id), req.body);
        res.json(updated);
    }
    catch (_a) {
        res.status(500).send("Server error");
    }
}));
router.delete("/newsposts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, API_1.deletePost)(Number(req.params.id));
        res.json({ id });
    }
    catch (_a) {
        res.status(500).send("Server error");
    }
}));
exports.default = router;
