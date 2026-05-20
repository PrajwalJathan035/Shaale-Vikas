
export enum Screen {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ALUMNI_DASHBOARD = 'ALUMNI_DASHBOARD',
  ACTIVE_NEEDS = 'ACTIVE_NEEDS',
  NEED_DETAIL = 'NEED_DETAIL',
  ADMIN_ADD_NEED = 'ADMIN_ADD_NEED',
  ADMIN_CLOSE_NEED = 'ADMIN_CLOSE_NEED',
  PLEDGE = 'PLEDGE',
  FAKE_PAYMENT = 'FAKE_PAYMENT',
  CONFIRM_PLEDGE = 'CONFIRM_PLEDGE',
  SUCCESS = 'SUCCESS',
  HALL_OF_FAME = 'HALL_OF_FAME',
  HISTORY = 'HISTORY',
  MY_PLEDGES = 'MY_PLEDGES',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  IMPACT_GALLERY = 'IMPACT_GALLERY',
  ADMIN_PLEDGE_DETAIL = 'ADMIN_PLEDGE_DETAIL',
  ADMIN_TOTAL_PLEDGED = 'ADMIN_TOTAL_PLEDGED',
  ADMIN_DONORS = 'ADMIN_DONORS',
  ADMIN_DONOR_DETAIL = 'ADMIN_DONOR_DETAIL',
  ADMIN_PLEDGES_LIST = 'ADMIN_PLEDGES_LIST',
  WELCOME = 'WELCOME',
  CHOOSE_PATH = 'CHOOSE_PATH',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  SEARCH = 'SEARCH'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  orgName?: string;
  batch?: string;
  role: 'admin' | 'alumni';
  profilePhotoUrl?: string;
  createdAt: number;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  costEstimate: number;
  amountPledged: number;
  priority: '🔴 Urgent' | '🟡 Moderate' | '🟢 Low';
  status: 'Active' | 'Completed' | 'Closed';
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  deadline?: string;
  endDate: number;
  closedReason?: string;
  createdAt: number;
  closedAt?: number;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  pledgeAmount: number;
  needId: string;
  needTitle: string;
  paymentMethod: string;
  transactionId: string;
  pledgedAt: number;
}
