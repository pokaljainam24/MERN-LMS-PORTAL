import React, { useEffect, useState } from 'react';
import Dashboardlayout from '../../components/layouts/Dashboardlayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import { PRIORITY_DATA } from '../../utils/data';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import Model from '../../components/Model';
import DeleteAlert from '../../components/DeleteAlert';

function Createtask() {
  // ────────────────────────────────────────────────────────────
  // router helpers
  // ────────────────────────────────────────────────────────────
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  // ────────────────────────────────────────────────────────────
  // component state
  // ────────────────────────────────────────────────────────────
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // ────────────────────────────────────────────────────────────
  // helpers
  // ────────────────────────────────────────────────────────────
  const handleValueChange = (key, value) => setTaskData(prev => ({ ...prev, [key]: value }));

  const clearData = () =>
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });

  // ────────────────────────────────────────────────────────────
  // CRUD stubs (connect to API later)
  // ────────────────────────────────────────────────────────────
  // Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Expense Details deleted successfully");
      navigate('/admin/tasks');
    } catch (error) {
      console.error("Error deleting task:", error.response?.data?.message || error.message);
    }
  };

  // ────────────────────────────────────────────────────────────
  // submit handler
  // ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setError('');

    if (!taskData.title.trim()) return setError('Please enter a title');
    if (!taskData.description.trim()) return setError('Please enter a description');
    if (!taskData.dueDate) return setError('Please enter a due date');
    if (taskData.assignedTo.length === 0)
      return setError('Task not assigned to any member');
    if (taskData.todoChecklist.length === 0)
      return setError('Add at least one todo task');

    taskId ? updateTask() : createTask();
  };

  // ────────────────────────────────────────────────────────────
  // get Task info by ID
  // ────────────────────────────────────────────────────────────
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }

    return () => { };
  }, [taskId]);

  // ────────────────────────────────────────────────────────────
  // render components
  // ────────────────────────────────────────────────────────────
  return (
    <Dashboardlayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            {/* header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input
                className="form-input"
                placeholder="Create App UI"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            {/* description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe task"
                value={taskData.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
              />
            </div>

            {/* priority / date / users */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(v) => handleValueChange('priority', v)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange('dueDate', target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(v) => handleValueChange('assignedTo', v)}
                />
              </div>
            </div>

            {/* checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(v) => handleValueChange('todoChecklist', v)}
              />
            </div>

            {/* attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(v) => handleValueChange('attachments', v)}
              />
            </div>

            {/* errors */}
            {error && <p className="text-xs text-red-500 mt-5">{error}</p>}

            {/* submit */}
            <div className="flex justify-end mt-7">
              <button
                type="button"
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Model
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Model>
    </Dashboardlayout >
  );
}

export default Createtask;
