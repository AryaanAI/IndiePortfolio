export enum WorkItemCategory {
  PHOTOGRAPHY = 'photography',
  DESIGN = 'design',
  FASHION = 'fashion',
  BEAUTY = 'beauty',
  ILLUSTRATION = 'illustration',
  OTHER = 'other',
}

export enum WorkItemStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: WorkItemCategory;
  status: WorkItemStatus;
  thumbnailUrl: string;
  images: string[];
  videos?: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  dueDate?: number;
  relatedWorkItemId?: string;
}

export interface BackupData {
  workItems: WorkItem[];
  todos: Todo[];
  lastBackupDate: number;
}

export interface TargetImage {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  tags: string[];
  createdAt: number;
}

export interface FaceswapResult {
  id: string;
  targetImageId: string;
  sourceImageUrl: string;
  resultImageUrl: string;
  createdAt: number;
}

// Admin and Plan Management Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: PlanFeatures;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PlanFeatures {
  maxPublishedItems: number;
  faceswapEnabled: boolean;
  todoboardEnabled: boolean;
  portfolioEnabled: boolean;
  customDomain: boolean;
  prioritySupport: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  applicablePlans: string[];
  isActive: boolean;
  expiresAt?: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: number;
  endDate: number;
  paymentMethod?: string;
  stripeSubscriptionId?: string;
  razorpaySubscriptionId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  subscription?: UserSubscription;
  createdAt: number;
  lastLoginAt: number;
  isActive: boolean;
}

export interface UserStats {
  totalWorkItems: number;
  publishedItems: number;
  draftItems: number;
  totalTodos: number;
  completedTodos: number;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  planId: string;
  couponId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethod: 'stripe' | 'razorpay';
  createdAt: number;
}