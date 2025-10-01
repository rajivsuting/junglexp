"use client";

import { authClient, authHelpers } from "@repo/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  userRole: "user" | "admin" | "super_admin";
  isActive: boolean;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (data: SignUpData) => Promise<any>;
  signOut: () => Promise<void>;
  
  // Social authentication
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  
  // User management
  updateUser: (data: UpdateUserData) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
  deleteAccount: () => Promise<void>;
  
  // Email operations
  sendPasswordResetEmail: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: () => Promise<any>;
  
  // Role and permission helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  canAccess: (requiredRole: "user" | "admin" | "super_admin") => boolean;
  
  // User info helpers
  getFullName: () => string;
  getInitials: () => string;
  getDisplayName: () => string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface UpdateUserData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  image?: string;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (sessionData?.data?.session && sessionData?.data?.user) {
          setSession(sessionData.data.session);
          setUser(sessionData.data.user);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = authClient.onSessionChange((session, user) => {
      setSession(session);
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await authClient.signIn.email({
        email,
        password,
      });
      
      if (result.data?.session && result.data?.user) {
        setSession(result.data.session);
        setUser(result.data.user);
        toast.success("Signed in successfully!");
      }
      
      return result;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const result = await authClient.signUp.email(data);
      
      if (result.data) {
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
      
      return result;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut();
      setSession(null);
      setUser(null);
      toast.success("Signed out successfully!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Social authentication
  const signInWithGithub = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error: any) {
      console.error("GitHub sign in error:", error);
      toast.error("Failed to sign in with GitHub");
      setIsLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
      throw error;
    }
  };

  // User management
  const updateUser = async (data: UpdateUserData) => {
    try {
      const result = await authClient.updateUser(data);
      if (result.data?.user) {
        setUser(result.data.user);
        toast.success("Profile updated successfully!");
      }
      return result;
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      
      if (result.data) {
        toast.success("Password changed successfully!");
      }
      
      return result;
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Failed to change password");
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await authClient.deleteUser();
      setSession(null);
      setUser(null);
      toast.success("Account deleted successfully!");
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error(error.message || "Failed to delete account");
      throw error;
    }
  };

  // Email operations
  const sendPasswordResetEmail = async (email: string) => {
    try {
      const result = await authClient.forgetPassword({ email });
      if (result.data) {
        toast.success("Password reset email sent!");
      }
      return result;
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset email");
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const result = await authClient.resetPassword({
        token,
        password,
      });
      
      if (result.data) {
        toast.success("Password reset successfully!");
      }
      
      return result;
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password");
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const result = await authClient.verifyEmail({ token });
      if (result.data?.user) {
        setUser(result.data.user);
        toast.success("Email verified successfully!");
      }
      return result;
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast.error(error.message || "Failed to verify email");
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const result = await authClient.sendVerificationEmail();
      if (result.data) {
        toast.success("Verification email sent!");
      }
      return result;
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Failed to send verification email");
      throw error;
    }
  };

  // Role and permission helpers
  const hasRole = (role: string): boolean => {
    return authHelpers.hasRole(user, role);
  };

  const isAdmin = (): boolean => {
    return authHelpers.isAdmin(user);
  };

  const isSuperAdmin = (): boolean => {
    return authHelpers.isSuperAdmin(user);
  };

  const canAccess = (requiredRole: "user" | "admin" | "super_admin"): boolean => {
    if (!user) return false;
    
    switch (requiredRole) {
      case "super_admin":
        return user.userRole === "super_admin";
      case "admin":
        return user.userRole === "admin" || user.userRole === "super_admin";
      case "user":
        return true; // All authenticated users have user access
      default:
        return false;
    }
  };

  // User info helpers
  const getFullName = (): string => {
    return authHelpers.getFullName(user);
  };

  const getInitials = (): string => {
    return authHelpers.getInitials(user);
  };

  const getDisplayName = (): string => {
    if (!user) return "";
    return user.name || user.email || "";
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    
    // Authentication methods
    signIn,
    signUp,
    signOut,
    
    // Social authentication
    signInWithGithub,
    signInWithGoogle,
    
    // User management
    updateUser,
    changePassword,
    deleteAccount,
    
    // Email operations
    sendPasswordResetEmail,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    
    // Role and permission helpers
    hasRole,
    isAdmin,
    isSuperAdmin,
    canAccess,
    
    // User info helpers
    getFullName,
    getInitials,
    getDisplayName,
  };
}
