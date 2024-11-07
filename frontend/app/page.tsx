import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Plane, Activity, AlertTriangle, Settings, BarChart, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { createClient } from '@/utils/supabase/server';
import AircraftList from './components/aircraftlist';
import Link from 'next/link';

const FleetDashboard = async () => {
    const supabase = await createClient();
    const { data: aircrafts } = await supabase.from("aircrafts").select()
    const { data: carriers } = await supabase.from("carriers").select()

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Link href="/" className="text-black text-3xl font-bold cursor-pointer">Cathay Pacific Fleet Overview</Link>
                <div className="flex items-center gap-2">
                    <Button variant="default">
                        <BarChart className="mr-2 h-4 w-4" /> Analytics
                    </Button>
                    <Button variant="secondary">
                        <Map className="mr-2 h-4 w-4" /> Live Map
                    </Button>
                </div>
            </div>

            <AircraftList aircrafts={aircrafts} carriers={carriers} />
        </div>
    );
};

export default FleetDashboard;
