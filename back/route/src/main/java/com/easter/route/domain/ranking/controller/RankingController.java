package com.easter.route.domain.ranking.controller;

import com.easter.route.domain.ranking.entity.dto.GetMyRankingDto;
import com.easter.route.domain.ranking.entity.dto.GetRankingListDto;
import com.easter.route.domain.ranking.entity.dto.RankedRecordDto;
import com.easter.route.domain.ranking.service.RankingService;
import com.easter.route.global.response.ResultResponse;
import com.easter.route.global.security.PassportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/maon/route")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/ranking/{routeId}")
    public ResponseEntity<ResultResponse> getAllRankingList(@PathVariable String routeId) {
        GetRankingListDto ranking = rankingService.getRankingList(routeId);
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "Ranking 정보: {} ", ranking);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/ranking/{routeId}/my")
    public ResponseEntity<ResultResponse> getMyRanking(@RequestAttribute("passport") PassportDto passport, @PathVariable String routeId) {
        GetMyRankingDto myRanking = rankingService.getMyRanking(routeId, passport.getId().toString());
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "My Ranking 정보: {} ", myRanking);
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    // test용, 삭제 할 것
    @GetMapping("/ranking/updateAllRankingList")
    public ResponseEntity<ResultResponse> updateAllRankingList() {
        rankingService.createRankingsForAllRoutes();
        rankingService.updateAllRankingList();
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "모든 랭킹 정보를 업데이트했습니다.");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    @GetMapping("/ranking/init")
    public ResponseEntity<ResultResponse> rankingInit() {
        rankingService.createRankingsForAllRoutes();
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "랭킹 초기화");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }

    // test용, 삭제 할 것
    @GetMapping("/ranking/openFeignTest")
    public ResponseEntity<ResultResponse> openFeignTest() {
        rankingService.feignTest();
        ResultResponse resultResponse = ResultResponse.of(HttpStatus.OK, "openFeignTest");
        return ResponseEntity.status(resultResponse.getStatus()).body(resultResponse);
    }
}
