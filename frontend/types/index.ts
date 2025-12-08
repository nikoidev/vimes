export interface User {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  is_active: boolean
  is_superuser: boolean
  phone?: string
  avatar_url?: string
  bio?: string
  timezone?: string
  language?: string
  created_at: string
  updated_at?: string
  roles: Role[]
}

export interface Role {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at?: string
  permissions: Permission[]
}

export interface Permission {
  id: number
  name: string
  code: string
  description?: string
  resource?: string
  action?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface UserCreate {
  email: string
  username: string
  password: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  role_ids?: number[]
}

export interface UserUpdate {
  email?: string
  username?: string
  password?: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  role_ids?: number[]
}

export interface RoleCreate {
  name: string
  description?: string
  is_active?: boolean
  permission_ids?: number[]
}

export interface RoleUpdate {
  name?: string
  description?: string
  is_active?: boolean
  permission_ids?: number[]
}

export interface PermissionCreate {
  name: string
  code: string
  description?: string
  resource?: string
  action?: string
  is_active?: boolean
}

export interface PermissionUpdate {
  name?: string
  code?: string
  description?: string
  resource?: string
  action?: string
  is_active?: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface Token {
  access_token: string
  token_type: string
  refresh_token?: string
}

export interface AuditLog {
  id: number
  user_id?: number
  action: string
  resource: string
  resource_id?: number
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  user_username?: string
  user_email?: string
}

export interface ProfileUpdate {
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  bio?: string
  timezone?: string
  language?: string
}

// CMS Types
export interface CMSPage {
  id: number
  title: string
  slug: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  content?: string
  sections?: any[]
  is_published: boolean
  is_homepage: boolean
  template: string
  order: number
  created_at: string
  updated_at?: string
}

export interface CMSPageCreate {
  title: string
  slug: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  content?: string
  sections?: any[]
  is_published?: boolean
  is_homepage?: boolean
  template?: string
  order?: number
}

export interface CMSPageUpdate {
  title?: string
  slug?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  content?: string
  sections?: any[]
  is_published?: boolean
  is_homepage?: boolean
  template?: string
  order?: number
}

export interface GalleryImage {
  url: string
  description?: string
}

export interface Service {
  id: number
  title: string
  slug: string
  short_description?: string
  description?: string
  icon?: string
  image?: string
  gallery?: GalleryImage[]
  features?: string[]
  price_from?: number
  price_text?: string
  is_active: boolean
  is_featured: boolean
  order: number
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
}

export interface ServiceCreate {
  title: string
  slug: string
  short_description?: string
  description?: string
  icon?: string
  image?: string
  gallery?: GalleryImage[]
  features?: string[]
  price_from?: number
  price_text?: string
  is_active?: boolean
  is_featured?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
}

export interface ServiceUpdate {
  title?: string
  slug?: string
  short_description?: string
  description?: string
  icon?: string
  image?: string
  gallery?: GalleryImage[]
  features?: string[]
  price_from?: number
  price_text?: string
  is_active?: boolean
  is_featured?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
}

export interface Project {
  id: number
  title: string
  slug: string
  client_name?: string
  location?: string
  short_description?: string
  description?: string
  challenge?: string
  solution?: string
  results?: string
  featured_image?: string
  gallery?: string[]
  video_url?: string
  service_id?: number
  tags?: string[]
  duration?: string
  completion_date?: string
  is_published: boolean
  is_featured: boolean
  order: number
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
}

export interface ProjectCreate {
  title: string
  slug: string
  client_name?: string
  location?: string
  short_description?: string
  description?: string
  challenge?: string
  solution?: string
  results?: string
  featured_image?: string
  gallery?: string[]
  video_url?: string
  service_id?: number
  tags?: string[]
  duration?: string
  completion_date?: string
  is_published?: boolean
  is_featured?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
}

export interface ProjectUpdate {
  title?: string
  slug?: string
  client_name?: string
  location?: string
  short_description?: string
  description?: string
  challenge?: string
  solution?: string
  results?: string
  featured_image?: string
  gallery?: string[]
  video_url?: string
  service_id?: number
  tags?: string[]
  duration?: string
  completion_date?: string
  is_published?: boolean
  is_featured?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
}

export interface Testimonial {
  id: number
  client_name: string
  client_position?: string
  client_company?: string
  client_location?: string
  testimonial: string
  rating: number
  client_photo?: string
  is_published: boolean
  is_featured: boolean
  order: number
  created_at: string
  updated_at?: string
}

export interface TestimonialCreate {
  client_name: string
  client_position?: string
  client_company?: string
  client_location?: string
  testimonial: string
  rating?: number
  client_photo?: string
  is_published?: boolean
  is_featured?: boolean
  order?: number
}

export interface TestimonialUpdate {
  client_name?: string
  client_position?: string
  client_company?: string
  client_location?: string
  testimonial?: string
  rating?: number
  client_photo?: string
  is_published?: boolean
  is_featured?: boolean
  order?: number
}

export interface ContactLead {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  location?: string
  subject?: string
  message: string
  service_interest?: string
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected'
  notes?: string
  assigned_to?: number
  ip_address?: string
  user_agent?: string
  referrer?: string
  is_read: boolean
  is_spam: boolean
  created_at: string
  updated_at?: string
}

export interface ContactLeadCreate {
  name: string
  email: string
  phone?: string
  company?: string
  location?: string
  subject?: string
  message: string
  service_interest?: string
}

export interface ContactLeadUpdate {
  status?: 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected'
  notes?: string
  assigned_to?: number
  is_read?: boolean
  is_spam?: boolean
}

export interface SiteConfig {
  id: number
  company_name: string
  tagline?: string
  description?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  city: string
  province: string
  postal_code?: string
  country: string
  latitude?: string
  longitude?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
  social_linkedin?: string
  social_youtube?: string
  logo?: string
  logo_dark?: string
  favicon?: string
  primary_color: string
  secondary_color: string
  business_hours?: Record<string, string>
  default_meta_title?: string
  default_meta_description?: string
  default_meta_keywords?: string
  default_og_image?: string
  footer_text?: string
  footer_links?: Array<{ label: string; url: string }>
  google_analytics_id?: string
  google_maps_api_key?: string
  facebook_pixel_id?: string
  maintenance_mode: boolean
  maintenance_message?: string
  created_at: string
  updated_at?: string
}

export interface SiteConfigUpdate {
  company_name?: string
  tagline?: string
  description?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
  latitude?: string
  longitude?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
  social_linkedin?: string
  social_youtube?: string
  logo?: string
  logo_dark?: string
  favicon?: string
  primary_color?: string
  secondary_color?: string
  business_hours?: Record<string, string>
  default_meta_title?: string
  default_meta_description?: string
  default_meta_keywords?: string
  default_og_image?: string
  footer_text?: string
  footer_links?: Array<{ label: string; url: string }>
  google_analytics_id?: string
  google_maps_api_key?: string
  facebook_pixel_id?: string
  maintenance_mode?: boolean
  maintenance_message?: string
}

export interface HeroImage {
  id: number
  title: string
  subtitle?: string
  description?: string
  image_url: string
  alt_text: string
  button_text?: string
  button_url?: string
  is_active: boolean
  order: number
  created_at: string
  updated_at?: string
}

export interface HeroImageCreate {
  title: string
  subtitle?: string
  description?: string
  image_url: string
  alt_text: string
  button_text?: string
  button_url?: string
  is_active?: boolean
  order?: number
}

export interface HeroImageUpdate {
  title?: string
  subtitle?: string
  description?: string
  image_url?: string
  alt_text?: string
  button_text?: string
  button_url?: string
  is_active?: boolean
  order?: number
}
