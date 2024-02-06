import React from "react";
import { Link } from "react-router-dom";
import {
  WaggleItemContainer,
  WaggleItemWriter,
  WaggleItemTitle,
  WaggleItemContent,
  WaggleItemInfoSection,
  WaggleItemInfoItem,
  WaggleItemSeparator,
} from "../../styles/BoardStyles/WaggleListStyle";
import { ReactComponent as LikeCount } from "../../assets/icon/likecount-icon.svg";
import { ReactComponent as Comment } from "../../assets/icon/comment-icon.svg";

function WaggleItemCard({ waggle, formatRelativeTime }) {
  return (
    <WaggleItemContainer>
      <WaggleItemWriter>{waggle.board.nickname}</WaggleItemWriter>
      <WaggleItemTitle>
        <Link
          to={`/waggle/${waggle.board.boardId}`}
          style={{ textDecoration: "none" }}
        >
          {waggle.board.title}
        </Link>
      </WaggleItemTitle>
      <WaggleItemContent>
        <Link
          to={`/waggle/${waggle.board.boardId}`}
          style={{ textDecoration: "none" }}
        >
          <p>{waggle.board.content}</p>
        </Link>
      </WaggleItemContent>
      <WaggleItemInfoSection>
        <WaggleItemInfoItem className="waggle-like">
          <LikeCount />
          좋아요 {waggle.likesCount}
        </WaggleItemInfoItem>
        <WaggleItemInfoItem className="waggle-comment">
          <Comment />
          댓글 {waggle.board.commentCount}
        </WaggleItemInfoItem>
        <WaggleItemInfoItem>
          {formatRelativeTime(waggle.board.createAt)}
        </WaggleItemInfoItem>
      </WaggleItemInfoSection>
      <WaggleItemSeparator />
    </WaggleItemContainer>
  );
}

export default WaggleItemCard;
