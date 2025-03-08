import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URL } from '@env';
import SleepGoal, { toggleSleep } from '../../components/sleep/sleepGoal';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../../context/themeContext';

describe('SleepGoal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SleepGoal />
      </ThemeProvider>
    );
    expect(getByText('Sleep time')).toBeTruthy();
  });

  it('toggles sleep state correctly', async () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <SleepGoal />
      </ThemeProvider>
    );
    const toggleButton = getByTestId('toggle-button');

    // Simulate pressing toggle
    fireEvent.press(toggleButton);
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
    
    // Check if text updates correctly
    expect(getByText(/Sleeping|Waking/)).toBeTruthy();
  });
});

describe('toggleSleep function', () => {
  it('stores sleep data on sleep start', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null); // No previous sleep data

    await toggleSleep();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(expect.stringContaining('sleepData'), expect.any(String));
  });

  it('calculates sleep duration and resets invalid data', async () => {
    const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(pastTime);

    await toggleSleep();

    // Log the calculation to verify
    console.log("Duration calculated for pastTime:", pastTime);
    
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sleepData'); // Less than 2 hours should be removed
  });

  it('sends valid sleep data to the server', async () => {
    // Mock the axios post response
    jest.spyOn(axios, 'post').mockResolvedValue({ data: 'success' });
  
    await toggleSleep();
  
    // Check that axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      `${SERVER_URL}/sleep/createSleep`,
      expect.objectContaining({
        total_time: expect.any(Number),
        date: expect.any(String),
        start_time: expect.any(String),
      })
    );
  });
});

describe('toggleSleep function - Time Calculation and Server Request', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates sleep duration correctly and sends to server', async () => {
    // Mock start sleep time at 22:00
    const sleepStartTime = new Date(2025, 2, 9, 22, 0, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => sleepStartTime);
    await AsyncStorage.setItem('sleepData', sleepStartTime.toISOString());

    // Mock wake-up time at 07:30
    const wakeUpTime = new Date(2025, 2, 10, 7, 30, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => wakeUpTime);

    // Debug: ตรวจสอบค่าใน resetIfNeeded
    console.log('Date in resetIfNeeded:', new Date().toISOString());

    // Call toggleSleep function
    const sleepDuration = await toggleSleep();

    expect(sleepDuration).toBe(540);

    expect(axios.post).toHaveBeenCalledWith(
      `${SERVER_URL}/sleep/createSleep`,
      expect.objectContaining({
        total_time: 540,
        date: expect.any(String),
        start_time: '22:00',
        end_time: '07:30',
      })
    );
  });
});