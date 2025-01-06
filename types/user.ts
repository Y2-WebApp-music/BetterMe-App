export type UserInfoProp = {
  firebase_uid: string,
  birth_date: Date,
  gender: number,
  weight: number,
  height: number,
  activity: number,
  calorie_need: number
}

export type UserGoalPublicProp = {
  goal_id: string[]
}

export type UserFollowProp = {
  firebase_uid: string[]
}