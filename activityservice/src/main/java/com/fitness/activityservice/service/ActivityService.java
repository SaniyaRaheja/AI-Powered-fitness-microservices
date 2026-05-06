package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;


    public ActivityResponse trackActivity(ActivityRequest request){
        boolean isValidUser=userValidationService.validateUser(request.getUserId());
        if(!isValidUser){
            throw new RuntimeException("Invalid User : " + request.getUserId());
        }

       Activity activity=Activity.builder()
               .userId(request.getUserId())
               .duration(request.getDuration())
               .activityType(request.getActivityType())
               .caloriesBurned(request.getCaloriesBurned())
               .startTime(request.getStartTime())
               .additionalMetrics(request.getAdditionalMetrics())
               .build();
       Activity savedActivity=activityRepository.save(activity);
        System.out.println("Saved in Mongo: " + savedActivity);

        //Publish to rabbitmq fro AI Processing
        try{
            rabbitTemplate.convertAndSend(exchange,routingKey,savedActivity);
        }
        catch(Exception e){
            log.error("Failed to publish to rabbitmq : "+ e);
        }

       return mapToResponse(savedActivity);
    }

    public ActivityResponse mapToResponse(Activity activity){
        ActivityResponse activityResponse=new ActivityResponse();

        activityResponse.setId(activity.getId());
        activityResponse.setActivityType(activity.getActivityType());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());

        return activityResponse;

    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities=activityRepository.findByUserId(userId);

        return activities.stream()
                .map(this::mapToResponse).
                collect(Collectors.toList());

    }

    public  ActivityResponse getActivity(String activityId) {
        return mapToResponse(activityRepository.findById(activityId).orElseThrow(()->new RuntimeException("No activity found with this id")));
    }
}
