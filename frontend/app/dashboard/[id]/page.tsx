"use client";

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Activity, ArrowDown, ArrowUp, ThermometerSun, Vibrate, BarChart, Map, Flame, Fan } from 'lucide-react';
import axios from "axios"

import Link from 'next/link';
import { headers } from 'next/headers';

export default function Dashboard({ params }: any) {
    const id = params.id

    const [sensorData, setSensorData] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const getSensorData = async () => {
        const data = await axios.post("http://localhost:8000/fetch", {
            file_url: `https://akerlxpmblqfaifmgbny.supabase.co/storage/v1/object/public/input-data/${id}.txt`
        })

        return data.data
    }

    const predictMaintenance = async () => {
        const data = await axios.post("http://localhost:8000/predict", {
            file_url: `https://akerlxpmblqfaifmgbny.supabase.co/storage/v1/object/public/input-data/${id}.txt`
        })

        return data.data
    }

    useEffect(() => {
        if (id) {
            getSensorData()
                .then(d => setSensorData(d))

            predictMaintenance()
                .then(d => setPrediction(d.prediction))
        }
    }, [id])

    const getStatusStyle = (status: any) => {
        if (status === 'NORMAL') {
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
        }
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    };

    const TrendIndicator = ({ trend }: any) => {
        if (trend === 'up') {
            return <ArrowUp className="inline h-4 w-4 text-red-500" />;
        } else if (trend === 'down') {
            return <ArrowDown className="inline h-4 w-4 text-green-500" />;
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Link href="/" className="text-black text-3xl font-bold cursor-pointer">OptiTech - Fleet Overview</Link>
                <div className="flex items-center gap-2">
                    <Button variant="default">
                        <BarChart className="mr-2 h-4 w-4" /> Analytics
                    </Button>
                    <Button variant="secondary">
                        <Map className="mr-2 h-4 w-4" /> Live Map
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            {sensorData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Engine Temperature</CardTitle>
                            <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {sensorData.features["(LPC outlet temperature) (◦R)"]}°C
                            </div>
                            <p className="text-xs text-muted-foreground">Normal operating range: 340-360°C</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fan Speed</CardTitle>
                            <Fan className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {sensorData.features["(Physical fan speed) (rpm)"]} rpm
                            </div>
                            <p className="text-xs text-muted-foreground">Normal operating range: 1500-3000 rpm</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pressure</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {sensorData.features["(HPC outlet pressure) (psia)"]} PSI
                            </div>
                            <p className="text-xs text-muted-foreground">Normal operating range: 300-700 PSI</p>
                        </CardContent>
                    </Card>
                </div>) : null}

            {/* Readings Table */}
            <Card>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <h1 className='text-2xl font-bold flex justify-center py-4'>Maintenance must be done in {prediction ? parseInt(prediction) : "Loading..."} cycles</h1>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};
