import React, { useState } from 'react';
import '../dashboard.css';
import CreateProjectModal from './CreateProjectModal';
import AddTeamModal from './AddTeamModal';
import CreateTaskModal from './CreateTaskModal';
import EditSprintModal from './EditSprintModal';
import DeleteSprintModal from './DeleteSprintModal';
import ViewTaskModal from './ViewTaskModal';

const mockProjects = [
    { label: 'Active Projects', value: 7, color: 'blue' },
    { label: 'Tasks in Progress', value: 12, color: 'yellow' },
    { label: 'Pending Review', value: 5, color: 'purple' },
    { label: 'In Production', value: 18, color: 'green' },
];

const mockTasks = [
    { id: 1, title: 'Design homepage', assignee: 'Ahmed Ali', status: 'In Progress', priority: 'High', sprint: 'Sprint 1' },
    { id: 2, title: 'Setup database', assignee: 'Sara Mohamed', status: 'Completed', priority: 'Medium', sprint: 'Sprint 1' },
    { id: 3, title: 'Design onboarding', assignee: 'Youssef Khaled', status: 'To Do', priority: 'Low', sprint: 'Sprint 2' },
    { id: 4, title: 'Create landing page', assignee: 'Nour Hassan', status: 'In Progress', priority: 'High', sprint: 'Sprint 2' },
    { id: 5, title: 'Setup CI/CD', assignee: 'Ali Omar', status: 'To Do', priority: 'Medium', sprint: 'Sprint 1' },
];

const mockSprints = [
    {
        id: 1,
        name: 'Sprint 1',
        startDate: '2026-03-01',
        endDate: '2026-03-14',
        status: 'Active',
        tasks: [
            { id: 1, title: 'Mobile UI Redesign', storyPts: 8, backend: '✅', qa: '✅', done: '✅' },
            { id: 2, title: 'API Integration - Auth', storyPts: 5, backend: '✅', qa: '🔄', done: '⏳' },
            { id: 3, title: 'Database Schema Update', storyPts: 3, backend: '✅', qa: '✅', done: '⏳' },
        ],
    },
    {
        id: 2,
        name: 'Sprint 2',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'Planned',
        tasks: [
            { id: 4, title: 'Notification System', storyPts: 5, backend: '⏳', qa: '⏳', done: '⏳' },
            { id: 5, title: 'Mobile App Redesign', storyPts: 13, backend: '⏳', qa: '⏳', done: '⏳' },
        ],
    },
];

const mockKanboard = {
    todo: [
        { id: 1, title: 'Setup CI/CD Pipeline', assignee: 'Ali Omar', date: 'Mar 10' },
        { id: 2, title: 'Write unit tests', assignee: 'Sara Mohamed', date: 'Mar 11' },
    ],
    inprogress: [
        { id: 3, title: 'Design homepage layout', assignee: 'Ahmed Ali', date: 'Mar 9' },
        { id: 4, title: 'Create landing page', assignee: 'Nour Hassan', date: 'Mar 8' },
    ],
    completed: [
        { id: 5, title: 'Setup database schema', assignee: 'Sara Mohamed', date: 'Mar 5' },
        { id: 6, title: 'Auth API endpoints', assignee: 'Youssef Khaled', date: 'Mar 6' },
    ],
};

const mockTeamMembers = [
    { id: 1, name: 'Ahmed Ali', role: 'Frontend Developer' },
    { id: 2, name: 'Sara Mohamed', role: 'Backend Developer' },
    { id: 3, name: 'Youssef Khaled', role: 'QA Engineer' },
    { id: 4, name: 'Nour Hassan', role: 'UI/UX Designer' },
    { id: 5, name: 'Ali Omar', role: 'DevOps Engineer' },
];

