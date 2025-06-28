import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Settings from "@/components/pages/Settings";
import Dashboard from "@/components/pages/Dashboard";
import VoiceNotes from "@/components/pages/VoiceNotes";
import AIReader from "@/components/pages/AIReader";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/voice-notes" element={<VoiceNotes />} />
            <Route path="/ai-reader" element={<AIReader />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-center"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={true}
          theme="light"
          toastClassName="toast-apple"
          bodyClassName="toast-body-apple"
          closeButton={false}
        />
      </div>
    </Router>
  );
}

export default App;