import { SERVER_URL } from '@env';
import axios from 'axios';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import BackButton from '../../../../components/Back';
import { DeleteIcon, OptionIcon } from '../../../../constants/icon';
import { useAuth } from '../../../../context/authContext';
import { GoalData, Task } from '../../../../types/goal';
import { FlashList } from '@shopify/flash-list';
import ConfirmDeleteModal from '../../../../components/modal/ConfirmDeleteModal';
import { useTheme } from '../../../../context/themeContext';

const { width } = Dimensions.get('window');
const circle_length = width * 0.62;
const r = circle_length / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function GoalScreen() {

  const systemTheme = useColorScheme();
  const { theme, colors } = useTheme();
  const { user } = useAuth()
  const { id } = useLocalSearchParams();

  const [goalData, setGoalData] = useState<GoalData>({
    goal_id:'1',
    goal_name:'goal_name',
    description:'description',
    start_date:new Date().toDateString(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    task : [
      {
        task_name:'Task 1',
        status:false
      },
    ],
    public_goal:true,
    create_by:'b3drtknfbxfd5oitw45ngjdkx',
    total_task:12,
    complete_task:9
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

  const [openModal,setOpenModal] = useState(false)
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const toggleOptions = () => { setOptionsVisible(!isOptionsVisible) };
  const closeOptions = () => { setOptionsVisible(false) };

  const toggleSwitch = async () => {
    try {
      const response = await axios.put(`${SERVER_URL}/goal/public/${goalData.goal_id}`,{
        public_goal:!goalData.public_goal
      })

      const data = response.data
      setGoalData((prev) => ({
        ...prev,
        public_goal:data.public_goal
      }));
    } catch(error){
      console.error('Failed to update public_goal:', err);
      setErr('Failed to update public_goal');
    }
  }

  const [warning, setWarning] = useState(false)
  const [index, setIndex] = useState<number>(0)

  const handleToggleTask = async (index: number) => {
    let data:any = null;

    try {
      const response = await axios.put(`${SERVER_URL}/goal/${id}/task-status`,{
        task_index: index,
        status: !goalData.task[index].status
      });

      data = response.data

      // console.log(data.message);
      // console.log(data.goal,' ',data.task);

    } catch (err) {
      console.error('Failed to update task-status:', err);
      setErr('Failed to update task-status');
    } finally {
      setIsLoad(false);
      setWarning(false)
    }

    setGoalData((prevData) => {
      const updatedTasks = [...prevData.task];
      updatedTasks[index] = data.task

      const totalTasks = updatedTasks.length;
      const completedTasks = updatedTasks.filter((task) => task.status).length;

      return {
        ...prevData,
        task: updatedTasks,
        total_task: totalTasks,
        complete_task: completedTasks,
      };
    });

    // console.log('task_index ',index);
    // console.log('task current status == ',goalData.task[index]);
    // console.log('set new task status to => ',!goalData.task[index].status);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoalData().finally(() => setRefreshing(false));
    // console.log('Fetch New data');
  }, []);

  const deleteGoal = async () => {
    console.log('Delete Goal');
    try {
      const response = await axios.delete(`${SERVER_URL}/goal/delete/${id}`);

      let data = response.data

      if (data.message == "Goal not found") {
        console.error('Can not find Goal ID')
        return
      }

      router.back()

    } catch (err) {
      console.error('Delete Goal Fail:', err);
      setErr('Failed to delete Goal');
    } finally {
      setWarning(false)
    }
  }

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-start items-center font-noto" >
      <ScrollView
            className='w-full h-auto pb-20'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start',alignItems:'center', marginTop:0}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
      <TouchableWithoutFeedback onPress={closeOptions}>
        <View className='w-[92%]'>
          <View className='w-full mt-4'>
            <View className='w-full flex-row'>
              <View className='max-w-[14vw]'>
                <BackButton goto={'/home'}/>
              </View>
              <View className='grow relative'>
                <TouchableOpacity className='items-end' onPress={toggleOptions}>
                  <OptionIcon width={22} height={22} color={colors.darkGray}/>
                </TouchableOpacity>
                {isOptionsVisible && (
                <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className='absolute z-20 right-0 top-6 min-h-24 min-w-32 rounded-normal border p-4 flex-col gap-2'>
                  <TouchableOpacity onPress={toggleSwitch} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-center items-center'>
                    <Switch
                      trackColor={{false: '#fff', true: '#0DC47C'}}
                      thumbColor={goalData.public_goal ? '#FFF' : '#fff'}
                      ios_backgroundColor="#FBFFFF"
                      onValueChange={toggleSwitch}
                      value={goalData.public_goal}
                    />
                    <Text style={{color:colors.subText}} className='font-noto text-heading3'>public this goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{setOpenModal(!openModal)}} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-center items-center'>
                    <DeleteIcon width={26} height={26} color={colors.darkGray} />
                    <Text style={{color:colors.subText}} className='font-noto text-heading3'>delete this goal</Text>
                  </TouchableOpacity>
                </View>
                )}
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
                    <Text style={{color:colors.subText}} className=' font-noto text-body'>{goalData.description}</Text>
                    <View className='flex-col pl-1'>
                      <Text style={{color:colors.subText}} className=' font-notoLight text-[1rem]'>Create :{format(goalData.start_date,'d MMMM yyyy')}</Text>
                      <Text style={{color:colors.subText}} className=' font-notoLight text-[1rem]'>End : {format(goalData.end_date,'d MMMM yyyy')}</Text>
                    </View>
                  </View>
                  <View className='flex-row justify-start items-center mt-1'>
                    <Text style={{color:colors.text}} className='grow text-heading3'>Task List</Text>
                    <Text style={{color:colors.subText}} className=' font-noto'>{goalData.complete_task}/{goalData.total_task} completed</Text>
                  </View>
                </>
              )}
              <View className='h-[2px] w-full bg-gray rounded-full'/>
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
                      <View style={{ marginBottom: 12 }}>
                        <BouncyCheckbox
                          size={25}
                          fillColor="#0DC47C"
                          // unFillColor={colors.white}
                          unFillColor={theme === "system" ? systemTheme == "dark"?colors.text:'#FFFFFF' : theme == "dark"?colors.text:'#FFFFFF'}
                          textComponent={<TextCheckBox taskName={item.task_name} isChecked={item.status} colors={"#fff"}/>}
                          textContainerStyle={{ marginLeft: 20 }}
                          iconStyle={{ borderColor: colors.gray, borderRadius: 6 }}
                          innerIconStyle={{ borderWidth: 2, borderRadius: 6, borderColor: '#E8E8E8' }}
                          isChecked={item.status}
                          useBuiltInState={false}
                          onPress={() => {
                            if (item.status) {
                              setIndex(index)
                              setWarning(true);
                            } else {
                              handleToggleTask(index);
                            }
                          }}
                          // disabled={item.status}
                        />
                      </View>
                    )}
                    estimatedItemSize={200}
                  />
                  <ConfirmDeleteModal
                    title={'Task'}
                    detail={'This will cancel Task. You can re-check it anytime.'}
                    isOpen={warning}
                    setIsOpen={setWarning}
                    handelDelete={() => { handleToggleTask(index); }}
                    deleteType={'Cancel'}
                  />
                </View>
              )}
            </View>
          </ScrollView>
            <ConfirmDeleteModal
              isOpen={openModal}
              setIsOpen={setOpenModal}
              title='goal'
              detail={'This will delete delete permanently. You cannot undo this action.'}
              handelDelete={deleteGoal}
              deleteType={'Delete'}
            />
        </View>
      </TouchableWithoutFeedback>

      </ScrollView>
    </SafeAreaView>
  );
}

const TextCheckBox = ({ taskName, isChecked, colors }: { taskName: string; isChecked: boolean; colors:string }) => (

  <View className="w-full">
    <Text
      className={`pl-3 w-[97%] font-noto text-body ${isChecked? 'text-green line-through':{colors}}`}
      style={{ color: !isChecked ? colors : "#0dc47c" }}
    >
      {taskName}
    </Text>
  </View>
);