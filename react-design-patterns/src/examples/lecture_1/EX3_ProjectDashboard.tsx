import { useState, useEffect } from "react";

// 🚨 This component does too many things!
const ProjectDashboard = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState<{
    name: string;
    description: string;
    deadline: string;
    team: { id: number; name: string; avatar: string }[];
    comments: { id: number; text: string }[];
  } | null>(null);

  const [team, setTeam] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);

  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("In Progress");

  // Fetch Project Details
  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setTeam(data.team);
      })
      .catch(() => console.log("Error loading project"));
  }, [projectId]);

  // Fetch Comments
  useEffect(() => {
    fetch(`/api/projects/${projectId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => console.log("Error loading comments"));
  }, [projectId]);

  // Update Status
  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    console.log(`Project status updated to: ${newStatus}`);
  };

  // Handle Adding New Comment
  const addComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { id: Date.now(), text: newComment }]);
    setNewComment("");
  };

  return (
    <div>
      {/* Project Info */}
      {project ? (
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p>Deadline: {new Date(project.deadline).toDateString()}</p>
          <p>Status: {status}</p>
          <button onClick={() => updateStatus("Completed")}>
            Mark as Completed
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Team Members */}
      <h3>Team Members</h3>
      <ul>
        {team.map((member) => (
          <li key={member.id}>
            <img src={member.avatar} alt={member.name} width="30" />{" "}
            {member.name}
          </li>
        ))}
      </ul>

      {/* Comments Section */}
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={addComment}>Post</button>
    </div>
  );
};

export default ProjectDashboard;

/**
❌ Violates Separation of Concerns (SoC) → Handles data fetching, UI rendering, business logic, and state management all in one place.
❌ Breaks Single Responsibility Principle (SRP) → Should a single component really be responsible for project details, team members, status updates, and comments?
❌ Tightly Coupled & Hard to Maintain → If you want to change how the comments work, you'll have to touch unrelated parts of the code.
❌ Difficult to Test & Reuse → You can't reuse the team member list or comments elsewhere without copying logic.
*/

/**
 * ✅ Good Example
 */

type ITeam = { id: number; name: string; avatar: string };

type IComment = { id: number; text: string };

type IProject = {
  name: string;
  description: string;
  deadline: string;
  team: ITeam[];
  comments: IComment[];
};

export const DashboardGood = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState<IProject | null>(null);
  const [team, setTeam] = useState<ITeam[]>([]);
  const [comments, setCommnet] = useState<IComment[]>([]);
  const [status, setStatus] = useState("In Progress");

  useEffect(() => {
    fetchProject(projectId).then((project: IProject) => {
      setProject(project);
      setTeam(project?.team);
    });
  }, [projectId]);

  useEffect(() => {
    fetchComments(projectId).then((comments: IComment[]) => {
      setCommnet(comments);
    });
  }, [projectId]);

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    mutateStatus(projectId, newStatus);
  };

  return (
    <div>
      {project ? (
        <>
          <Project project={project} status={status} />
          <StatusUpdater status={status} onUpdate={updateStatus} />
          <Team team={team} />
          <CommentSection comments={comments} setComment={setCommnet} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const Project = ({
  project,
  status,
}: {
  project: IProject;
  status: string;
}) => {
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Deadline: {new Date(project.deadline).toDateString()}</p>
      <p>Status: {status}</p>
    </div>
  );
};

const Team = ({ team }: { team: ITeam[] }) => {
  return (
    <>
      <h3>Team Members</h3>
      <ul>
        {team.map((member) => (
          <li key={member.id}>
            <img src={member.avatar} alt={member.name} width="30" />{" "}
            {member.name}
          </li>
        ))}
      </ul>
    </>
  );
};

const CommentSection = ({
  comments,
  setComment,
}: {
  comments: IComment[];
  setComment: (comment: IComment[]) => void;
}) => {
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim() === "") return;
    setComment([...comments, { id: Date.now(), text: newComment }]);
    setNewComment("");
  };

  return (
    <div>
      {/* Comments Section */}
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={addComment}>Post</button>
    </div>
  );
};

const StatusUpdater = ({
  onUpdate,
}: {
  status: string;
  onUpdate: (newString: string) => void;
}) => {
  return (
    <button onClick={() => onUpdate("Completed")}>Mark as Completed</button>
  );
};

/**
 * utility functions
 * */

const mutateStatus = async (projectId: string, newStatus: string) => {
  await fetch(`/api/projects/${projectId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: newStatus }),
  });
};

const fetchProject = async (projectId: string) => {
  const res = await fetch(`/api/projects/${projectId}`);
  return res.json();
};

const fetchComments = async (projectId: string) => {
  const res = await fetch(`/api/projects/${projectId}/comments`);
  return res.json();
};
