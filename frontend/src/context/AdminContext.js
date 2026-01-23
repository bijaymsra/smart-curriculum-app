import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin from sessionStorage on mount
  useEffect(() => {
    const loadAdmin = () => {
      try {
        const adminData = {
          adminId: sessionStorage.getItem("adminId"),
          email: sessionStorage.getItem("adminEmail"),
          fullName: sessionStorage.getItem("adminName"),
          institutionName: sessionStorage.getItem("institutionName"),
          status: sessionStorage.getItem("adminStatus"),
          institutionId: sessionStorage.getItem("institutionId") 
        };
        
        // Only set admin if we have an ID
        if (adminData.adminId) {
          setAdmin(adminData);
        }
      } catch (e) {
        console.error("Error loading admin from sessionStorage:", e);
      }
      setLoading(false);
    };
    
    loadAdmin();
  }, []);

  // Function to update admin data (call this after login)
  const updateAdmin = (adminData) => {
    // Store in sessionStorage
    sessionStorage.setItem("adminId", adminData.id);
    sessionStorage.setItem("adminEmail", adminData.email);
    sessionStorage.setItem("adminName", adminData.fullName);
    sessionStorage.setItem("institutionName", adminData.institution?.name || "");
    sessionStorage.setItem("adminStatus", adminData.status || "");
    sessionStorage.setItem("institutionId", adminData.institution?.id || "");
    
    // Update state
    setAdmin({
      adminId: adminData.id,
      email: adminData.email,
      fullName: adminData.fullName,
      institutionName: adminData.institution?.name || "",
      status: adminData.status || "",
      institutionId: adminData.institution?.id || ""
    });
  };

  const logout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem("adminId");
    sessionStorage.removeItem("adminEmail");
    sessionStorage.removeItem("adminName");
    sessionStorage.removeItem("institutionName");
    sessionStorage.removeItem("adminStatus");
    sessionStorage.removeItem("institutionId");
    
    // Clear state
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, updateAdmin, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);