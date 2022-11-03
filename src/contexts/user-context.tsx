/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createContext, useContext, useMemo, useReducer } from "react";

const COURSESTORE_KEY = "AnswerSheetCourseKey";
const EMAIL_CONFIRM_STATUS = "EmailConfirmStatus";
const AUTH_KEY = "AnswerSheetAuthKey";

// User Context

type CourseType = {
    course: string;
    completedLessons: string[];
    currentLesson: string;
};

//  Context Type
export type UserContextType = {
    isLoggedIn: boolean | null;
    waitingConfirm: boolean | null;
    courseProgress: CourseType[];
    setLogin: () => void;
    sendEmail: () => void;
    receiveEmail: () => void;
    enrolCourse: (data: { course: string; lessonLink: string }) => void;
    lessonComplete: (data: {
        course: string;
        lessonLink: string;
        lesson: string;
    }) => void;
};

export const UserContext = createContext({} as UserContextType);

// User Reducer

const initialState = {
    isLoggedIn: false,
    waitingConfirm: false,
    courseProgress: [] as CourseType[],
};

const init = () => {
    if (typeof window === "undefined") return initialState;
    const loginStore = localStorage.getItem(AUTH_KEY);
    const emailConfirmStore = localStorage.getItem(EMAIL_CONFIRM_STATUS);
    const courseStore = localStorage.getItem(COURSESTORE_KEY);

    const courseParse =
        courseStore !== null
            ? (JSON.parse(courseStore) as CourseType[])
            : ([] as CourseType[]);
    const loginParse =
        loginStore !== null ? (JSON.parse(loginStore) as boolean) : false;
    const emailConfirmParse =
        emailConfirmStore !== null
            ? (JSON.parse(emailConfirmStore) as boolean)
            : false;

    return {
        ...initialState,
        isLoggedIn: loginParse,
        waitingConfirm: emailConfirmParse,
        courseProgress: courseParse,
    };
};

interface UserAction {
    type:
        | "LOGIN"
        | "CONFIRM_EMAIL_SENT"
        | "EMAIL_CONFIRMED"
        | "ENROLL_COURSE"
        | "LESSON_COMPLETE";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
}

function reducer(state: typeof initialState, action: UserAction) {
    switch (action.type) {
        case "LOGIN": {
            localStorage.setItem(AUTH_KEY, "true");
            return {
                ...state,
                isLoggedIn: true,
            };
        }
        case "CONFIRM_EMAIL_SENT": {
            localStorage.setItem(EMAIL_CONFIRM_STATUS, "true");
            return {
                ...state,
                waitingConfirm: true,
            };
        }
        case "EMAIL_CONFIRMED": {
            localStorage.setItem(EMAIL_CONFIRM_STATUS, "false");
            return {
                ...state,
                waitingConfirm: false,
            };
        }
        case "ENROLL_COURSE": {
            const courseProgress = [
                ...state.courseProgress,
                {
                    course: action.payload.course,
                    currentLesson: action.payload.lessonLink,
                    completedLessons: [],
                },
            ];
            localStorage.setItem(
                COURSESTORE_KEY,
                JSON.stringify(courseProgress)
            );
            return {
                ...state,
                courseProgress,
            };
        }
        case "LESSON_COMPLETE": {
            const courseProgress = state.courseProgress.map((cs) => {
                if (cs.course === action.payload.course) {
                    return {
                        ...cs,
                        completedLessons: [
                            ...cs.completedLessons,
                            action.payload.lesson,
                        ],
                        currentLesson: action.payload.lessonLink,
                    };
                }
                return cs;
            });
            localStorage.setItem(
                COURSESTORE_KEY,
                JSON.stringify(courseProgress)
            );
            return {
                ...state,
                courseProgress,
            };
        }
        default:
            return state;
    }
}

// User Context Provider

type TProps = {
    children: React.ReactNode;
};

export const UserProvider = ({ children }: TProps) => {
    const currentState = init();
    const [state, dispatch] = useReducer(reducer, currentState);

    const value = useMemo(
        () => ({
            ...state,
            setLogin: () => {
                dispatch({
                    type: "LOGIN",
                });
            },
            sendEmail: () => {
                dispatch({
                    type: "CONFIRM_EMAIL_SENT",
                });
            },
            receiveEmail: () => {
                dispatch({
                    type: "EMAIL_CONFIRMED",
                });
            },
            enrolCourse: (data: { course: string; lessonLink: string }) => {
                dispatch({
                    type: "ENROLL_COURSE",
                    payload: data,
                });
            },
            lessonComplete: (data: {
                course: string;
                lessonLink: string;
                lesson: string;
            }) => {
                dispatch({
                    type: "LESSON_COMPLETE",
                    payload: data,
                });
            },
        }),
        [state]
    );

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

// User Context Consumer hooks

export const useUser = () => useContext(UserContext);
