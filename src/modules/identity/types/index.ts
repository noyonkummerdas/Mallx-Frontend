export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Vendor' | 'Partner' | 'DeliveryBoy' | 'Admin';
  phone?: string;
  isTwoFactorEnabled: boolean;
}

export interface AuthResponse {
  status: string;
  token?: string;
  data: {
    user: User;
  };
}
