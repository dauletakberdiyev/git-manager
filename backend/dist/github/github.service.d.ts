export declare class GithubService {
    private client;
    getUserRepos(token: string): Promise<{
        repoId: string;
        name: string;
        fullName: string;
        defaultBranch: string;
    }[]>;
    getDefaultBranchSha(token: string, owner: string, repo: string, branch: string): Promise<string>;
    createBranch(token: string, owner: string, repo: string, branchName: string, sha: string): Promise<void>;
}
