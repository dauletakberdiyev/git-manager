import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getProjectTasks, getProjects, type Project } from '../api/projects';
import { updateTask, type Task, type TaskStatus } from '../api/tasks';
import CreateTaskModal from '../components/CreateTaskModal';

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Done' },
];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing select-none"
    >
      <p className="text-white text-sm leading-snug">{task.title}</p>
      {task.branchName && (
        <span className="text-xs text-purple-400 mt-1.5 block font-mono">
          {task.branchName}
        </span>
      )}
    </div>
  );
}

function KanbanColumn({
  id,
  label,
  tasks,
  onAddTask,
}: {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onAddTask?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const colorMap: Record<TaskStatus, string> = {
    TODO: 'text-gray-400',
    IN_PROGRESS: 'text-yellow-400',
    DONE: 'text-green-400',
  };

  return (
    <div className="flex-1 min-w-[260px] max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className={`text-xs font-semibold uppercase ${colorMap[id]}`}>
            {label}
          </h3>
          <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        {onAddTask && id === 'TODO' && (
          <button
            onClick={onAddTask}
            className="text-gray-500 hover:text-white text-xs transition-colors"
          >
            + Add
          </button>
        )}
      </div>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`bg-gray-900 border rounded-xl p-3 min-h-[400px] space-y-2 transition-colors ${
            isOver ? 'border-purple-600 bg-purple-900/10' : 'border-gray-800'
          }`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function BoardPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Record<TaskStatus, Task[]>>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(224);
  // Track the column the task was in when the drag started
  const dragOriginCol = useRef<TaskStatus | null>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };

    const onMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = e.clientX - resizeRef.current.startX;
      const next = Math.min(480, Math.max(160, resizeRef.current.startWidth + delta));
      setSidebarWidth(next);
    };

    const onMouseUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (!projectId) return;
    getProjectTasks(projectId).then((tasks: Task[]) => {
      const grouped: Record<TaskStatus, Task[]> = {
        TODO: [],
        IN_PROGRESS: [],
        DONE: [],
      };
      for (const task of tasks) {
        grouped[task.status].push(task);
      }
      setColumns(grouped);
    });
  }, [projectId]);

  const findColumn = (taskId: string): TaskStatus | null => {
    for (const col of Object.keys(columns) as TaskStatus[]) {
      if (columns[col].some((t) => t.id === taskId)) return col;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const col = findColumn(String(event.active.id));
    if (col) {
      const task = columns[col].find((t) => t.id === event.active.id);
      setActiveTask(task ?? null);
      dragOriginCol.current = col;
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumn(String(active.id));
    const overCol =
      COLUMNS.find((c) => c.id === over.id)?.id ?? findColumn(String(over.id));

    if (!activeCol || !overCol || activeCol === overCol) return;

    setColumns((prev) => {
      const task = prev[activeCol].find((t) => t.id === active.id)!;
      return {
        ...prev,
        [activeCol]: prev[activeCol].filter((t) => t.id !== active.id),
        [overCol]: [...prev[overCol], task],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    const task = activeTask;
    const originCol = dragOriginCol.current;

    setActiveTask(null);
    dragOriginCol.current = null;

    if (!over || !task) return;

    // After handleDragOver moved the task, findColumn returns the final column
    const finalCol = findColumn(task.id);

    if (finalCol && originCol !== finalCol) {
      updateTask(task.id, { status: finalCol }).catch(console.error);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setColumns((prev) => ({
      ...prev,
      TODO: [...prev.TODO, task],
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside style={{ width: sidebarWidth }} className="shrink-0 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-800">
          <Link to="/projects" className="text-sm font-bold text-white hover:text-purple-300 transition-colors">
            GitManage
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}/board`)}
              className={`w-full text-left px-4 py-2.5 text-sm truncate transition-colors ${
                p.id === projectId
                  ? 'bg-purple-900/40 text-purple-300 border-r-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {p.fullName}
            </button>
          ))}
        </nav>
      </aside>

      <div
        onMouseDown={handleResizeMouseDown}
        className="w-1 shrink-0 bg-gray-800 hover:bg-purple-600 cursor-col-resize transition-colors"
      />

      <div className="flex-1 flex flex-col min-w-0">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <h1 className="text-sm font-medium text-gray-300">Project Board</h1>
        <div className="ml-auto">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="px-6 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={col.label}
                tasks={columns[col.id]}
                onAddTask={() => setShowCreate(true)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="bg-gray-800 border border-purple-600 rounded-lg p-3 shadow-xl rotate-1">
                <p className="text-white text-sm">{activeTask.title}</p>
                {activeTask.branchName && (
                  <span className="text-xs text-purple-400 mt-1.5 block font-mono">
                    {activeTask.branchName}
                  </span>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>
      </div>

      {showCreate && projectId && (
        <CreateTaskModal
          projectId={projectId}
          onCreated={handleTaskCreated}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
