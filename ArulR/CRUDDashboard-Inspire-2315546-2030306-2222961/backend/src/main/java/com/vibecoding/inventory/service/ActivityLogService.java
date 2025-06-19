package com.vibecoding.inventory.service;

import com.vibecoding.inventory.model.ActivityLog;
import com.vibecoding.inventory.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {
    
    private final ActivityLogRepository activityLogRepository;
    
    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }
    
    public void logActivity(String action, Long itemId) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setItemId(itemId);
        activityLogRepository.save(log);
    }
    
    public List<ActivityLog> getRecentActivityLogs(int limit) {
        return activityLogRepository.findByOrderByTimestampDesc(PageRequest.of(0, limit));
    }
}
