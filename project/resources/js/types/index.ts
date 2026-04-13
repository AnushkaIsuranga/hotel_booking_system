import { LucideIcon } from 'lucide-react';

export interface Auth {
    user?: User | null;
}

export interface Brand {
    name: string;
    product_name: string;
    tagline: string;
    support_phone: string;
    support_email: string;
    location: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    brand: Brand;
    auth: Auth;
    flash: {
        message?: string;
        success?: boolean;
        error?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    job_title?: string | null;
    phone?: string | null;
    is_active: boolean;
    last_login_at?: string | null;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
