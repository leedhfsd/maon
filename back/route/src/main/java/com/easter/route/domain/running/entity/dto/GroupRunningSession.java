package com.easter.route.domain.running.entity.dto;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GroupRunningSession {
	private ConcurrentHashMap<String, List<LocationDto>> runningInfoMap;
}
