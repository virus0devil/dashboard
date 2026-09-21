import React, { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  List,
  FolderKanban,
  Ellipsis,
  ChevronDown,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    path: "/",
  },
  {
    id: "asset-management",
    icon: List,
    label: "Asset Management",
    submenus: [
      {
        id: "assessment_type",
        icon: LayoutDashboard,
        path: "/assessment",
        label: "Assessment Type",
      },
      {
        id: "mastervulnerabilities",
        icon: LayoutDashboard,
        path: "/master_vulnerabilities",
        label: "Master Vulnerabilities",
      },
      {
        id: "compliance_type",
        icon: LayoutDashboard,
        path: "/compliance",
        label: "Compliance Type",
      },
    ],
  },
  {
    id: "pentest-management",
    icon: Ellipsis,
    label: "Pentest Management",
    submenus: [
      {
        id: "inprogress",
        icon: Ellipsis,
        path: "/pentest/inprogress",
        label: "In-Progress",
      },
      {
        id: "completed_projects",
        icon: LayoutDashboard,
        path: "/pentest/complete",
        label: "Completed Projects",
      },
    ],
  },
  {
    id: "project_management",
    icon: FolderKanban,
    label: "Project Management",
    submenus: [
      {
        id: "onboard_client",
        icon: Ellipsis,
        path: "/onboard_client",
        label: "On-board Clients",
      },
      {
        id: "manage_clients",
        icon: LayoutDashboard,
        path: "/manage_client",
        label: "Manage Clients",
      },
    ],
  },
  {
    id: "employee_management",
    icon: User,
    label: "Employee Management",
    submenus: [
      {
        id: "manage_roles",
        icon: Ellipsis,
        path: "/manage_roles",
        label: "Roles Management",
      },
      {
        id: "team_management",
        icon: LayoutDashboard,
        path: "/team_management",
        label: "Team Management",
      },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Store which menus are expanded
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <div className="w-70 shrink-0 transition duration-300 ease-in-out bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col relative z-10">

      {/* Logo */}
      <div className="p-6 border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>

          <div className="text-xl font-bold text-slate-800 min-w-0">
            <h1 className="truncate">Company Name</h1>
            <p className="text-xs text-slate-500 truncate">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-w-0 mt-3 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const hasSubmenus = item.submenus && item.submenus.length > 0;
          const isMainActive =
            !hasSubmenus && item.path === location.pathname;

          return (
            <div key={item.id} className="w-full min-w-0">
              <button
                className={`cursor-pointer w-full min-w-0 flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isMainActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-indigo-50 hover:text-indigo-600 text-gray-700"
                  }`}
                onClick={() => {
                  if (hasSubmenus) {
                    toggleMenu(item.id);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <div className="flex items-center space-x-3 min-w-0 overflow-hidden">
                  <item.icon className="w-5 h-5 shrink-0" />

                  <span className="font-medium ml-2 text-sm truncate">
                    {item.label}
                  </span>
                </div>

                {hasSubmenus && (
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus[item.id] ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {hasSubmenus && openMenus[item.id] && (
                <div className="ml-8 mt-2 space-y-1 min-w-0 w-auto overflow-hidden">
                  {item.submenus.map((submenu) => {
                    const isSubmenuActive =
                      submenu.path === location.pathname;

                    return (
                      <button
                        key={submenu.id}
                        onClick={() => {
                          if (submenu.path) {
                            navigate(submenu.path);
                          }
                        }}
                        className={`cursor-pointer p-3 font-medium w-full min-w-0 max-w-full text-left px-5 text-sm rounded-xl transition-all duration-200 ${isSubmenuActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 w-full">
                          <submenu.icon className="w-4 h-4 shrink-0" />

                          <span className="truncate">
                            {submenu.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;