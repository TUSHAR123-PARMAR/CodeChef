export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'Student' | 'Professional' | 'Homemaker' | 'Senior';
  skillsToTeach: string[];
  skillsToLearn: string[];
  availability: string[];
  createdAt: Date;
  rating?: number;
  reviewCount?: number;
}

export interface SwapRequest {
  id: string;
  fromUser: string;
  toUser: string;
  fromUserName: string;
  toUserName: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  message?: string;
}

export interface Review {
  id: string;
  fromUser: string;
  toUser: string;
  fromUserName: string;
  swapRequestId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}