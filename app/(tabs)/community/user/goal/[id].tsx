import { SERVER_URL } from '@env';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../../../../../context/themeContext';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../../../../context/authContext';
import { GoalData, Task } from '../../../../../types/goal';
import BackButton from '../../../../../components/Back';
import { DeleteIcon, OptionIcon } from '../../../../../constants/icon';
import { AddIcon } from '../../../../../constants/icon';
import { Image } from 'expo-image';
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
    goal_name:'',
    description:'',
    start_date:new Date().toDateString(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    task : [],
    total_task:5,
    complete_task:4,
    username: '',
    profile_img:'',
  })

  const [isLoad, setIsLoad] = useState(false)
  const [err, setErr] = useState<string | null>('')

  // Fetch Data Here
  const fetchGoalData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/community/goal/detail/${id}`);
      const data = response.data;
      const transformedData: CommunityGoalScreenProps = {
        goal_id: data.goal_id,
        goal_name: data.goal_name,
        description: data.description,
        start_date: new Date(data.start_date).toDateString(),
        end_date: new Date(data.end_date).toDateString(),
        task: data.task,
        total_task: data.task.length,
        complete_task: data.task.filter((task: Task) => task.status).length,
        username: data.username,
        profile_img:data.profile_img,
      };

      setGoalData(transformedData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setErr('Unable to fetch data. Please try again later.');
    } finally {
      setIsLoad(false);
    }
  };

  const percent = useMemo(() => Math.round((goalData.complete_task / goalData.total_task) * 100), [ goalData ]);
  const color = percent === 100 ? '#0dc47c' : '#FBA742';
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 1000 });
  }, [percent]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length * (1 - progress.value),
  }));

  useFocusEffect(
    useCallback(() => {
      fetchGoalData()
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoalData().finally(() => setRefreshing(false));
  }, []);

  const blurhash = 'UAQ0UC4-0K00TOEdxWjE0WS[xr-q02tlo|S1';

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
                        fill={colors.gray}
                        stroke={colors.gray}
                        strokeWidth={8}
                      />
                      <AnimatedCircle
                        cx={circle_length/5.6}
                        cy={circle_length/5.6}
                        r={r}
                        fill={colors.gray}
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
                        fill={colors.background}
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
                        source={goalData.profile_img}
                        style={{ width: 40, height: 40, borderRadius: 25 }}
                        placeholder={{blurhash}}
                        transition={200}
                      />

                      {/* Text Section */}
                      <View className="flex-row justify-between flex-1">
                        {/* "Create by" and Username */}
                        <View>
                          <Text style={{ color: colors.text }} className="font-notoLight text-[1rem]">
                            Create by
                          </Text>
                          <Text style={{ color: colors.text }} className="font-noto text-[1.0rem]">
                            {goalData.username}
                          </Text>
                        </View>

                        {/* Dates Section */}
                        <View>
                          <Text className="font-notoLight text-[1rem]"style={{color:colors.subText}}>
                            Create: {format(goalData.start_date, 'd MMMM yyyy')}
                          </Text>
                          <Text className="font-notoLight text-[1rem]"style={{color:colors.subText}}>
                            End: {format(goalData.end_date, 'd MMMM yyyy')}
                          </Text>
                        </View>
                      </View>
                    </View>

                  </View>
                
                  <View style={{backgroundColor:colors.gray}} className='h-[1px] w-full rounded-full'/>
                  <View className='flex-row justify-start items-center mt-1'>
                    <Text style={{color: colors.text } } className='grow text-heading3'>Task List</Text>
                    <Text className='font-noto'style={{color:colors.subText}}>{goalData.complete_task}/{goalData.total_task} completed</Text>
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
                          <View style={{backgroundColor:item.status ? colors.green : colors.nonFocus}} className={`h-3 w-3 rounded-full`} />
                          <Text style={{ flex: 1, color: colors.text }} className='text-body'>
                            {item.task_name}
                          </Text>
                        </View>
                      )}
                      estimatedItemSize={200}
                    />
                 </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <View className=' absolute bottom-10'>
        <TouchableOpacity
          className="bg-blue-500 flex-row items-center justify-center rounded-full px-4 py-2 mt-6"
          style={{ alignSelf: 'center', minWidth: '50%' }} 
          onPress={() => { router.push(`/home/goal/create/${goalData.goal_id}`) }}
          activeOpacity={0.7}
        >
          <Text className="text-white font-notoMedium text-body  text-center"> Add to Your Goal </Text>

          <View className="w-6 h-6  rounded-full items-center justify-center ml-3">
            <AddIcon width={26} height={26} color={'#fff'} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}