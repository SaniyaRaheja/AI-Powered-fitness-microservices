import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import { getActivities } from "../services/api";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

function ActivityList() {
    const [activities,setActivities]=useState([])
    const navigate=useNavigate();

    const fetchActvities=async()=>{
        try{
            const response=await getActivities();
            setActivities(response.data);
        }
        catch(error){
            console.error("Error fetching activities:", error);
        }
        
    }

    useEffect(()=>{
        fetchActvities();
    },[])

  return (
    <Grid>
        {activities.map((activity)=>(
            <Grid container spacing={{xs:2,md:3}} columns={{xs:4}}>
                <Card sx={{cursor:'pointer'}} onClick={()=>navigate(`activities/${activity.id}`)}>
                    <CardContent>
                        <Typography variant="h6">{activity.type}</Typography>
                        <Typography variant="body2">Duration: {activity.duration} minutes</Typography>
                        <Typography variant="body2">Calories Burned: {activity.caloriesBurned}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
  );
}   

export default ActivityList;