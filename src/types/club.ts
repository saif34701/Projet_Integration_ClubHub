export interface Club {
  id: string;
  name: string;
  description: string;
  foundedYear: number;
  photo: string;
  membersCount: number;
  category: string;
  status: "active" | "pending" | "disabled";
  responsableId?: string;
  responsableName?: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  createdAt: string;
  authorName: string;
  isPublic: boolean;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isPublic: boolean;
}

export interface Meeting {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
  visibility: "members" | "public";
}

export interface MembershipRequest {
  id: string;
  clubId: string;
  clubName?: string;
  studentName: string;
  studentEmail: string;
  studentId?: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  motivation: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  name: string;
  email: string;
  role: "member" | "responsable";
  joinedAt: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  classe?: string;
  option?: string;
}

export type UserRole = "visitor" | "student" | "member" | "responsable" | "admin";
