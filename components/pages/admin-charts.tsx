'use client';

import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const trend=[{date:'May',views:1580,config:183,quotes:17},{date:'Jun',views:1760,config:216,quotes:20},{date:'Jul',views:1940,config:238,quotes:25},{date:'Aug',views:2210,config:291,quotes:27},{date:'Sep',views:2440,config:337,quotes:29},{date:'Oct',views:2912,config:373,quotes:28}];

export function TrendChart(){return <ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" tickLine={false}/><YAxis tickLine={false}/><Tooltip/><Legend/><Area type="monotone" name="Product views" dataKey="views" stroke="#d96b36" fill="#d96b3626" strokeWidth={3}/><Area type="monotone" name="Configurator usage" dataKey="config" stroke="#34424d" fill="#34424d18" strokeWidth={2}/><Area type="monotone" name="Quote requests" dataKey="quotes" stroke="#24764c" fill="#24764c16" strokeWidth={2}/></AreaChart></ResponsiveContainer>;}

export function FitmentPieChart({data}:{data:{name:string;value:number;color:string}[]}){return <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={4}>{data.map(item=><Cell key={item.name} fill={item.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>;}
