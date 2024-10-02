

import React, { useState, useCallback } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { Trash2 } from 'lucide-react';

const initialTasks = {
  urgentImportant: [],
  importantNotUrgent: [],
  urgentNotImportant: [],
  notUrgentNotImportant: []
};

const quadrantInfo = {
  urgentImportant: { title: 'Urgent & Important', action: 'Do it now', icon: '🎃' },
  importantNotUrgent: { title: 'Important, Not Urgent', action: 'Schedule it', icon: '🕷️' },
  urgentNotImportant: { title: 'Urgent, Not Important', action: 'Delegate if possible', icon: '👻' },
  notUrgentNotImportant: { title: 'Not Urgent, Not Important', action: 'Eliminate or postpone', icon: '🦇' }
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks(prev => ({
        ...prev,
        notUrgentNotImportant: [...prev.notUrgentNotImportant, { id: Date.now().toString(), content: newTask }]
      }));
      setNewTask('');
    }
  };

  const deleteTask = useCallback((listId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [listId]: prev[listId].filter(task => task.id !== taskId)
    }));
  }, []);

  const onDragStart = (e, id, sourceList) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, sourceList }));
    setDraggedTask({ id, sourceList });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetList) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { id, sourceList } = data;

    if (sourceList === targetList) return;

    setTasks(prev => {
      const updatedTasks = { ...prev };
      const taskIndex = updatedTasks[sourceList].findIndex(task => task.id === id);
      const [movedTask] = updatedTasks[sourceList].splice(taskIndex, 1);
      updatedTasks[targetList].push(movedTask);
      return updatedTasks;
    });
  };

  const renderList = (listId, title, action, icon) => (
    <Card 
      className="bg-purple-200 text-purple-900 p-2 h-full border-2 border-purple-400 shadow-lg"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, listId)}
    >
      <CardHeader className="font-bold text-sm flex items-center space-x-2 p-2">
        <span className="text-xl">{icon}</span>
        <div>
          <div>{title}</div>
          <div className="text-xs font-normal text-purple-700">{action}</div>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto" style={{maxHeight: "calc(100vh - 250px)"}}>
        {tasks[listId].map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, listId)}
            className="bg-white p-1 mb-1 rounded shadow cursor-move hover:bg-purple-100 transition-colors text-sm flex justify-between items-center"
          >
            <span>{task.content}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 p-1"
              onClick={() => deleteTask(listId, task.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 bg-purple-900 text-purple-100 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-center">🎃 Spooky Task Matrix 👻</h1>
      <div className="mb-2 flex">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="mr-2 bg-purple-800 text-white placeholder-purple-300 border-purple-600"
        />
        <Button onClick={addTask} variant="outline" className="bg-purple-700 text-purple-100 hover:bg-purple-600 border-purple-500">
          Add
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-grow">
        {Object.entries(quadrantInfo).map(([listId, { title, action, icon }]) => (
          renderList(listId, title, action, icon)
        ))}
      </div>
    </div>
  );
}

export default App;