export type UserInfoProp = {
  firebase_uid:string,
  birth:Date,
  gender:number,
  weight:number,
  height:number,
  activity:number,
  calories_need:number
}

export type UserGoalPublicProp = {
  goal_id:string[]
}

export type UserFollowProp = {
  firebase_uid:string[]
}