const Dashboard = () => {
    const [activeView, setActiveView] = useState('overview');
    const [expandedSprints, setExpandedSprints] = useState([1]);

    // Modal states
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [editingSprint, setEditingSprint] = useState(null);
    const [deletingSprint, setDeletingSprint] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);

    // Data states
    const [tasks, setTasks] = useState(mockTasks);
    const [sprints, setSprints] = useState(mockSprints);
    const [teamMembers, setTeamMembers] = useState(mockTeamMembers);

    const toggleSprint = (id) => {
        setExpandedSprints(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleCreateProject = (project) => {
        setIsCreateProjectOpen(false);
    };

    const handleAddTask = (task) => {
        const newTask = {
            ...task,
            id: tasks.length + 1,
            status: 'To Do',
        };
        setTasks([...tasks, newTask]);
        setIsCreateTaskOpen(false);
    };

    const handleEditSprint = (sprint) => {
        setSprints(prev => prev.map(s => s.id === sprint.id ? { ...s, ...sprint } : s));
        setEditingSprint(null);
    };

    const handleDeleteSprint = (sprintId) => {
        setSprints(prev => prev.filter(s => s.id !== sprintId));
        setDeletingSprint(null);
    };

    const handleAddSprint = () => {
        const newSprint = {
            id: sprints.length + 1,
            name: `Sprint ${sprints.length + 1}`,
            startDate: '2026-04-01',
            endDate: '2026-04-14',
            status: 'Planned',
            tasks: [],
        };
        setSprints([...sprints, newSprint]);
    };

    return (
        <div className="content-area">
            {/* Welcome */}
            <div className="dashboard-welcome">
                <h1>Welcome Ahmed!</h1>
                <p>Here's what's happening with your projects today.</p>
            </div>

            {/* View Tabs */}
            <div className="dashboard-view-tabs">
                <button className={`view-tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>
                    Overview
                </button>
                <button className={`view-tab ${activeView === 'board' ? 'active' : ''}`} onClick={() => setActiveView('board')}>
                    Board
                </button>
            </div>

            {/* ====================== OVERVIEW VIEW ====================== */}
            {activeView === 'overview' && (
                <>
                    {/* Projects Overview */}
                    <div className="projects-overview">
                        <h2>Projects Overview</h2>
                        <div className="overview-cards">
                            {mockProjects.map((item, i) => (
                                <div className="overview-card" key={i}>
                                    <div className={`overview-card-icon ${item.color}`}>
                                        {item.color === 'blue' && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        )}
                                        {item.color === 'yellow' && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        )}
                                        {item.color === 'purple' && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                        {item.color === 'green' && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                        )}
                                    </div>
                                    <div className="overview-card-info">
                                        <h3>{item.value}</h3>
                                        <p>{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Charts */}
                    <div className="team-charts">
                        <div className="team-chart-card">
                            <h3>Teams Chart</h3>
                            <div className="chart-circle blue">
                                <span className="chart-circle-inner">75%</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>5 Active Teams</p>
                        </div>
                        <div className="team-chart-card">
                            <h3>Backlogs Chart</h3>
                            <div className="chart-circle yellow">
                                <span className="chart-circle-inner">60%</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>12 Items</p>
                        </div>
                        <div className="team-chart-card">
                            <h3>Tasks Chart</h3>
                            <div className="chart-circle green">
                                <span className="chart-circle-inner">85%</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>42 Tasks</p>
                        </div>
                    </div>

                    {/* Dashboard Actions */}
                    <div className="dashboard-actions">
                        <button className="create-btn" onClick={() => setIsCreateProjectOpen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Create Project
                        </button>
                        <button className="create-btn" style={{ background: '#41c875', boxShadow: '0 4px 12px rgba(65,200,117,0.2)' }} onClick={() => setIsAddTeamOpen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Add Team
                        </button>
                    </div>

                    {/* All Tasks Table */}
                    <div className="tasks-section">
                        <h2>All Active Tasks</h2>
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Assigned To</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id} onClick={() => setViewingTask(task)} style={{ cursor: 'pointer' }}>
                                        <td style={{ fontWeight: 500 }}>{task.title}</td>
                                        <td>
                                            <div className="task-assignee">
                                                <img className="task-assignee-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=E2E8F0&color=475569&size=28`} alt={task.assignee} />
                                                {task.assignee}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${task.status === 'To Do' ? 'status-todo' : task.status === 'In Progress' ? 'status-inprogress' : 'status-completed'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`priority-badge ${task.priority === 'High' ? 'priority-high' : task.priority === 'Medium' ? 'priority-medium' : 'priority-low'}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Reports */}
                    <div className="reports-section">
                        <h2>Reports & Insights</h2>
                        <div className="reports-grid">
                            <div className="report-card">
                                <div className="report-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                </div>
                                <span>Task Progress</span>
                            </div>
                            <div className="report-card">
                                <div className="report-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                                </div>
                                <span>Sprint Velocity</span>
                            </div>
                            <div className="report-card">
                                <div className="report-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <span>Team Performance</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ====================== BOARD VIEW ====================== */}
            {activeView === 'board' && (
                <>
                    {/* Board Header */}
                    <div className="board-header">
                        <h2>Add Board</h2>
                        <p>Track development progress, manage sprints and collaborate with your team effectively. Use the board view to organize tasks into sprints and track their status.</p>
                    </div>

                    {/* Toolbar */}
                    <div className="board-toolbar">
                        <input className="search-input" type="text" placeholder="Search tasks..." />
                        <button className="toolbar-btn" onClick={() => setIsCreateTaskOpen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Task
                        </button>
                        <button className="toolbar-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Filter
                        </button>
                        <button className="toolbar-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            All Members
                        </button>
                    </div>

                    {/* Sprint Cards */}
                    <div className="sprints-section">
                        {sprints.map(sprint => (
                            <div className="sprint-card" key={sprint.id}>
                                <div className="sprint-header" onClick={() => toggleSprint(sprint.id)}>
                                    <div className="sprint-header-left">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedSprints.includes(sprint.id) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                        <h3>{sprint.name}</h3>
                                        <span className="sprint-date">{sprint.startDate} → {sprint.endDate}</span>
                                        <span className={`status-badge ${sprint.status === 'Active' ? 'status-inprogress' : 'status-todo'}`}>{sprint.status}</span>
                                    </div>
                                    <div className="sprint-header-right" onClick={e => e.stopPropagation()}>
                                        <button className="sprint-action-btn edit" onClick={() => setEditingSprint(sprint)}>
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Edit
                                        </button>
                                        <button className="sprint-action-btn delete" onClick={() => setDeletingSprint(sprint)}>
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {expandedSprints.includes(sprint.id) && (
                                    <table className="sprint-tasks-table">
                                        <thead>
                                            <tr>
                                                <th>Task</th>
                                                <th>Story Pts</th>
                                                <th>Backend</th>
                                                <th>QA</th>
                                                <th>Done</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sprint.tasks.map(task => (
                                                <tr key={task.id}>
                                                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                                                    <td>{task.storyPts}</td>
                                                    <td>{task.backend}</td>
                                                    <td>{task.qa}</td>
                                                    <td>{task.done}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))}

                        <button className="add-sprint-btn" onClick={handleAddSprint}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Sprint
                        </button>
                    </div>

                    {/* Kanboard */}
                    <div className="kanboard">
                        {/* To Do */}
                        <div className="kanboard-column">
                            <div className="kanboard-column-header todo">
                                <h3>To Do <span className="kanboard-count">{mockKanboard.todo.length}</span></h3>
                            </div>
                            {mockKanboard.todo.map(card => (
                                <div className="kanboard-card" key={card.id} onClick={() => setViewingTask({ title: card.title, assignee: card.assignee, status: 'To Do', priority: 'Medium', sprint: 'Sprint 1' })}>
                                    <div className="kanboard-card-title">{card.title}</div>
                                    <div className="kanboard-card-meta">
                                        <div className="kanboard-card-assignee">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(card.assignee)}&background=E2E8F0&color=475569&size=22`} alt={card.assignee} />
                                            {card.assignee}
                                        </div>
                                        <span className="kanboard-card-date">{card.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* In Progress */}
                        <div className="kanboard-column">
                            <div className="kanboard-column-header inprogress">
                                <h3>In Progress <span className="kanboard-count">{mockKanboard.inprogress.length}</span></h3>
                            </div>
                            {mockKanboard.inprogress.map(card => (
                                <div className="kanboard-card" key={card.id} onClick={() => setViewingTask({ title: card.title, assignee: card.assignee, status: 'In Progress', priority: 'High', sprint: 'Sprint 1' })}>
                                    <div className="kanboard-card-title">{card.title}</div>
                                    <div className="kanboard-card-meta">
                                        <div className="kanboard-card-assignee">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(card.assignee)}&background=E2E8F0&color=475569&size=22`} alt={card.assignee} />
                                            {card.assignee}
                                        </div>
                                        <span className="kanboard-card-date">{card.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Completed */}
                        <div className="kanboard-column">
                            <div className="kanboard-column-header completed">
                                <h3>Completed <span className="kanboard-count">{mockKanboard.completed.length}</span></h3>
                            </div>
                            {mockKanboard.completed.map(card => (
                                <div className="kanboard-card" key={card.id} onClick={() => setViewingTask({ title: card.title, assignee: card.assignee, status: 'Completed', priority: 'Low', sprint: 'Sprint 1' })}>
                                    <div className="kanboard-card-title">{card.title}</div>
                                    <div className="kanboard-card-meta">
                                        <div className="kanboard-card-assignee">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(card.assignee)}&background=E2E8F0&color=475569&size=22`} alt={card.assignee} />
                                            {card.assignee}
                                        </div>
                                        <span className="kanboard-card-date">{card.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} onSubmit={handleCreateProject} />
            <AddTeamModal isOpen={isAddTeamOpen} onClose={() => setIsAddTeamOpen(false)} members={teamMembers} />
            <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} onSubmit={handleAddTask} />
            <EditSprintModal sprint={editingSprint} isOpen={!!editingSprint} onClose={() => setEditingSprint(null)} onSubmit={handleEditSprint} />
            <DeleteSprintModal sprint={deletingSprint} isOpen={!!deletingSprint} onClose={() => setDeletingSprint(null)} onDelete={handleDeleteSprint} />
            <ViewTaskModal task={viewingTask} isOpen={!!viewingTask} onClose={() => setViewingTask(null)} />
        </div>
    );
};

export default Dashboard;
