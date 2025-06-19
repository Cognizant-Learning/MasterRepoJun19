package com.vibecoding.inventory.controller;

import com.vibecoding.inventory.model.ActivityLog;
import com.vibecoding.inventory.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-log")
@CrossOrigin(origins = "*")
public class ActivityLogController {
    
    private final ActivityLogService activityLogService;
    
    @Autowired
    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }
    
    @GetMapping
    public List<ActivityLog> getRecentActivityLogs() {
        // Return the 10 most recent activity logs
        return activityLogService.getRecentActivityLogs(10);
    }
}
