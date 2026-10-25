/**
 * HireLocal shared types
 */

export type UserRole = "customer" | "worker";
export type ViewMode = "customer" | "worker";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  photoURL?: string;
}

export interface WorkerProfile extends UserProfile {
  skills: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  isOnline: boolean;
  hourlyRate: number;
  experience: string;
  totalEarnings: number;
  totalJobs: number;
  recentReviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type BookingStatus = "pending" | "confirmed" | "on-the-way" | "arriving-soon" | "completed" | "cancelled";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  status: BookingStatus;
  scheduledTime: number; // timestamp
  createdAt: number;
  totalAmount: number;
  address: string;
  category: string;
  workerImg?: string;
  customerImg?: string;
  etaMinutes?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
}
