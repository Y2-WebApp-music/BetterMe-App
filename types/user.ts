import { User } from "firebase/auth"

export type UserData = User & {
  _id:string
  serverToken:string
  birth_date: Date
  gender: number
  weight: number,
  height: number,
  activity: number,
  calorie_need: number,
}

export type UserGoalPublicProp = {
  goal_id: string[]
}

export type UserFollowProp = {
  firebase_uid: string[]
}

export const gender = [
  {
    id:1,
    gender:'Male'
  },
  {
    id:2,
    gender:'Female'
  },
]

export const activity = [
  {
    id:1,
    title:'Sedentary',
    description:'Very little physical activity.'
  },
  {
    id:2,
    title:'Lightly Active',
    description:'Light physical activity 1-3 days a week.'
  },
  {
    id:3,
    title:'Moderately active',
    description:'Regular moderate exercise 3-5 days a week.'
  },
  {
    id:4,
    title:'Very active',
    description:'Hard physical activity or exercise 6-7 days a week.'
  },
  {
    id:5,
    title:'Extra active',
    description:'Extremely high physical activity levels, often more than once per day.'
  },
]