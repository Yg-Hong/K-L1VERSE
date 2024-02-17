import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { getMatchDetail } from "../../../api/match";

import {
  DoBetContainer,
  DoBetButtonContainer,
  TeamSelectButton,
  TeamNameContainer,
  TeamNameComponent,
  TeamName,
  DoBetInputContainer,
  DoBetInputComponent,
  InputForm,
  DoBetInputBox,
  DoBetLabel,
  DoBetButton,
  DoBetText,
  DoBetTitleComponent,
  DoBetTitle,
  DoBetLeft,
  UserGoal,
} from "../../../styles/match-styles/doBetting/DoBettingContainerStyles";
import {
  Betting,
  BadgeImg,
} from "../../../styles/match-styles/MatchDetailStyle";
import * as bettingApi from "../../../api/betting";
import { UserState } from "../../../global/UserState";
import { ReactComponent as DoBetIcon } from "../../../assets/icon/do-bet-icon.svg";

function DoBettingContainer({ data, setIsBetted }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [bettingAmount, setBettingAmount] = useState(0);
  const [userState, setUserState] = useRecoilState(UserState);
  const { matchId } = useParams();
  const [match, setMatch] = useState(data);
  const [isLoading, setIsLoading] = useState(true);
  const [betComplete, setBetComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMatchDetail(matchId);
      setMatch(result);
      setIsLoading(false);
    };
    fetchData();
  }, [matchId]);

  useEffect(() => {
    const checkBetting = async () => {
      if (match && userState.userId) {
        const response = await bettingApi.checkBetting({
          matchId,
          userId: userState.userId,
        });

        if (response.data.betGoal === 0) {
          setBetComplete(false);
        } else {
          setBetComplete(true);
          if (response.data.betTeamId === match.homeTeamId) {
            setSelectedTeam("home");
          } else if (response.data.betTeamId === match.awayTeamId) {
            setSelectedTeam("away");
          } else {
            setSelectedTeam("draw");
          }
          setBettingAmount(response.data.betGoal);
        }
      }
    };
    if (!isLoading) {
      checkBetting();
    }
  }, [match, userState.userId, matchId]);

  const getparsedTeamName = (teamName) => {
    let parsedTeamName = teamName.substring(0, 2);

    if (`${teamName}`.includes("서울") || `${teamName}`.includes("수원")) {
      parsedTeamName = `${teamName}`.substring(0, 4);
    } else if (`${teamName}`.includes("무승부")) {
      parsedTeamName = "무승부";
    }

    return parsedTeamName;
  };

  const getTeamSrc = (teamId) => {
    const teamsrc = `${process.env.PUBLIC_URL}/badge/badge${teamId}.png`;

    return teamsrc;
  };

  const isLeftMoreThanTenMinutes = (matchAt) => {
    const targetTime = new Date(matchAt);
    const currentTime = new Date();
    const timeDifferenceInMinues = Math.floor(
      (targetTime - currentTime) / 1000 / 60,
    );

    if (timeDifferenceInMinues >= 1) {
      return true;
    }
    return false;
  };

  const leftMoreThanTenMinutes = isLeftMoreThanTenMinutes(match.matchAt);

  const handleBettingClick = async () => {
    const teamId = match
      ? selectedTeam === "home"
        ? match.homeTeamId
        : selectedTeam === "draw"
          ? 0
          : match.awayTeamId
      : null;

    const teamName = match
      ? selectedTeam === "home"
        ? match.homeTeamName
        : selectedTeam === "draw"
          ? "무승부"
          : match.awayTeamName
      : null;

    if (selectedTeam && bettingAmount > 0) {
      if (userState.goal < bettingAmount) {
        Swal.fire({
          title: "보유 골이 부족합니다.",
          icon: "error",
          cancelButtonText: "확인",
        }).then(() => {});
        return;
      }

      try {
        await bettingApi
          .betting({
            userId: userState.userId,
            matchId,
            bettingTeamId: teamId,
            amount: bettingAmount,
          })
          .catch(() => {
            Swal.fire({
              title: "응원에 실패했습니다.",
              icon: "error",
              cancelButtonText: "확인",
            }).then(() => {
              setBetComplete(true);
            });
          })
          .then(() => {
            Swal.fire({
              html: `
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png" alt="Bear" width="100" height="100"/>
                <p style='font-size:1.2rem; font-family:Pretendard-Bold;'>${teamName}에 ${bettingAmount}골 응원했습니다.</p>
              `,
              confirmButtonColor: "#3085d6",
              confirmButtonText:
                "<div style='font-size:1rem; font-family:Pretendard-Regular;'>확인</div>",
            }).then(() => {
              setBetComplete(true);
              setIsBetted(true);
              setUserState((prev) => ({
                ...prev,
                goal: prev.goal - bettingAmount,
              }));
              window.location.reload();
            });
          });
      } catch {
        Swal.fire({
          title: "응원에 실패했습니다.",
          icon: "error",
          cancelButtonText: "확인",
        }).then(() => {
          setBetComplete(true);
        });
      }
    } else {
      Swal.fire({
        title: "팀과 응원골을 선택해주세요.",
        icon: "info",
        confirmButtonText: "확인",
      });
    }
  };
  const handleTeamClick = (team) => {
    setSelectedTeam(selectedTeam === team ? null : team);
  };
  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <Betting>
      <div>
        <DoBetTitleComponent>
          <DoBetTitle>
            <DoBetLeft>
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png"
                alt="Beating Heart"
                width="20"
                height="20"
              />
              <div>응원 하기</div>
            </DoBetLeft>
          </DoBetTitle>
        </DoBetTitleComponent>
      </div>
      <DoBetContainer>
        <DoBetButtonContainer>
          <TeamSelectButton
            type="button"
            selected={selectedTeam === "home"}
            onClick={() => handleTeamClick("home")}
            disabled={
              betComplete || match.status === "done" || !leftMoreThanTenMinutes
            }
          >
            <TeamNameContainer>
              <TeamNameComponent>
                <BadgeImg src={getTeamSrc(match.homeTeamId)} alt="home" />
                <TeamName>{getparsedTeamName(match.homeTeamName)}</TeamName>
              </TeamNameComponent>
            </TeamNameContainer>
          </TeamSelectButton>
          <TeamSelectButton
            type="button"
            selected={selectedTeam === "draw"}
            onClick={() => handleTeamClick("draw")}
            disabled={
              betComplete || match.status === "done" || !leftMoreThanTenMinutes
            }
          >
            <TeamName>무승부</TeamName>
          </TeamSelectButton>
          <TeamSelectButton
            type="button"
            selected={selectedTeam === "away"}
            onClick={() => handleTeamClick("away")}
            disabled={
              betComplete || match.status === "done" || !leftMoreThanTenMinutes
            }
          >
            <TeamNameContainer>
              <TeamNameComponent>
                <BadgeImg src={getTeamSrc(match.awayTeamId)} alt="away" />
                <TeamName>{getparsedTeamName(match.awayTeamName)}</TeamName>
              </TeamNameComponent>
            </TeamNameContainer>
          </TeamSelectButton>
        </DoBetButtonContainer>
        <DoBetInputContainer>
          <UserGoal>현재 보유 골 : {userState.goal}</UserGoal>
          <DoBetInputComponent>
            <InputForm
              disabled={
                betComplete ||
                match.status === "done" ||
                !leftMoreThanTenMinutes
              }
            >
              <DoBetInputBox
                id="bettingGoal"
                type="text"
                onChange={(e) => {
                  const val = e.target.value;
                  setBettingAmount(val.replace(/\D/g, ""));
                }}
                disabled={
                  betComplete ||
                  match.status === "done" ||
                  !leftMoreThanTenMinutes
                }
                placeholder={0}
                value={bettingAmount === 0 ? "" : bettingAmount}
              />
              <DoBetLabel htmlFor="bettingGoal">
                <div>골</div>
              </DoBetLabel>
            </InputForm>
            <DoBetButton
              type="button"
              onClick={handleBettingClick}
              disabled={
                betComplete ||
                match.status === "done" ||
                !leftMoreThanTenMinutes
              }
            >
              <DoBetText>
                {/* <DoBetIcon /> */}
                <div>👊🏻 응원 하기</div>
              </DoBetText>
            </DoBetButton>
          </DoBetInputComponent>
        </DoBetInputContainer>
      </DoBetContainer>
    </Betting>
  );
}

export default DoBettingContainer;
