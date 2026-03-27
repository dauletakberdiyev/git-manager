import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  getImportableRepos,
  importProject,
  type Project,
  type ImportableRepo,
} from '../api/projects';
import { useAuthStore } from '../store/authStore';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [repos, setRepos] = useState<ImportableRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const openImport = async () => {
    setShowImport(true);
    setLoadingRepos(true);
    try {
      const data = await getImportableRepos();
      setRepos(data);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleImport = async (repo: ImportableRepo) => {
    setImporting(repo.repoId);
    try {
      const project = await importProject(repo);
      setProjects((prev) => [project, ...prev]);
      setRepos((prev) => prev.filter((r) => r.repoId !== repo.repoId));
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">GitManage</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openImport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Import Repository
          </button>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No projects yet</p>
            <p className="text-sm">Import a GitHub repository to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}/board`}
                className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-600 transition-colors"
              >
                <h3 className="font-semibold text-white">{project.fullName}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Branch: {project.defaultBranch}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showImport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Import Repository</h3>
              <button
                onClick={() => setShowImport(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {loadingRepos ? (
                <div className="text-center py-10 text-gray-400">
                  Loading repositories...
                </div>
              ) : repos.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No repositories available to import
                </div>
              ) : (
                repos.map((repo) => (
                  <div
                    key={repo.repoId}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {repo.fullName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {repo.defaultBranch}
                      </p>
                    </div>
                    <button
                      onClick={() => handleImport(repo)}
                      disabled={importing === repo.repoId}
                      className="text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                    >
                      {importing === repo.repoId ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
