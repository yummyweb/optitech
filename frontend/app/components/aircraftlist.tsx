"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Plane, Activity, AlertTriangle, Settings, BarChart, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from "next/navigation";

const AircraftList = ({ aircrafts, carriers }: any) => {
    const [_aircrafts, _setAircrafts] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        _setAircrafts([])

        for (let i = 0; i < aircrafts.length; i++) {
            const aircraft = aircrafts[i];
            let newAircraft = {
                ...aircraft,
                model: ""
            }

            for (let j = 0; j < carriers.length; j++) {
                if (aircraft.carrier === carriers[j].id) {
                    newAircraft.model = carriers[j].company + " " + carriers[j].model
                }
            }

            _setAircrafts((prev: any) => [...prev, newAircraft])
        }
    }, [])

    const search = (text: any) => {
        _setAircrafts(_aircrafts.filter(craft => Object.values(craft).some(val => typeof val === "string" && val.includes(text))))
    }

    const getStatusBadgeVariant = (health: any) => {
        switch (health) {
            case 'good':
                return 'success';
            case 'warning':
                return 'warning';
            case 'maintenance':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const stats = {
        total: aircrafts.length,
        active: aircrafts.filter((a: { maintenance_status: string; }) => a.maintenance_status === 'good').length,
        maintenance: aircrafts.filter((a: { maintenance_status: string; }) => a.maintenance_status === 'maintenance').length,
        warnings: aircrafts.filter((a: { maintenance_status: string; }) => a.maintenance_status === 'warning').length
    };

    return (
        <>
            <div className="flex gap-4">
                <Input
                    type="search"
                    placeholder="Search aircraft..."
                    className="max-w-sm"
                    onChange={e => search(e.target.value)}
                />
                <Select defaultValue="all-types">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Aircraft Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-types">All Types</SelectItem>
                        <SelectItem value="a350-1000">A350-1000</SelectItem>
                        <SelectItem value="a350-900">A350-900</SelectItem>
                        <SelectItem value="a321neo">A321neo</SelectItem>
                        <SelectItem value="777-300er">Boeing 777-300ER</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="active">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="all">All Status</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="id">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="id">Sort by ID</SelectItem>
                        <SelectItem value="type">Sort by Type</SelectItem>
                        <SelectItem value="status">Sort by Status</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Aircraft</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.maintenance}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.warnings}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                {_aircrafts.map((aircraft: any) => (
                    <Card onClick={() => router.push("/dashboard/" + aircraft.id)} key={aircraft.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Plane className="h-5 w-5" />
                                    <div>
                                        <div className="font-bold flex items-center gap-2">
                                            {aircraft.code}
                                            <Badge variant={getStatusBadgeVariant(aircraft.health)}>
                                                {aircraft.maintenance_status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {aircraft.model} • Route: {aircraft.from_route} - {aircraft.to_route}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Last Maintenance: {aircraft.lastMaintenance}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default AircraftList