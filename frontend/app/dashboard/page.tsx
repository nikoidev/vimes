'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usersApi } from '@/lib/api/users'
import { rolesApi } from '@/lib/api/roles'
import { permissionsApi } from '@/lib/api/permissions'
import { UsersIcon, ShieldCheckIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)

  useEffect(() => {
    if (!user) return

    // Check if user has ANY permissions at all
    const hasAnyPermission = user.is_superuser || 
      user.roles.some(role => 
        role.permissions && role.permissions.length > 0
      )
    
    // If user has no permissions at all, redirect to profile
    if (!hasAnyPermission) {
      router.replace('/profile')
      return
    }

    // Check if user has admin access
    const isAdmin = user.is_superuser || 
      user.roles.some(role => 
        role.permissions?.some(p => 
          p.code.startsWith('users.') || 
          p.code.startsWith('roles.') || 
          p.code.startsWith('permissions.')
        ) || false
      )
    
    setHasAdminAccess(isAdmin)

    const fetchStats = async () => {
      try {
        const promises = []
        
        // Only fetch stats the user has permission to view
        if (user.roles.some(role => role.permissions?.some(p => p.code === 'users.read') || false)) {
          promises.push(usersApi.getAll({ limit: 1 }))
        } else {
          promises.push(Promise.resolve({ total: 0 }))
        }
        
        if (user.roles.some(role => role.permissions?.some(p => p.code === 'roles.read') || false)) {
          promises.push(rolesApi.getAll({ limit: 1 }))
        } else {
          promises.push(Promise.resolve({ total: 0 }))
        }
        
        if (user.roles.some(role => role.permissions?.some(p => p.code === 'permissions.read') || false)) {
          promises.push(permissionsApi.getAll({ limit: 1 }))
        } else {
          promises.push(Promise.resolve({ total: 0 }))
        }

        const [users, roles, permissions] = await Promise.all(promises)
        
        setStats({
          users: users.total,
          roles: roles.total,
          permissions: permissions.total,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Don't crash if stats fail, just set to 0
        setStats({
          users: 0,
          roles: 0,
          permissions: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, router])

  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.users,
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/users',
    },
    {
      title: 'Total Roles',
      value: stats.roles,
      icon: ShieldCheckIcon,
      color: 'bg-green-500',
      href: '/roles',
    },
    {
      title: 'Total Permisos',
      value: stats.permissions,
      icon: KeyIcon,
      color: 'bg-purple-500',
      href: '/permissions',
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Panel de Control
          </h3>
          
          {/* Admin Stats - Only show if user has admin access */}
          {hasAdminAccess && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {loading ? '...' : card.value}
                      </p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-lg">
              <UserCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bienvenido, {user?.username || 'Usuario'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasAdminAccess 
                  ? 'Tienes acceso de administrador al sistema.'
                  : 'Puedes acceder a las secciones disponibles en el menú lateral según tus permisos.'}
              </p>
              
              {/* Show user's permissions */}
              {user && !user.is_superuser && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tus permisos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.flatMap(role => role.permissions || []).map((permission, index) => (
                      <span
                        key={`${permission.code}-${index}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Accesos Rápidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/profile"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Mi Perfil</span>
            </a>
            
            {hasAdminAccess && (
              <>
                <a
                  href="/users"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <UsersIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Usuarios</span>
                </a>
                <a
                  href="/roles"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ShieldCheckIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Roles</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
