package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor

public class ActivityMessageListener {
    private final ActivityAIService aiservice;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues="${rabbitmq.queue.name}")
    public void processActivity(Activity activity){

        log.info("Received activity for processing: {}",activity.getId());

//        log.info("Generated Recommendation: {}",aiservice.generateRecommendation(activity));
        try{
            Recommendation recommendation=aiservice.generateRecommendation(activity);
            recommendationRepository.save(recommendation);
        }
        catch(org.springframework.web.reactive.function.client.WebClientResponseException.TooManyRequests e){
            log.error("Gemini quota exceeded. Skipping activity {}", activity.getId());
        }
        catch(Exception e){
            log.error("Error processing activity {}", activity.getId(), e);
        }

    }

}
