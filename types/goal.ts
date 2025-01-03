export type homeGoalCardProp = {
  goal_id:string
  goal_name:string
  end_date:Date
  length_task:number
  complete_task:number
}

export const goalDataDummy = [
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