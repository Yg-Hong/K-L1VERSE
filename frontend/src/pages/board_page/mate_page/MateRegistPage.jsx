import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import MateRegistCard from "../../../components/board/MateRegistCard"; // Import MateRegistCard
import { createMate, updateMate } from "../../../api/mate";
import { UserState } from "../../../global/UserState";

import { DetailTop } from "../../../styles/BoardStyles/BoardCreateStyle";

import BackIcon from "../../../assets/icon/back-icon.png";
import { BackButton } from "../../../styles/BoardStyles/BoardDetailStyle";

function MateRegistPage() {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [total, setTotal] = useState(1);
  const [fullFlag, setFullFlag] = useState(false);
  const [matchId, setMatchId] = useState(undefined);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { userId } = useRecoilState(UserState)[0];
  const location = useLocation();
  const { state } = location;
  useEffect(() => {
    if (location.state && location.state.board) {
      setBoardId(location.state.board.boardId);
      setTitle(location.state.board.title);
      setContent(location.state.board.content);
      setTotal(location.state.total);
      setFullFlag(location.state.fullFlag);
      setMatchId(location.state.matchId);
      setIsUpdateMode(true);
    }
  }, [location]);

  const handleSubmit = () => {
    if (isUpdateMode) {
      updateMate(
        boardId,
        {
          board: {
            title,
            content,
            userId,
          },
          total,
          fullFlag,
          matchId,
        },
        () => {
          if (state && state.fromMypage) {
            navigate(`/mate/${boardId}`, {
              state: {
                user: state.user,
                fromMypage: state.fromMypage,
                category: state.category,
              },
            });
          } else {
            navigate(`/mate/${boardId}`);
          }
        },
        () => {},
      );
    } else {
      createMate(
        {
          board: {
            boardType: "MATE",
            title,
            content,
            userId,
          },
          total,
          fullFlag,
          matchId,
        },
        ({ data }) => {
          console.log("Waggle created");
          navigate(`/mate/${data.board.boardId}`);
        },
        () => {},
      );
    }
  };

  function handleFullFlagChange(e) {
    setFullFlag(e.target.checked);
  }

  const handleFullFlag = () => {
    if (isUpdateMode) {
      setFullFlag(!fullFlag);
    } else {
      Swal.fire({
        html: `
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Hatching%20Chick.png" alt="Hatching Chick" width="100" height="100" />
          <div style="font-size:1rem; font-family:Pretendard-Regular; margin-top: 1rem;">작성중에는 변경할 수 없어요!</div>
        `,
        confirmButtonColor: "#3085d6",
        confirmButtonText:
          "<div style='font-size:1rem; font-family:Pretendard-Regular;'>확인</div>",
      });
    }
  };

  const handleBackClick = () => {
    if (isUpdateMode) {
      if (state && state.fromMypage) {
        navigate(`/mate/${boardId}`, {
          state: {
            user: state.user,
            fromMypage: state.fromMypage,
            category: state.category,
          },
        });
      } else {
        navigate(`/mate/${boardId}`);
      }
    } else {
      navigate("/mate");
    }
  };

  return (
    <>
      <DetailTop>
        <BackButton onClick={handleBackClick}>
          <img src={BackIcon} alt="Back" />
        </BackButton>
      </DetailTop>
      <DetailTop>
        {isUpdateMode ? "Mate 게시물 수정" : "Mate 게시물 작성"}
      </DetailTop>

      <MateRegistCard
        title={title}
        content={content}
        total={total}
        fullFlag={fullFlag}
        matchId={matchId}
        onTitleChange={(e) => setTitle(e.target.value)}
        onContentChange={(e) => setContent(e.target.value)}
        onTotalChange={(e) => {
          if (e.target.value > 0) {
            setTotal(e.target.value);
          }
        }}
        onfullFlag={fullFlag}
        onMatchIdChange={(value) => setMatchId(value)}
        onSubmit={handleSubmit}
        buttonText={isUpdateMode ? "수정하기" : "작성하기"}
        handleFullFlag={handleFullFlag}
      />
    </>
  );
}

export default MateRegistPage;
