import React, { useEffect, useState } from "react";
import Dashboardlayout from "../../components/layouts/Dashboardlayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

function ManageTasks() {
  /* ---------- state ---------- */
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  /* ---------- API ---------- */
  const getAllTasks = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: { status: filterStatus === "All" ? "" : filterStatus },
        }
      );

      /* tasks */
      setAllTasks(data?.tasks ?? []);

      /* tabs */
      const s = data?.statusSummary || {};
      setTabs([
        { label: "All", count: s.totalTasks ?? s.all ?? 0 },
        { label: "Pending", count: s.pending ?? s.pendingTasks ?? 0 },
        { label: "In Progress", count: s.inProgress ?? s.inProgressTasks ?? 0 },
        { label: "Completed", count: s.completed ?? s.completedTasks ?? 0 },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- effects ---------- */
  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  /* ---------- handlers ---------- */
  const handleClick = (task) =>
    navigate("/admin/create-task", { state: { taskId: task._id } });

  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  /* ---------- render ---------- */
  return (
    <Dashboardlayout activeMenu="Manage Tasks">
      <div className="my-5">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">My Tasks</h2>

            {/* mobile download */}
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {/* tabs + desktop download */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        {/* task grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((task) => {
            const checklist = task.todoChecklist || [];

            /* count completed items; fall back to "all" if task itself is completed */
            const completed = task.status === "Completed"
              ? checklist.length
              : checklist.filter(
                (t) =>
                  t.completed === true ||
                  t.isCompleted === true ||
                  t.done === true ||
                  t.status === "Completed" ||
                  t.status === "Done"
              ).length;

            return (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAT={task.createdAT}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo?.map((u) => u.profileImageUrl)}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={completed}
                todoChecklist={checklist}
                onClick={() => handleClick(task)}
              />
            );
          })}
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default ManageTasks;
