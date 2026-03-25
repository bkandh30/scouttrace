// import * as React from "react"
// import {
//   AudioWaveform,
//   BookOpen,
//   Bot,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react"

import { BookmarkIcon, Compass, Import } from 'lucide-react'

import { NavPrimary } from '#/components/layout/nav-primary'
import { NavUser } from '@/components/layout/nav-user'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link, linkOptions } from '@tanstack/react-router'
import type {NavPrimaryProps} from '@/lib/types';

const navItems: NavPrimaryProps['items'] = linkOptions([
	{
		title: 'Items',
		icon: BookmarkIcon,
		to: '/dashboard/items',
		activeOptions: { exact: false },
	},
	{
		title: 'Import',
		icon: Import,
		to: '/dashboard/import',
		activeOptions: { exact: false },
	},
	{
		title: 'Discover',
		icon: Compass,
		to: '/dashboard/discover',
		activeOptions: { exact: false },
	},
])

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				{/* <TeamSwitcher teams={data.teams} /> */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link
								to="/"
								className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
							>
								<img
									src="/scouttrace.png"
									alt="ScoutTrace Logo"
									className="size-7 shrink-0 rounded-lg object-cover"
								/>
								<div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
									<span className="text-sm font-semibold tracking-tight">
										ScoutTrace
									</span>
									<span className="text-xs text-muted-foreground/70">
										AI Knowledge Base
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* <NavMain items={data.navMain} /> */}
				<NavPrimary items={navItems} />
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border">
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
