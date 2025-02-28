import { SERVER_URL } from '@env';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../../../../../context/themeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../../../../context/authContext';
import { GoalData, Task } from '../../../../../types/goal';
import BackButton from '../../../../../components/Back';
import { Image } from 'react-native';
import { DeleteIcon, OptionIcon } from '../../../../../constants/icon';

const { width } = Dimensions.get('window');
const circle_length = width * 0.62;
const r = circle_length / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
type CommunityGoalScreenProps = {
  end_date:string;
  goal_id:string;
  goal_name:string;
  description:string;
  start_date:string;
  task:Task[];
  total_task:number;
  complete_task:number;
  username:string;
  profile_img:string;


}
export default function CommunityGoalScreen() {
  const { user } = useAuth()
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [goalData, setGoalData] = useState<CommunityGoalScreenProps>({
    goal_id:'1',
    goal_name:'Lorem Ipsum is simply',
    description:'Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
    start_date:new Date().toDateString(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    task : [
      {
        task_name:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        status:false
      },
      {
        task_name:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        status:true
      },
      {
        task_name:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        status:true
      },
      {
        task_name:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        status:false
      },
      {
        task_name:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        status:false
      },

    ],
    total_task:5,
    complete_task:4,
    username: "loxia",
    profile_img:"https://picsum.photos/id/237/200/300"
  })

  const [isLoad, setIsLoad] = useState(true)
  const [err, setErr] = useState<string | null>('')

  // Fetch Data Here
  const fetchGoalData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/detail/${id}`);
      const data = response.data;

      const transformedData: GoalData = {
        goal_id: data.goal_id,
        goal_name: data.goal_name,
        description: data.description,
        start_date: new Date(data.start_date).toDateString(),
        end_date: new Date(data.end_date).toDateString(),
        task: data.task,
        total_task: data.task.length,
        complete_task: data.task.filter((task: Task) => task.status).length,
        public_goal: data.public_goal,
        create_by: data.create_by
      };

      setGoalData(transformedData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setErr('Unable to fetch data. Please try again later.');
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    fetchGoalData();
  }, []);

  // useEffect(()=>{
  //   console.log('========================================================================');
  //   goalData.task.map(data => {
  //     console.log(data);
  //   })
  // },[goalData])

  const percent = useMemo(() => Math.round((goalData.complete_task / goalData.total_task) * 100), [ goalData ]);
  const color = percent === 100 ? '#0dc47c' : '#FBA742';
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 1000 });
  }, [percent]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length * (1 - progress.value),
  }));


  const [warning, setWarning] = useState(false)
  const [index, setIndex] = useState<number>(0)


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoalData().finally(() => setRefreshing(false));
    // console.log('Fetch New data');
  }, []);


  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto" >
      <ScrollView
            className='w-full h-auto pb-20'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start',alignItems:'center', marginTop:0}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
      <TouchableWithoutFeedback>
        <View className='w-[92%]'>
          <View className='w-full mt-4'>
            <View className='w-full flex-row'>
              <View className='max-w-[14vw]'>
                <BackButton goto={'/home'}/>
              </View>
            </View>

            <View className='w-full flex gap-1 items-start justify-center mt-2'>
              <View className=' w-full flex-row items-center gap-1'>
              {isLoad?(
                <View className='w-full flex-row gap-2'>
                  <View className='w-[73%] flex-col gap-2'>
                    <View className='grow h-8 bg-DarkGray animate-pulse rounded-normal'/>
                    <View className='grow h-8 bg-DarkGray animate-pulse rounded-normal'/>
                  </View>
                  <View className={`w-[27%] h-28 bg-DarkGray animate-pulse rounded-full`}></View>
                </View>
              ):(
                <>
                  <View className='grow max-w-[80%]'>
                    <Text className='text-heading text-primary font-notoMedium'>{goalData.goal_name}</Text>
                  </View>
                  <View className='justify-center items-center'>
                    <Svg width={circle_length/2.8} height={circle_length/2.8} style={{ transform: [{ rotate: '270deg' }] }} >
                      <Circle
                        cx={circle_length/5.6}
                        cy={circle_length/5.6}
                        r={r}
                        fill="#E8E8E8"
                        stroke={'#E8E8E8'}
                        strokeWidth={6}
                      />
                      <AnimatedCircle
                        cx={circle_length/5.6}
                        cy={circle_length/5.6}
                        r={r}
                        fill="#E8E8E8"
                        stroke={color}
                        strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={circle_length}
                        animatedProps={animatedProps}
                      />
                      <Circle
                        cx={circle_length/5.6}
                        cy={circle_length/5.6}
                        r={r-5}
                        fill="#FBFFFF"
                        stroke='none'
                      />
                    </Svg>
                    <Text style={{color:color}} className=' absolute text-heading font-notoSemiBold'>{percent}%</Text>
                  </View>
                </>
              )}
              </View>
              {isLoad?(
                <View className=''>
                  {/* <View className='w-full bg-DarkGray h-20 mt-2 rounded-normal'/>
                  <View className='w-[40%] bg-DarkGray h-6 rounded-normal'/>
                  <View className='w-[40%] bg-DarkGray h-6 rounded-normal'>
                  </View> */}
                  <View className='w-full flex-row justify-between mt-1'>
                    <View className='w-[20%] bg-DarkGray h-8 rounded-normal'/>
                    <View className='w-[40%] bg-DarkGray h-8 rounded-normal'/>
                  </View>
                </View>
              ):(
                <>
                  <View className='w-full'>
                    {/* Description */}
                    <Text style={{color: colors.text}} className='text-subText font-noto text-body mb-3'>
                      {goalData.description}
                    </Text>

                    <View className="w-full flex-row items-start gap-4">
                      {/* User profile */}
                      <Image 
                        source={{ uri: goalData.profile_img }} 
                        style={{ width: 40, height: 40, borderRadius: 25 }} 
                      />

                      {/* Text Section */}
                      <View className="flex-row justify-between flex-1">
                        {/* "Create by" and Username */}
                        <View>
                          <Text style={{ color: colors.text }} className="text-subText font-notoLight text-[1rem]">
                            Create by
                          </Text>
                          <Text style={{ color: colors.text }} className="font-noto text-[1.0rem]">
                            {goalData.username}
                          </Text>
                        </View>

                        {/* Dates Section */}
                        <View>
                          <Text className="text-subText font-notoLight text-[1rem]">
                            Create: {format(goalData.start_date, 'd MMMM yyyy')}
                          </Text>
                          <Text className="text-subText font-notoLight text-[1rem]">
                            End: {format(goalData.end_date, 'd MMMM yyyy')}
                          </Text>
                        </View>
                      </View>
                    </View>

                  </View>
                
                  <View className='h-[1px] w-full bg-gray rounded-full'/>
                  <View className='flex-row justify-start items-center mt-1'>
                    <Text style={{color: colors.text } } className='grow text-heading3'>Task List</Text>
                    <Text className='text-subText font-noto'>{goalData.complete_task}/{goalData.total_task} completed</Text>
                  </View>
                </>
              )}
        
            </View>
          </View>
          <ScrollView
            className='w-full h-auto pb-20 mt-2'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
            showsVerticalScrollIndicator={false}
          >
            <View className='w-[100%] justify-center items-center pb-20'>
              {isLoad?(
                <View className='w-[100%] mt-2 flex-col gap-4'>
                  <View className='w-full h-12 bg-DarkGray animate-pulse rounded-normal'/>
                  <View className='w-full h-12 bg-DarkGray animate-pulse rounded-normal'/>
                  <View className='w-full h-12 bg-DarkGray animate-pulse rounded-normal'/>
                  <View className='w-full h-12 bg-DarkGray animate-pulse rounded-normal'/>
                  <View className='w-full h-12 bg-DarkGray animate-pulse rounded-normal'/>
                </View>
              ):(
                  <View className='w-[95%] mt-2 flex-col gap-4'>
                    <FlashList
                      data={goalData.task}
                      renderItem={({ item, index }) => (
                        <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <View className={`h-2 w-2 rounded-full ${item.status ? 'bg-green' : 'bg-gray'}`} />
                          <Text style={{ flex: 1, color: colors.text }}>
                            {item.task_name}
                          </Text>
                        </View>
                      )}
                      estimatedItemSize={200}
                    />
                      {/*"Add to Your Goal" */}
                  <TouchableOpacity 
                    className="bg-blue-500 flex-row items-center justify-center rounded-full px-4 py-2 mt-6"
                    style={{ alignSelf: 'center', width: '50%' }}
                    onPress={()=>{router.push(`/home/goal/create/123`)}}
                  >
                    <Text className="text-white font-bold text-base">Add to Your Goal</Text>
                  
                    <View className="w-6 h-6 bg-white rounded-full items-center justify-center ml-2">
                      <Text className="text-blue-500 text-l font-bold">+</Text>
                    </View>
                  </TouchableOpacity>

                  </View>




              )}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}