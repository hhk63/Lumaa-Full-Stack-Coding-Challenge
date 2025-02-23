import { Task } from "../components/Tasks";

const BAD_REQUEST_STATUS = 400;

export const createNewUser = async (username: string, password: string): Promise<number> => {
    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method:"POST",
            body: JSON.stringify({
                username: username,
                user_password: password
            }),
            headers: {
                "Content-type":"application/json"
            }
    });
        const result = await response.json()
        if (result) {
            localStorage.setItem("user-token", JSON.stringify(result.token));
            localStorage.setItem("user-id", JSON.stringify(result.user_id));
        }
        return response.status;
    } catch (error) {
        console.log("ERROR", error);
        return BAD_REQUEST_STATUS;
    }
}

export const logInUser = async (username: string, password: string): Promise<number> => {
    try {
        const response = await fetch('http://localhost:5000/auth/login', {
            method: "POST",
            body: JSON.stringify({
                username: username,
                user_password: password
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        const result = await response.json();
        if (result) {
            localStorage.setItem("user-token", JSON.stringify(result.token));
            localStorage.setItem("user-id", JSON.stringify(result.user_id));
        }
        return response.status;
    } catch (error) {
        console.log("ERROR", error);
        return BAD_REQUEST_STATUS;
    }
}
interface AllTasksResponse {
    tasks: Task[]; //define tasks
    status: number;
}

interface ResponseTask {
    task_id: number;
    title: string;
    task_description: string;
    is_complete: boolean;
}

const formatTasks = (tasks: ResponseTask[]) => {
    return tasks.map((t: ResponseTask) => {
        return {
            id: t.task_id,
            title: t.title,
            description: t.task_description,
            completed: t.is_complete
        }
    })
}
export const getAllTasks = async (userId: string | null): Promise<AllTasksResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/tasks/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        const result = await response.json();
        return { tasks: formatTasks(result), status: response.status };
    } catch (error) {
        console.log("ERROR", error);
        return { tasks: [], status: BAD_REQUEST_STATUS };
    }
}

export const updateTaskStatus = async (taskId: number, status: boolean): Promise<number> => {
    try {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({
                status,
            }),
            headers: {
                "Content-type": "application/json"
            }
        
        });
        return response.status;
    } catch (error) {
        console.log("ERROR", error);
        return BAD_REQUEST_STATUS;
    }
}

export const deleteSingleTask = async (taskId: number): Promise<number> => {
    try {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: "DELETE",
            body: JSON.stringify({
                id: taskId
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        return response.status;
    } catch (error) {
        console.log("ERROR", error);
        return BAD_REQUEST_STATUS;
    }
}

interface NewTaskResponse {
    response: number;
    id: number;
}

export const createNewTask = async (title:string, description:string, status:boolean, userId:string | null) => {
    try {
        const response = await fetch('http://localhost:5000/tasks', {
            method: "POST",
            body: JSON.stringify({
                title: title,
                task_description: description,
                status: status,
                user_id: userId
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        const result = await response.json()
        console.log(response);
        return {status:response.status, id:result.task_id};
    } catch (error) {
        console.log("ERROR", error);
        return { status: BAD_REQUEST_STATUS, id: null };
    }
}