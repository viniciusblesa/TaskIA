import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw, X } from "lucide-react";
import { Button } from "./components/ui/button";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { Kanban, KanbanBoard, KanbanOverlay } from "./components/reui/kanban";
import { getAll, createTask, updateTask, deleteTask} from './services/apiServices';
import { TaskColumn } from "./components/kanban/TaskColumn";
import "./App.css";

function App() {
  const [columns, setColumns] = useState({
    backlog: [],
    inProgress: [],
    review: [],
    done: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    let cancelled = false;

    async function fetchTasks() {
      try {
        const tasks = await getAll();
        const grouped = {
          backlog: [],
          inProgress: [],
          review: [],
          done: [],
        };
        tasks.forEach((task) => {
          const col = task.columnID || "backlog";
          if (grouped[col]) {
            grouped[col].push(task);
          } else {
            grouped[col] = [task];
          }
        });
        if (!cancelled) {
          setColumns(grouped);
          setLoadError("");
        }
      } catch (err) {
        console.error("Erro ao obter tasks do backend:", err);
        if (!cancelled) {
          setLoadError("Não foi possível carregar as tarefas. Verifique se a API está em execução e tente novamente.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchTasks();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleCreateTask = (column, task) => {
    setColumns((prev) => ({
      ...prev,
      [column]: [task, ...prev[column]],
    }));
  };

  const handleUpdateTask = (column, taskId, updates) => {
    if (String(taskId).startsWith("temp-")) {
      const cleanId = String(taskId).replace("temp-", "");
      const taskToCreate = {
        ...updates,
        id: cleanId,
        columnID: column,
      }; 
      createTask(taskToCreate)
        .then((savedTask) => {
          setActionError("");
          setColumns((prev) => ({
            ...prev,
            [column]: prev[column].map((task) =>
              task.id === taskId ? savedTask : task
            ),
          }));
        })
        .catch((err) => {
          console.error("Erro ao criar task no backend:", err);
          setActionError("Não foi possível salvar a tarefa. Confira a API e tente novamente.");
        });
    } else {
      const taskToUpdate = {
        ...updates,
        columnID: column,
      };
      updateTask(taskId, taskToUpdate)
        .then((savedTask) => {
          setActionError("");
          setColumns((prev) => ({
            ...prev,
            [column]: prev[column].map((task) =>
              task.id === taskId ? savedTask : task
            ),
          }));
        })
        .catch((err) => {
          console.error("Erro ao atualizar task no backend:", err);
          setActionError("Não foi possível atualizar a tarefa. A alteração pode não ter sido salva.");
        });
    }
  };

  const handleDeleteTask = (column, taskId) => {
    if (String(taskId).startsWith("temp-")) {
      setColumns((prev) => ({
        ...prev,
        [column]: prev[column].filter((task) => task.id !== taskId),
      }));
      return;
    }

    deleteTask(taskId)
      .then(() => {
        setActionError("");
        setColumns((prev) => ({
          ...prev,
          [column]: prev[column].filter((task) => task.id !== taskId),
        }));
      })
      .catch((err) => {
        console.error("Erro ao deletar task no backend:", err);
        setActionError("Não foi possível excluir a tarefa. Tente novamente.");
      });
  };

  const handleColumnsChange = (newColumns) => {
    setColumns(newColumns);

    Object.entries(newColumns).forEach(([colKey, taskList]) => {
      taskList.forEach((task) => {
        if (task.columnID !== colKey) {
          if (String(task.id).startsWith("temp-")) return;
          const updatedTask = { ...task, columnID: colKey };
          updateTask(task.id, updatedTask)
            .then(() => {
              setColumns((prev) => ({
                ...prev,
                [colKey]: prev[colKey].map((t) =>
                  t.id === task.id ? { ...t, columnID: colKey } : t
                ),
              }));
            })
            .catch((err) => {
              console.error(`Erro ao sincronizar drag-and-drop para a task ${task.id}:`, err);
              setActionError("Não foi possível salvar a movimentação da tarefa.");
            });
        }
      });
    });
  };

  const taskCount = Object.values(columns).reduce((total, tasks) => total + tasks.length, 0);
  const completedCount = columns.done.length;
  const activeCount = taskCount - completedCount;

  const handleRetryLoad = () => {
    setLoadError("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <>
      <div className="grid h-screen grid-cols-[auto_1fr] grid-rows-1 [grid-template-areas:'sidebar_main']">
        <Sidebar
          className="[grid-area:sidebar] w-64 bg-gray-100 dark:bg-gray-800"
          onLogout={() => setIsLoggedIn(false)}
        />

        <main className="[grid-area:main] min-w-0 overflow-auto px-4 py-5 sm:px-6">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">TaskIA / Espaço de trabalho</p>
              <h1 className="text-2xl font-semibold tracking-normal text-foreground">Quadro de tarefas</h1>
            </div>
            <div className="flex gap-5 text-sm" aria-live="polite">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle aria-hidden="true" size={16} />
                <span>Ativas <strong className="ml-1 text-foreground">{activeCount}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 aria-hidden="true" size={16} />
                <span>Concluídas <strong className="ml-1 text-foreground">{completedCount}</strong></span>
              </div>
            </div>
          </header>

          {actionError && (
            <div role="alert" className="mb-4 flex items-center justify-between gap-3 border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-foreground">
              <span>{actionError}</span>
              <button type="button" onClick={() => setActionError("")} aria-label="Dispensar aviso" className="shrink-0 rounded p-1 hover:bg-destructive/10">
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
              <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
              Carregando tarefas...
            </div>
          ) : loadError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center" role="alert">
              <AlertCircle aria-hidden="true" className="text-destructive" size={28} />
              <p className="max-w-md text-sm text-muted-foreground">{loadError}</p>
              <Button onClick={handleRetryLoad} variant="outline">
                <RefreshCw aria-hidden="true" size={16} />
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <Kanban
                value={columns}
                onValueChange={handleColumnsChange}
                getItemValue={(item) => item.id}
              >
                <KanbanBoard className="grid min-w-[1080px] grid-cols-4 gap-5 p-1">
                  {Object.entries(columns).map(([key, tasks]) => (
                    <TaskColumn
                      key={key}
                      value={key}
                      tasks={tasks}
                      onAddTask={handleCreateTask}
                      onUpdateTask={handleUpdateTask}
                      onRemoveTask={handleDeleteTask}
                    />
                  ))}
                </KanbanBoard>
                <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
              </Kanban>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
