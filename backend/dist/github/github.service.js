"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const common_1 = require("@nestjs/common");
const rest_1 = require("@octokit/rest");
let GithubService = class GithubService {
    client(token) {
        return new rest_1.Octokit({ auth: token });
    }
    async getUserRepos(token) {
        const octokit = this.client(token);
        const { data } = await octokit.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100,
        });
        return data.map((r) => ({
            repoId: String(r.id),
            name: r.full_name,
            fullName: r.full_name,
            defaultBranch: r.default_branch,
        }));
    }
    async getDefaultBranchSha(token, owner, repo, branch) {
        const octokit = this.client(token);
        const { data } = await octokit.git.getRef({
            owner,
            repo,
            ref: `heads/${branch}`,
        });
        return data.object.sha;
    }
    async createBranch(token, owner, repo, branchName, sha) {
        const octokit = this.client(token);
        await octokit.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha,
        });
    }
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = __decorate([
    (0, common_1.Injectable)()
], GithubService);
//# sourceMappingURL=github.service.js.map