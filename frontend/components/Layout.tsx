'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import SafeThemeToggle from './SafeThemeToggle'
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Panel', href: '/dashboard', icon: HomeIcon, section: 'admin' },
    { name: 'Usuarios', href: '/users', icon: UsersIcon, section: 'admin' },
    { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, section: 'admin' },
    { name: 'Permisos', href: '/permissions', icon: KeyIcon, section: 'admin' },
    { name: 'Actividad', href: '/audit-logs', icon: ClockIcon, section: 'admin' },
    { name: 'Páginas CMS', href: '/cms/pages', icon: DocumentTextIcon, section: 'cms' },
    { name: 'Galería Hero', href: '/cms/hero-images', icon: PhotoIcon, section: 'cms' },
    { name: 'Servicios', href: '/cms/services', icon: WrenchScrewdriverIcon, section: 'cms' },
    { name: 'Proyectos', href: '/cms/projects', icon: BriefcaseIcon, section: 'cms' },
    { name: 'Testimonios', href: '/cms/testimonials', icon: ChatBubbleBottomCenterTextIcon, section: 'cms' },
    { name: 'Contactos', href: '/cms/contact-leads', icon: EnvelopeIcon, section: 'cms' },
    { name: 'Configuración', href: '/cms/site-config', icon: Cog6ToothIcon, section: 'cms' },
  ]

  const adminNav = navigation.filter(item => item.section === 'admin')
  const cmsNav = navigation.filter(item => item.section === 'cms')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                  Excavaciones Maella
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Panel de Administración</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Admin Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Administración
              </h3>
              <div className="space-y-1">
                {adminNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* CMS Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gestión de Contenido
              </h3>
              <div className="space-y-1">
                {cmsNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* User info and actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2 rounded-lg">
                  <UserCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <SafeThemeToggle />
            </div>
            
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Mi Perfil
              </Link>
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Ver Sitio Web
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 lg:px-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bienvenido, {user?.username}
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <SafeThemeToggle />
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
