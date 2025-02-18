import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import {
  MdAddTask,
  MdAttachEmail,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdPeople,
  MdPerson,
} from "react-icons/md";
import axios from "axios";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import TrafficBreakPie from "./components/TrafficBreakPie";
import TrafficBreakBar from "./components/TrafficBreakBar";
import InOutLine from "./components/InOutLine";
import RealTimeThreatBar from "./components/RealTimeThreatBar";
import RealTimeThreatPie from "./components/RealTimeThreatPie";
import ThreatsDetectedLine from "./components/ThreatsDetectedLine";
import ThreatTypeBreakPie from "./components/ThreatTypeBreakPie";
import TrafficBreakDownDonut from "./components/TrafficBreakDownDonut";
import ThreatTrendsArea from "./components/ThreatTrendsArea";
import ThreatTrendsBar from "./components/ThreatTrendsBar";
import { ToastContainer } from "react-toastify";
import TrafficBreakDonut from "../mailboxMonitoring/TrafficBreakDonut";
// import TrafficBreakBar from "./components/TrafficBreakPie";
import TrustedSenders from "./components/TrustedSender";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const [data, setData] = useState([]);
  const [incidentLogs, setIncidentLogs] = useState([]);
  const [email_no, set_email_no] = useState(0);
  const [vendors_no, set_vendors_no] = useState('0');
  const [users_no, set_users_no] = useState('0');

  const [emailTraffic, setEmailTraffic] = useState(null);

  const [threatSeverity, setThreatSeverity] = useState(null);

  const [months, setMonths] = useState(null);

  const PUBLIC_BACKEND_URL = "http://localhost:8080"


  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-incident-logs`, {
                withCredentials: true, // Ensures the cookie is included in the request
            }); // Replace with your actual API endpoint
            console.log("FETCHED INCIDENT LOGS: ", response);
            setIncidentLogs(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            
        }
    };

    fetchData();
}, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-mailbox`, {
                withCredentials: true, // Ensures the cookie is included in the request
            }); // Replace with your actual API endpoint
            console.log("FETCHED DATA: ", response);
            setData(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            
        }
    };

    fetchData();
}, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-mailbox`, {
                withCredentials: true, // Ensures the cookie is included in the request
            }); // Replace with your actual API endpoint
            console.log("FETCHED DATA: ", response);
            set_email_no(response.data.length.toString());
            
        } catch (error) {
            console.error('Error fetching data:', error);
            
        }
    };

    fetchData();
}, []);




useEffect(() => {
  const fetchData = async () => {
      try {
          const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-vendors`, {
              withCredentials: true, // Ensures the cookie is included in the request
          }); // Replace with your actual API endpoint
          console.log("FETCHED DATA: ", response);
          set_vendors_no(response.data.length.toString());
          
      } catch (error) {
          console.error('Error fetching data:', error);
          
      }
  };

  fetchData();
}, []);


useEffect(() => {
  const fetchData = async () => {
      try {
          const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-protected-users`, {
              withCredentials: true, // Ensures the cookie is included in the request
          }); // Replace with your actual API endpoint
          console.log("FETCHED USERS DATA: ", response);
          set_users_no(response.data.length.toString());
          
      } catch (error) {
          console.error('Error fetching data:', error);
          
      }
  };

  fetchData();
}, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${PUBLIC_BACKEND_URL}/incident/get-threat-severity`, {
                withCredentials: true, // Ensures the cookie is included in the request
            }); // Replace with your actual API endpoint
            console.log("FETCHED THREAT SEVERITY: ", response);
            setThreatSeverity(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            
        }
    };

    fetchData();
  }, []);


  
  const tallyEmailCategories = async (arrayOfObjects) => {
    const emailCategories = {
        clean: 0,
        phishing: 0,
        malicious: 0,
        unrated: 0
    };

    arrayOfObjects.forEach(obj => {
        const { emailCategory } = obj;
        if (emailCategories[emailCategory] != undefined ) {
            emailCategories[emailCategory]++;
        }
    });

    setEmailTraffic(emailCategories);
  };

  const tallyThreatSeverity = async (arrayOfObjects) => {
    const threatSeverity = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
    };

    arrayOfObjects.forEach(obj => {
        const { threatCategory } = obj;
        if (threatSeverity[threatCategory] != undefined ) {
            threatSeverity[threatCategory]++;
        }
    });

    setThreatSeverity(threatSeverity);
  };

  const tallyMonths = async (arrayOfObjects) => {
    
    const monthTally = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    };
  
    // Iterate over the array of objects
    arrayOfObjects.forEach(obj => {
      const month = obj.month;
  
    if (monthTally[month] !== undefined) {
        monthTally[month]++;
      }
    });
  
    setMonths(monthTally);
  };

useEffect(() => {
  if (data.length > 0) {
    tallyEmailCategories(data);
  }
}, [data]);

// New useEffect to log when months is updated
useEffect(() => {
  if (months !== null) {
    console.log("MONTHS UPDATED: ", months);
  }
}, [months]);

// UseEffect that updates months based on incidentLogs
useEffect(() => {
  if (incidentLogs.length > 0) {
    tallyMonths(incidentLogs);
  }
}, [incidentLogs]);



  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} >
      <Text fontSize="35px" fontWeight="600" >Dashboard</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdPeople} color={brandColor} />
              }
            />
          }
          name='Total users account connected'
          value={users_no}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachEmail} color={brandColor} />
              }
            />
          }
          name='Email Received'
          value={email_no}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdPerson} color={brandColor} />
              }
            />
          }
          name="VIP accounts"
          value="39"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Vendors connected'
          value={vendors_no}
        />
      </SimpleGrid>

      {/* <Text fontSize="30px" fontWeight="600" >Email Traffic Overview</Text> */}

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
      {months && <RealTimeThreatBar months = {months} /> }
        {threatSeverity && <RealTimeThreatPie threatSeverity={threatSeverity} />}
        {/* <TotalSpent /> */}
        {/* <DailyTraffic /> */}
        {/* <WeeklyRevenue /> */}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
      {months && <ThreatsDetectedLine months={months} /> }
        <ThreatTrendsBar />
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
        {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'> */}
        {/* <DailyTraffic /> */}
        {/* <TrafficBreakPie /> */}
        {/* <TrafficBreakBar /> */}
        {/* <ThreatTrendsArea /> */}
        {/* <PieCard /> */}
        {/* </SimpleGrid> */}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <ThreatTypeBreakPie />
        {emailTraffic && <TrafficBreakDownDonut emailTraffic={emailTraffic} />}
        {/* <ThreatsDetectedLine /> */}
        {/* <TotalSpent /> */}
        {/* <DailyTraffic /> */}
        {/* <WeeklyRevenue /> */}
        {/* <InOutLine /> */}
      </SimpleGrid>
        
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        {months && <RealTimeThreatBar months={months} />}
        {threatSeverity && <RealTimeThreatPie threatSeverity={threatSeverity} />}
        {/* Add TrustedSenders component here */}
        <TrustedSenders />
      </SimpleGrid>


      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
      <ToastContainer />
    </Box>
  );
}
