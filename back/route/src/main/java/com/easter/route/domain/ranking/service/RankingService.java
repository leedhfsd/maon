package com.easter.route.domain.ranking.service;


import com.easter.route.domain.ranking.entity.Ranking;
import com.easter.route.domain.ranking.entity.dto.GetMyRankingDto;
import com.easter.route.domain.ranking.entity.dto.GetRankingListDto;

public interface RankingService {
    GetRankingListDto getRankingList(String routeId);
    GetMyRankingDto getMyRanking(String routeId, String memberId);
    void updateAllRankingList();

    void feignTest();

    void createRankingsForAllRoutes();
}
