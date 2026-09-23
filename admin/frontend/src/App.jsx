import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Layouts/Sidebar'
import Header from './components/Layouts/Header'
import { AssessmentCategory } from './components/Layouts/Pages/asset_management/AssessmentCategory'
import { ComplianceCategory } from './components/Layouts/Pages/asset_management/ComplianceCategory'
// import PentestLoader from './components/loading/PentestLoader'


function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Dashboard />} /> */}
      <Route path="/assessment" element={<AssessmentCategory />} />
      {/* <Route path="/master_vulnerabilities" element={<MasterVulnerabilities />} /> */}
      <Route path="/compliance" element={<ComplianceCategory />} />
      {/* <Route path="/pentest/inprogress" element={<InProgress />} />
      <Route path="/pentest/completed_projects" element={<CompletedProjects />} />
      <Route path="/onboard_client" element={<OnboardClient />} />
      <Route path="/manage_client" element={<ManageClient />} />
      <Route path="/manage_roles" element={<RolesManagement />} />
      <Route path="/team_management" element={<TeamManagement />} />  */}
    </Routes>
  )
}


function App() {

  const [loading, setLoading] = useState(true)

  return (
    <>
      {/* {loading && (
        <PentestLoader
          duration={4500}
          onComplete={() => setLoading(false)}
        />
      )} */}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <AppRoutes />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default App