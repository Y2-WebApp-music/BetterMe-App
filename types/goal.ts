type goal = {
  goal_id:string
  goal_name:string
  end_date:Date
  length_task:number
}
export type homeGoalCardProp = goal & {
  complete_task:number
}

export type GoalCreateCardProp = goal & {
  start_date:Date
  create_by:string
}

export type Task = {
  task_name: string;
  task_status: boolean;
};

export type GoalData = goal & {
  description: string;
  start_date: Date;
  task: Task[];
  complete_task: number;
};


export const goalDataDummy:homeGoalCardProp[] = [
  {
    goal_id:'1',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date(),
    length_task:12,
    complete_task:12,
  },
  {
    goal_id:'2',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)),
    length_task:6,
    complete_task:2,
  },
  {
    goal_id:'3',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    length_task:6,
    complete_task:3,
  },
]
export const goalCreateDataDummy:GoalCreateCardProp[] = [
  {
    goal_id:'1',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    start_date:new Date(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    length_task:12,
    create_by:'system'
  },
  {
    goal_id:'2',
    goal_name:'Title 2',
    start_date:new Date(new Date().setDate(new Date().getDate() + 45)),
    end_date:new Date(new Date().setDate(new Date().getDate() + 90)),
    length_task:6,
    create_by:'guy nut'
  },
  {
    goal_id:'3',
    goal_name:'Title 3',
    start_date:new Date(new Date().setDate(new Date().getDate() + 6)),
    end_date:new Date(new Date().setDate(new Date().getDate() + 80)),
    length_task:6,
    create_by:'manotham'
  },
]