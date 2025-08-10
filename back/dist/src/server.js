"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.routes);
app.use((err, _req, res, _next) => {
    console.error(err);
    if (err instanceof zod_1.z.ZodError) {
        return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
    }
    res.status(500).json({ message: 'Erro interno' });
});
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});
