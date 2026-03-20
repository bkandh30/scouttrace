"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { type NavPrimaryProps } from "@/lib/types"

export function NavPrimary({ items }: NavPrimaryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip={item.title}
                  className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                >
                  <Link 
                    activeProps={{
                      'data-active': true,
                    }}
                    to={item.to} 
                    activeOptions={item.activeOptions}
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
