package com.KL1verse.match.team.service;


import com.KL1verse.match.team.dto.res.TeamInfoResponse;
import com.KL1verse.match.team.repository.TeamRepository;
import com.KL1verse.match.team.repository.entity.Member;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    @Autowired
    TeamRepository teamRepository;

    @Override
    public List<TeamInfoResponse> getTeamInfo(int id) {
        List<TeamInfoResponse> teamInfoResponse = new ArrayList<>();
        for (Member member : teamRepository.findByTeam_id(id)) {
            TeamInfoResponse dto = TeamInfoResponse.builder()
                .member_id(member.getMember_id())
                .team_id(member.getTeam_id())
                .name(member.getName())
                .back_number(member.getBack_number())
                .profile(member.getProfile())
                .position(member.getPosition())
                .build();

            teamInfoResponse.add(dto);
        }

        return teamInfoResponse;
    }
}
