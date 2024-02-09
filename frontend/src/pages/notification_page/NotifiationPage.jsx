import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { NotificationState } from "../../global/NotificationState";
import axios from "../../api/axios";

function Notification() {
  const [notificationState, setNotificationState] =
    useRecoilState(NotificationState);

  useEffect(() => {
    axios
      .get("/user/users/notifications/read")
      .then(() => {
        setNotificationState((prev) => ({
          ...prev,
          notifications: [...prev.notifications, ...prev.newNotifications],
          newNotifications: [],
        }));
      })
      .catch(() => {});
  }, []);

  const navigate = useNavigate();

  const handleNotificationClick = (uri) => {
    navigate(`/${uri}`);
  };

  return (
    <div>
      <h1>알림 목록</h1>
      <ul>
        {/* 역순으로 보여주기 위해 reverse & [...]을 이용하여 깊은 복사 후 사용 */}
        {[...notificationState.notifications]
          .reverse()
          .map((notification, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleNotificationClick(notification.uri)}
              >
                {/* 여기에서 type에 따라 다른 이미지를 보여줄 수 있습니다. */}
                {notification.type === "GOAL" && (
                  <img src="goal_image_url" alt="Goal Icon" />
                )}
                {/* 내용을 보여줍니다. */}
                <p>{notification.content}</p>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Notification;
