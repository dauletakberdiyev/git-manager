import { useState } from 'react';
import { createTask, createTasks, type Task } from '../api/tasks';
import { breakdownTask } from '../api/ai';

interface Props {
  projectId: string;
  onCreated: (task: Task) => void;
  onClose: () => void;
}

export default function CreateTaskModal({ projectId, onCreated, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loadingAi, setLoadingAi] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleBreakdown = async () => {
    if (!title.trim()) return;
    setLoadingAi(true);
    setError('');
    try {
      const result = await breakdownTask(title);
      setSubtasks(result);
      setSelected(new Set(result.map((_, i) => i)));
    } catch {
      setError('AI breakdown failed. Check your OpenAI key.');
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleSubtask = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const allSelected = subtasks.length > 0 && selected.size === subtasks.length;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(subtasks.map((_, i) => i)));
  };

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      if (subtasks.length > 0 && selected.size > 0) {
        const selectedTitles = subtasks.filter((_, i) => selected.has(i));
        if (selectedTitles.length > 1) {
          const tasks = await createTasks({ projectId, titles: selectedTitles });
          tasks.forEach(onCreated);
        } else {
          const task = await createTask({ projectId, title: selectedTitles[0] });
          onCreated(task);
        }
      } else {
        if (!title.trim()) return;
        const task = await createTask({ projectId, title: title.trim() });
        onCreated(task);
      }
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const canCreate = subtasks.length > 0 ? selected.size > 0 : !!title.trim();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Task title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !subtasks.length && handleCreate()}
              placeholder="e.g. Build authentication system"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleBreakdown}
            disabled={!title.trim() || loadingAi}
            className="w-full text-sm text-purple-400 hover:text-purple-300 disabled:opacity-40 border border-purple-800 hover:border-purple-600 rounded-lg py-2 transition-colors"
          >
            {loadingAi ? 'Breaking down...' : '✨ Break down with AI'}
          </button>

          {subtasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">
                  Suggested subtasks ({selected.size} selected)
                </p>
                <button
                  onClick={toggleAll}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {allSelected ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {subtasks.map((s, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => toggleSubtask(i)}
                      className="mt-0.5 accent-purple-500 shrink-0"
                    />
                    <span className="text-sm text-gray-300">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg py-2.5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate || creating}
              className="flex-1 text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg py-2.5 font-medium transition-colors"
            >
              {creating
                ? 'Creating...'
                : subtasks.length > 0
                  ? `Create ${selected.size} task${selected.size !== 1 ? 's' : ''}`
                  : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
