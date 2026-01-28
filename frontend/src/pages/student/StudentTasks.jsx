import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  TrendingUp, Award, Zap, Filter, Plus,
  Calendar, Tag, Star, Users, Target,
  BarChart3, Download, Share2, Edit2,
  Trash2, ChevronDown, ChevronUp, Bell, BookOpen
} from 'lucide-react';

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, createdAt
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'assignment',
    estimatedTime: 60 // minutes
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
    pointsEarned: 0,
    streak: 0
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/student/tasks`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setStats(data.stats || {});
      } else {
        // Load mock data if API fails
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Database Systems Assignment',
        description: 'Complete all SQL queries for Chapter 5 and 6',
        dueDate: '2024-01-15',
        dueTime: '23:59',
        priority: 'high',
        category: 'assignment',
        estimatedTime: 120,
        points: 100,
        completed: false,
        overdue: false,
        createdAt: '2024-01-10',
        tags: ['SQL', 'Database', 'Important'],
        subject: 'Database Systems',
        attachments: 2
      },
      {
        id: 2,
        title: 'Data Structures Project',
        description: 'Implement Binary Search Tree with traversal algorithms',
        dueDate: '2024-01-18',
        dueTime: '17:00',
        priority: 'high',
        category: 'project',
        estimatedTime: 180,
        points: 150,
        completed: false,
        overdue: false,
        createdAt: '2024-01-08',
        tags: ['C++', 'Algorithms', 'Project'],
        subject: 'Data Structures',
        attachments: 1
      },
      {
        id: 3,
        title: 'Web Development Lab Report',
        description: 'Write report on React hooks and state management',
        dueDate: '2024-01-12',
        dueTime: '14:00',
        priority: 'medium',
        category: 'lab',
        estimatedTime: 90,
        points: 75,
        completed: true,
        overdue: false,
        createdAt: '2024-01-05',
        completedAt: '2024-01-11',
        tags: ['React', 'JavaScript', 'Lab'],
        subject: 'Web Development',
        attachments: 0
      },
      {
        id: 4,
        title: 'Operating Systems Quiz Preparation',
        description: 'Study process synchronization and deadlocks',
        dueDate: '2024-01-14',
        dueTime: '09:00',
        priority: 'medium',
        category: 'study',
        estimatedTime: 60,
        points: 50,
        completed: false,
        overdue: false,
        createdAt: '2024-01-10',
        tags: ['OS', 'Theory', 'Quiz'],
        subject: 'Operating Systems',
        attachments: 0
      },
      {
        id: 5,
        title: 'Networking Assignment',
        description: 'Complete TCP/IP protocol analysis questions',
        dueDate: '2024-01-10',
        dueTime: '23:59',
        priority: 'high',
        category: 'assignment',
        estimatedTime: 45,
        points: 80,
        completed: false,
        overdue: true,
        createdAt: '2024-01-03',
        tags: ['Networking', 'TCP/IP', 'Urgent'],
        subject: 'Computer Networks',
        attachments: 1
      },
      {
        id: 6,
        title: 'Software Engineering Presentation',
        description: 'Prepare slides on Agile methodology',
        dueDate: '2024-01-20',
        dueTime: '10:30',
        priority: 'low',
        category: 'presentation',
        estimatedTime: 120,
        points: 90,
        completed: false,
        overdue: false,
        createdAt: '2024-01-09',
        tags: ['Agile', 'Presentation', 'Team'],
        subject: 'Software Engineering',
        attachments: 3
      }
    ];

    setTasks(mockTasks);
    
    // Calculate stats
    const total = mockTasks.length;
    const completed = mockTasks.filter(t => t.completed).length;
    const pending = mockTasks.filter(t => !t.completed && !t.overdue).length;
    const overdue = mockTasks.filter(t => t.overdue).length;
    
    setStats({
      total,
      completed,
      pending,
      overdue,
      completionRate: Math.round((completed / total) * 100),
      pointsEarned: mockTasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0),
      streak: 3 // This would come from API
    });
  };

  const handleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      // API call to mark as complete
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/student/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        // Update local state
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed, completedAt: new Date().toISOString() } : t
        ));
        
        // Update stats
        const wasCompleted = task.completed;
        setStats(prev => ({
          ...prev,
          completed: wasCompleted ? prev.completed - 1 : prev.completed + 1,
          pending: wasCompleted ? prev.pending + 1 : prev.pending - 1,
          pointsEarned: wasCompleted ? prev.pointsEarned - task.points : prev.pointsEarned + task.points,
          completionRate: Math.round(((!wasCompleted ? prev.completed + 1 : prev.completed - 1) / prev.total) * 100)
        }));

        // Show success message
        showNotification(
          wasCompleted ? 'Task marked as pending' : 'Task completed!',
          wasCompleted 
            ? `${task.title} moved back to pending`
            : `🎉 +${task.points} points earned!`
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      // API call to create task
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/student/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        const createdTask = await res.json();
        setTasks(prev => [createdTask, ...prev]);
        setShowCreateModal(false);
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          category: 'assignment',
          estimatedTime: 60
        });

        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          completionRate: Math.round((prev.completed / (prev.total + 1)) * 100)
        }));

        showNotification('Task created', 'New task added to your list');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/student/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        const task = tasks.find(t => t.id === taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          completed: task.completed ? prev.completed - 1 : prev.completed,
          pending: !task.completed ? prev.pending - 1 : prev.pending,
          overdue: task.overdue ? prev.overdue - 1 : prev.overdue,
          completionRate: prev.total - 1 === 0 ? 0 : Math.round((prev.completed / (prev.total - 1)) * 100)
        }));

        showNotification('Task deleted', 'Task removed from your list');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const showNotification = (title, message) => {
    // In a real app, you'd use a toast notification library
    console.log(`${title}: ${message}`);
    // For now, we'll just log it
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'overdue') return task.overdue;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-rose-500';
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'low': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'assignment': return <FileText size={16} />;
      case 'project': return <Target size={16} />;
      case 'lab': return <BarChart3 size={16} />;
      case 'study': return <BookOpen size={16} />;
      case 'presentation': return <Users size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Tasks</p>
              <p className="text-3xl font-bold mt-2 text-blue-400">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30">
              <FileText className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {stats.completed} completed • {stats.pending} pending
          </p>
        </div>


        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Completion Rate</p>
              <p className="text-3xl font-bold mt-2 text-emerald-400">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Points Earned */}
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Points Earned</p>
              <p className="text-3xl font-bold mt-2 text-amber-400">{stats.pointsEarned}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30">
              <Award className="text-amber-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {Math.floor(stats.pointsEarned / 100)} levels • {stats.pointsEarned % 100}/100 to next
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Task Streak</p>
              <p className="text-3xl font-bold mt-2 text-purple-400">{stats.streak} days</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30">
              <Zap className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="flex gap-1 mt-4">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < stats.streak 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-slate-700/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>


        {/* Filters & Controls */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left Side: Title & Stats */}
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div>
                <h3 className="text-xl font-semibold text-white">Your Tasks</h3>
                <p className="text-sm text-slate-400">
                  {filteredTasks.length} of {tasks.length} tasks shown
                </p>
              </div>
              
              {/* Mobile-only "New Task" button (Optional, hidden on desktop) */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="lg:hidden p-2 bg-green-500 rounded-lg text-white"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Right Side: Filters, Sort, Export, and Create Button */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Filter Buttons Group */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['all', 'pending', 'completed', 'overdue'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filter === filterOption
                        ? filterOption === 'all' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          filterOption === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          filterOption === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                ))}
              </div>

              <div className="h-8 w-[1px] bg-slate-700 hidden sm:block mx-1" />

              {/* Sort Dropdown */}
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 appearance-none pr-10"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="createdAt">Sort by Created Date</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
              </div>

              {/* Export Button */}
              <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Primary Action: New Task */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="hidden lg:flex px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all items-center gap-2"
              >
                <Plus size={18} />
                New Task
              </button>

            </div>
          </div>
        </div>




      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
              <FileText className="text-slate-500" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all' 
                ? "You're all caught up! Create a new task to get started."
                : `No ${filter} tasks at the moment.`
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border transition-all hover:scale-[1.005] ${
                task.completed 
                  ? 'border-emerald-700/30 bg-gradient-to-r from-emerald-900/10 to-green-900/10'
                  : task.overdue
                  ? 'border-red-700/30 bg-gradient-to-r from-red-900/10 to-rose-900/10'
                  : 'border-slate-700/50 hover:border-slate-600/70'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Completion Checkbox */}
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500'
                      : 'border-slate-600 hover:border-emerald-500'
                  }`}
                >
                  {task.completed && <CheckCircle size={14} className="text-white" />}
                </button>
                
                {/* Task Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)} text-white`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.overdue && !task.completed && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                            OVERDUE
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-400 mb-4">{task.description}</p>
                      
                      {/* Tags & Metadata */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          <Calendar size={14} />
                          <span>Due: {task.dueDate} • {task.dueTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          <Clock size={14} />
                          <span>{task.estimatedTime} mins</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          <Tag size={14} />
                          <span>{task.subject}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-amber-400">
                          <Award size={14} />
                          <span>+{task.points} pts</span>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex gap-1">
                          {task.tags?.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!task.completed && (
                        <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                          <Edit2 size={16} className="text-slate-300" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                      <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Share2 size={16} className="text-blue-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar for Estimated Time */}
                  {!task.completed && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Estimated Completion</span>
                        <span className="text-slate-400">{formatDate(task.dueDate)}</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPriorityColor(task.priority)}`}
                          style={{ 
                            width: `${Math.min(
                              100, 
                              (Date.now() - new Date(task.createdAt).getTime()) / 
                              (new Date(task.dueDate).getTime() - new Date(task.createdAt).getTime()) * 100
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-2xl font-bold text-white">Create New Task</h3>
              <p className="text-slate-400 mt-1">Add a new task to your academic workload</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., Complete Database Assignment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Describe the task details..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                      <option value="lab">Lab Work</option>
                      <option value="study">Study</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 60})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};



export default StudentTasks;