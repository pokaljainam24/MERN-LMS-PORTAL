import React from 'react'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className='my-2'>
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        className={`text-sm font-medium relative py-2 px-3 md:px-4 rounded-full mr-2 ${activeTab.includes(tab.label)
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            } cursor-pointer`}
                        onClick={() => setActiveTab(tab.label)}
                    >
                        <div className="flex items-center">
                            <span className="text-xs">{tab.label}</span>
                            <span
                                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${activeTab === tab.label
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200/70 text-gray-600'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </div>
                        {activeTab === tab.label && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TaskStatusTabs
