// ==========================================================================
// Constantes e Chaves de Configuração
// ==========================================================================
const STORAGE_KEY = 'meu_dia_tarefas';

// Elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const currentDateEl = document.getElementById('current-date');
const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toast-message');

// Barra de progresso e estatísticas
const progressBarFill = document.getElementById('progress-bar-fill');
const progressStat = document.getElementById('progress-stat');

// Filtros
const filterTabs = document.querySelectorAll('.filter-tab');
const countAllEl = document.getElementById('count-all');
const countPendingEl = document.getElementById('count-pending');
const countCompletedEl = document.getElementById('count-completed');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Estado da Aplicação
let currentFilter = 'all';
let toastTimeout = null;

// ==========================================================================
// Gerenciamento do LocalStorage com Migração Segura
// ==========================================================================

/**
 * Lê e normaliza as tarefas salvas no LocalStorage.
 * Garante compatibilidade caso existissem tarefas no formato antigo (strings).
 */
function getTasksFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        // Migração defensiva: normaliza para objetos { id, text, completed, createdAt }
        return parsed.map((item, index) => {
            if (typeof item === 'string') {
                return {
                    id: `legacy-${Date.now()}-${index}`,
                    text: item,
                    completed: false,
                    createdAt: Date.now()
                };
            }
            return {
                id: item.id || `task-${Date.now()}-${index}`,
                text: String(item.text || ''),
                completed: Boolean(item.completed),
                createdAt: item.createdAt || Date.now()
            };
        });
    } catch (error) {
        console.error('Falha ao acessar LocalStorage:', error);
        return [];
    }
}

/**
 * Salva a coleção de tarefas no LocalStorage.
 */
function saveTasksToStorage(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Erro ao salvar no LocalStorage:', error);
    }
}

// ==========================================================================
// Sistema de Feedback Visual (Toast & Shake)
// ==========================================================================

/**
 * Exibe um alerta flutuante elegante na parte superior da tela.
 */
function showNotification(message) {
    if (!toastEl) return;

    toastMessageEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3200);
}

/**
 * Aplica um efeito de vibração (shake) no campo de texto para indicar erro.
 */
function triggerInputError() {
    taskInput.classList.remove('shake');
    // Força reflow para reiniciar animação
    void taskInput.offsetWidth;
    taskInput.classList.add('shake');
    taskInput.focus();
}

// ==========================================================================
// Métricas e Barra de Progresso
// ==========================================================================

/**
 * Atualiza o indicador de progresso e os contadores de tarefas.
 */
function updateProgressAndCounters(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Atualiza contadores dos filtros
    if (countAllEl) countAllEl.textContent = total;
    if (countPendingEl) countPendingEl.textContent = pending;
    if (countCompletedEl) countCompletedEl.textContent = completed;

    // Atualiza barra de progresso
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
    }

    if (progressStat) {
        progressStat.textContent = `${completed} de ${total} concluída${total === 1 ? '' : 's'} (${percentage}%)`;
    }

    // Exibe ou oculta botão "Limpar concluídas"
    if (clearCompletedBtn) {
        clearCompletedBtn.style.display = completed > 0 ? 'inline-block' : 'none';
    }
}

// ==========================================================================
// Renderização do DOM
// ==========================================================================

/**
 * Renderiza as tarefas de acordo com o filtro selecionado.
 */
function renderTasks() {
    const allTasks = getTasksFromStorage();
    updateProgressAndCounters(allTasks);

    // Filtragem
    let filteredTasks = allTasks;
    if (currentFilter === 'pending') {
        filteredTasks = allTasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = allTasks.filter(t => t.completed);
    }

    // Limpa lista atual
    taskList.innerHTML = '';

    // Alterna visibilidade do Empty State
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Constrói cada elemento da lista
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        // Container esquerdo clicável (Checkbox + Texto)
        const leftContainer = document.createElement('div');
        leftContainer.className = 'task-left';
        leftContainer.title = task.completed ? 'Marcar como pendente' : 'Marcar como concluída';

        // Checkbox estilizado
        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox-custom';
        checkbox.setAttribute('role', 'checkbox');
        checkbox.setAttribute('aria-checked', task.completed ? 'true' : 'false');
        checkbox.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        // Texto da tarefa
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        leftContainer.appendChild(checkbox);
        leftContainer.appendChild(textSpan);

        // Alternar conclusão ao clicar no item
        leftContainer.addEventListener('click', () => {
            toggleTaskCompletion(task.id);
        });

        // Botão Vermelho Excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.type = 'button';
        deleteBtn.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);
        deleteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Excluir</span>
        `;

        // Evento de exclusão com animação de saída suave
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            removeTaskWithAnimation(li, task.id);
        });

        li.appendChild(leftContainer);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// ==========================================================================
// Operações da Tarefa (Adicionar, Alternar, Excluir)
// ==========================================================================

/**
 * Adiciona uma nova tarefa à lista e ao LocalStorage.
 */
function handleAddTask() {
    const rawValue = taskInput.value;
    const cleanText = rawValue.trim();

    // Validação estrita: campo vazio ou só espaços
    if (!cleanText) {
        showNotification('Por favor, digite uma tarefa antes de adicionar!');
        triggerInputError();
        return;
    }

    const tasks = getTasksFromStorage();

    const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: cleanText,
        completed: false,
        createdAt: Date.now()
    };

    // Insere no início da lista para acesso imediato
    tasks.unshift(newTask);
    saveTasksToStorage(tasks);

    // Reseta o formulário
    taskInput.value = '';
    taskInput.focus();

    // Se o filtro ativo for "Concluídas", muda para "Todas" para que a nova tarefa fique visível
    if (currentFilter === 'completed') {
        setFilter('all');
    } else {
        renderTasks();
    }
}

/**
 * Alterna o estado de conclusão (pendente/concluída) de uma tarefa.
 */
function toggleTaskCompletion(taskId) {
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToStorage(tasks);
        renderTasks();
    }
}

/**
 * Remove a tarefa com animação suave de saída antes do re-render.
 */
function removeTaskWithAnimation(element, taskId) {
    element.classList.add('removing');
    
    // Aguarda a animação do CSS terminar (220ms) antes de atualizar o estado
    setTimeout(() => {
        const tasks = getTasksFromStorage();
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage(updatedTasks);
        renderTasks();
    }, 220);
}

/**
 * Remove todas as tarefas já marcadas como concluídas.
 */
function clearAllCompleted() {
    const tasks = getTasksFromStorage();
    const remainingTasks = tasks.filter(t => !t.completed);
    saveTasksToStorage(remainingTasks);
    renderTasks();
}

/**
 * Altera o filtro ativo (todas, pendentes, concluídas).
 */
function setFilter(filterType) {
    currentFilter = filterType;
    filterTabs.forEach(tab => {
        if (tab.dataset.filter === filterType) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    renderTasks();
}

// ==========================================================================
// Formatação da Data Atual
// ==========================================================================

function updateHeaderDate() {
    if (!currentDateEl) return;
    try {
        const now = new Date();
        const formatted = now.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        currentDateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
        currentDateEl.textContent = 'Hoje';
    }
}

// ==========================================================================
// Inicialização de Eventos
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderDate();
    renderTasks();

    // Submissão do formulário (clique em Adicionar ou tecla Enter)
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddTask();
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleAddTask();
        });
    }

    // Atalhos de teclado no input
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskInput.value = '';
            taskInput.blur();
        }
    });

    // Filtros de visualização
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setFilter(tab.dataset.filter);
        });
    });

    // Limpar tarefas concluídas
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearAllCompleted);
    }
});
