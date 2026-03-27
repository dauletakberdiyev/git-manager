"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiService = class AiService {
    config;
    openai;
    constructor(config) {
        this.config = config;
        this.openai = new openai_1.default({
            apiKey: config.get('OPENAI_API_KEY'),
        });
    }
    async breakdown(taskTitle) {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a software planning assistant. Break down the given development task into 3-6 concrete subtasks. Respond with ONLY a JSON array of strings, no explanation.',
                },
                { role: 'user', content: taskTitle },
            ],
            temperature: 0.3,
        });
        const raw = response.choices[0].message.content ?? '[]';
        const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        try {
            return JSON.parse(content);
        }
        catch {
            return content
                .split('\n')
                .filter(Boolean)
                .map((s) => s.replace(/^[-•\d.)]\s*/, '').trim())
                .filter(Boolean);
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map