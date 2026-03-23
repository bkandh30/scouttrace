'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useNavigate, useRouter } from '@tanstack/react-router'

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  if (isPending || !session?.user) {
    return null
  }

  const user = session.user

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await router.invalidate()
          await navigate({
            to: '/',
          })
          toast.success('Logged out successfully')
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  const firstNameInitial = user.name.trim().charAt(0).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user.image ??
                    `https://api.dicebear.com/9.x/glass/svg?seed=${user.name}`
                  }
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">
                  {firstNameInitial}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.image ??
                      `https://api.dicebear.com/9.x/glass/svg?seed=${user.name}`
                    }
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {firstNameInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
