import React, { useState, useEffect } from "react";
import {
  NostraContainer,
  Img,
  NostraTitle,
} from "../../styles/main-styles/nostradamusStyle";
import dart from "../../assets/dart.png";
import axios from "../../api/axios";

export default function Nostradamus() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios.get(`/user/nostradamus`).then((response) => {
        setData(response.data);
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <NostraContainer>
        <NostraTitle>
          <Img src={dart} />
          <div>
            <b>노스트라다무스 랭킹</b>
          </div>
        </NostraTitle>
        <table>
          <thead>
            <tr className="tableTitle">
              <td className="rank"></td>
              <td className="nickname">닉네임</td>
              <td className="winBet">횟수</td>
              <td className="accurate">적중률</td>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="rank">{index + 1}</td>
                <td className="nickname">{item.nickname}</td>
                <td className="winBet">{item.winBet}</td>
                <td className="accurate">{item.accurate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </NostraContainer>
    </div>
  );
}
