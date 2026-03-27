import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
  private client(token: string): Octokit {
    return new Octokit({ auth: token });
  }

  async getUserRepos(token: string) {
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

  async getDefaultBranchSha(
    token: string,
    owner: string,
    repo: string,
    branch: string,
  ): Promise<string> {
    const octokit = this.client(token);
    const { data } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    return data.object.sha;
  }

  async createBranch(
    token: string,
    owner: string,
    repo: string,
    branchName: string,
    sha: string,
  ): Promise<void> {
    const octokit = this.client(token);
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });
  }
}
