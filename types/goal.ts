type goal = {
  goal_id: string
  goal_name: string
  total_task: number
}
export type homeGoalCardProp = goal & {
  complete_task: number
  end_date: string
}
export type calendarGoalCardProp = goal & {
  complete_task: number
}

export type GoalCreateCardProp = goal & {
  start_date: string
  create_by: string
  end_date: string
}

export type CommunityGoalCardProp = goal & {
  complete_task: number
}

export type Task = {
  task_name: string;
  status: boolean;
};

export type GoalData = goal & {
  end_date: string
  description: string;
  start_date: string;
  task: Task[];
  complete_task: number;
  public_goal:boolean;
  create_by:string;
};


export const goalDataDummy: homeGoalCardProp[] = [
  {
    goal_id: '1',
    goal_name: 'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date: (new Date()).toDateString(),
    total_task: 12,
    complete_task: 12,
  },
  {
    goal_id: '2',
    goal_name: 'Title 2',
    end_date: new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    total_task: 6,
    complete_task: 2,
  },
  {
    goal_id: '3',
    goal_name: 'Title 3',
    end_date: new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task: 6,
    complete_task: 3,
  },
]
export const goalCreateDataDummy: GoalCreateCardProp[] = [
  {
    goal_id: '1',
    goal_name: 'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    start_date: new Date().toDateString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task: 12,
    create_by: 'System'
  },
  {
    goal_id: '2',
    goal_name: 'Title 2',
    start_date: new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 90)).toDateString(),
    total_task: 6,
    create_by: 'guy nut'
  },
  {
    goal_id: '3',
    goal_name: 'Title 3',
    start_date: new Date(new Date().setDate(new Date().getDate() + 6)).toDateString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 80)).toDateString(),
    total_task: 6,
    create_by: 'manotham'
  },
]