import { Task } from "./goal"

type CommunityUser = {
  _id:string,
  username:string,
  profile_img:string,
  post:number,
  goal:number,
  follower:string[],
  following:string[],
  liked:string[]
};

type CommunityUserPost = {
  _id:string,
  username:string,
  profile_img:string,
};
// post and goal is length
// liked is list of liked post

export type PostContent = CommunityUserPost & {
  post_id:string
  date:string,
  content:string,
  tag:number[],
  like:number,
  comment:number,
  photo?:string[],
};
// like is length

export type Comment = CommunityUserPost & {
  content:string
  comment_date:string
};

export type CommunityGoal = CommunityUser & {
  goal_id: string
  goal_name: string
  start_date: string
  end_date: string
  description: string
  task: Task[]
  total_task: number
  complete_task: number
};

export type searchGoalCard = {
  goal_id: string
  goal_name: string
  total_task: number
  end_date: string
  start_date: string;
  complete_task: number;
  create_by:string;
}

export const TagCommunity = [
  { id: 1, text: 'clean food' },
  { id: 2, text: 'weight training' },
  { id: 3, text: 'healthy eating' },
  { id: 4, text: 'balanced diet' },
  { id: 5, text: 'cardio workout' },
  { id: 6, text: 'yoga practice' },
  { id: 7, text: 'meditation' },
  { id: 8, text: 'home workout' },
  { id: 9, text: 'meal prep' },
  { id: 10, text: 'low carb' },
  { id: 11, text: 'high protein' },
  { id: 12, text: 'vitamin rich' },
  { id: 13, text: 'hydration' },
  { id: 14, text: 'mental health' },
  { id: 15, text: 'fitness goals' },
  { id: 16, text: 'strength training' },
  { id: 17, text: 'running' },
  { id: 18, text: 'cycling' },
  { id: 19, text: 'sleep hygiene' },
  { id: 20, text: 'power nap' },
  { id: 21, text: 'intermittent fasting' },
  { id: 22, text: 'superfoods' },
  { id: 23, text: 'organic food' },
  { id: 24, text: 'healthy snacks' },
  { id: 25, text: 'smoothies' },
  { id: 26, text: 'stretching' },
  { id: 27, text: 'flexibility' },
  { id: 28, text: 'bodyweight exercises' },
  { id: 29, text: 'nutrition tips' },
  { id: 30, text: 'whole grains' },
  { id: 31, text: 'gut health' },
  { id: 32, text: 'immune boosting' },
  { id: 33, text: 'mindfulness' },
  { id: 34, text: 'posture correction' },
  { id: 35, text: 'active lifestyle' },
  { id: 36, text: 'plant-based diet' },
  { id: 37, text: 'low sugar' },
  { id: 38, text: 'healthy fats' },
  { id: 39, text: 'calorie counting' },
  { id: 40, text: 'portion control' },
  { id: 41, text: 'recovery' },
  { id: 42, text: 'strength building' },
  { id: 43, text: 'outdoor activities' },
  { id: 44, text: 'cycling workout' },
  { id: 45, text: 'gym routine' },
  { id: 46, text: 'herbal tea' },
  { id: 47, text: 'sleep schedule' },
  { id: 48, text: 'healthy habits' },
  { id: 49, text: 'protein shakes' },
  { id: 50, text: 'stress management' }
];

export const postDummy:PostContent[] = [
  {
    _id:'string',
    username:'Alex Kim',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[1,4,5,7],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490'],
  },
  {
    _id:'string',
    username:'EchoEnigma',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/240',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[11,14,15,17],
    like:4123,
    comment:1345,
  },
  {
    _id:'string',
    username:'VenomVortex',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[21,24,25,27],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490','https://picsum.photos/500'],
  },
  {
    _id:'string',
    username:'PhantomPhoenix',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/220',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[12,18,25,26],
    like:4123,
    comment:1345,
  },
  {
    _id:'string',
    username:'MysticMaverick',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/215',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[1,4,5,7],
    like:4123,
    comment:1345,
  },
  {
    _id:'string',
    username:'CyberSamurai77',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[16,24,35,42],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490','https://picsum.photos/500'],
  },
  {
    _id:'string',
    username:'LunarLynx',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[1,6,34,37],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490','https://picsum.photos/500'],
  },
  {
    _id:'string',
    username:'NovaNomad',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[1,4,5,7],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490','https://picsum.photos/500'],
  },
]

export const commentDummy:Comment [] = [
  {
    _id:'string',
    username:'NovaNomad',
    profile_img:'https://picsum.photos/270',
    content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    comment_date:'2025-02-04T05:54:45.558+00:00'
  },
  {
    _id:'string',
    username:'LunarLynx',
    profile_img:'https://picsum.photos/215',
    content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    comment_date:'2025-02-04T05:54:45.558+00:00'
  }
]
