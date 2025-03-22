import { useEffect, useMemo, useState } from "react";

/**
 * Bad Example:
 * - The Dashboard component is responsible for displaying the user profile, notifications, and tasks.
 * - This violates the Single Responsibility Principle (SRP) because the component is responsible for more than one thing.
 */

export const DashboardBad = () => {
  const [user, _setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });
  const [notifications, _setNotifications] = useState([
    "New message",
    "Server update",
  ]);
  const [tasks, _setTasks] = useState(["Finish report", "Update project"]);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* User Profile */}
      <div>
        <h2>User Profile</h2>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>

      {/* Notifications */}
      <div>
        <h2>Notifications</h2>
        <ul>
          {notifications.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>

      {/* Tasks */}
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Good Example
 */

export const DashboardGood = () => {
  const [notifications, _setNotifications] = useState([
    "new task",
    "breaking news",
  ]);
  const [tasks, _setTask] = useState(["deploy server", "do accountanatce"]);

  return (
    <div>
      <UserProfile />
      <Notification notifications={notifications} />
      <Task tasks={tasks} />
    </div>
  );
};

type User = {
  name: string;
  email: string;
};

const UserProfile = () => {
  const [user, _setUser] = useState<User>({
    name: "Ashik Siraj",
    email: "ashik@yahoo.com",
  });

  useEffect(() => {
    // DO API CALL
    // DO ADITIONAL CALL
  }, []);

  const computedUser = useMemo(() => {
    // Do Additional Logic
    return user;
  }, [user]);

  const updateUser = (user: User) => {
    // DO API CALL
    // DO ADITIONAL CALL
    _setUser(user);
  };

  return <UserProfileContent user={computedUser} onUpdate={updateUser} />;
};

const UserProfileContent = ({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (user: User) => void;
}) => {
  return (
    <div>
      <h2>User Profile</h2>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <button
        onClick={() => {
          onUpdate({ name: "farooq", email: "email@example.com" });
        }}
      >
        Update
      </button>
    </div>
  );
};

export const Notification = ({
  notifications,
}: {
  notifications: string[];
}) => {
  return (
    <div>
      <div>
        {notifications.map((message) => (
          <li>{message}</li>
        ))}
      </div>
    </div>
  );
};

export const Task = ({ tasks }: { tasks: string[] }) => {
  return (
    <div>
      <div>
        {tasks.map((task) => (
          <li>{task}</li>
        ))}
      </div>
    </div>
  );
};
