import Card from 'components/card/Card'
import React, { useEffect, useMemo, useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode, useColorModeValue, Table, Thead, Tr, Th, Flex, Tbody, Text, Icon, Td, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, FormControl, FormLabel, Input, Select, Button, } from '@chakra-ui/react'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import axios from 'axios';
import EmailProcessedLine from './EmailProcessedLine';
import EmailProcessedBar from './EmailProcessedBar';
import TrafficBreakDonut from './TrafficBreakDonut';
import TrafficBreakBar from './TrafficBreakBar';
import TopSendingBar from './TopSendingBar';
import TopReceivingBar from './TopReceivingBar';
import TopSendingPie from './TopSendingPie';
import TopReceivingPie from './TopReceivingPie';
import InOutBoundLine from './InOutBoundLine';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function MailboxMonitoringTable({ columns, data }) {
    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 10 } // Setting initial page size to 5
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        rows,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        initialState,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance;

    const { colorMode } = useColorMode();

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const optionColor = useColorModeValue('gray.800', 'gray.200');
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const accBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.400');
    const selectStyles = {
        color: textColor,
        bg: useColorModeValue('white', 'gray.700'),
        // borderColor: borderColor,
    };
    return (
        <>
            <Card
                direction='column'
                w='100%'
                h="380px"
                px='0px'
                overflowX={{ sm: "scroll", lg: "auto" }}
                mt={2}
            >
                {/* <Flex px='25px' justify='space-between' mb='20px' align='center'>
                                <Text
                                    color={textColor}
                                    fontSize='22px'
                                    fontWeight='700'
                                    lineHeight='100%'>
                                    Complex Table
                                </Text>
                                <Menu />
                            </Flex> */}
                <Table {...getTableProps()} variant='striped' colorScheme="ucValuation" mb='24px'>
                    <Thead>
                        {headerGroups.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        pe='10px'
                                        key={index}
                                        borderColor={borderColor}
                                    >
                                        <Flex
                                            justify='space-between'
                                            align='center'
                                            fontSize={{ sm: "10px", lg: "12px" }}
                                            color='gray.400'
                                        >
                                            {column.render("Header")}
                                        </Flex>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {page.map((row, index) => { // Changed from `rows` to `page`
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => (
                                        <Td
                                            {...cell.getCellProps()}
                                            key={index}
                                            fontSize={{ sm: "14px" }}
                                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                            borderColor='transparent'
                                        >
                                            {cell.render("Cell")}
                                        </Td>
                                    ))}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>

            </Card>
            <Flex justify="center" align="center" mt={4} mr={4}>
                {/* Select page size dropdown */}
                <Text mr={2}>Show:</Text>
                <Select
                    sx={{ option: { color: textColor } }}
                    w="100px"
                    mr={4}
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </Select>
                <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} mr={2}>
                    {'<<'}
                </Button>
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} mr={2}>
                    {'<'}
                </Button>
                <Text mr={2}>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </Text>
                <Button onClick={() => nextPage()} disabled={!canNextPage} mr={2}>
                    {'>'}
                </Button>
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </Button>
            </Flex>
        </>
    )
}

function MailboxMonitoringTabs() {
    // const { columnsData, tableData } = props;

    const columns = useMemo(() => [
        {
            Header: "MESSAGE ID",
            accessor: "email_id",
            Cell: ({ row }) => {
                const handleSet = () => {
                    localStorage.setItem("email_id", JSON.stringify(row.original));
                    window.location.href = `#/admin/emailanalysis/${row.original.id}`
                }
                return (
                    <Text onClick={handleSet} cursor='pointer'>{row.original.id}</Text>
                )
            }
        },
        {
            Header: "SENDER",
            accessor: "sender",
            Cell: ({ row }) => (
                <Text>{row.original.senderEmail}</Text>
            ),
        },
        {
            Header: "RECIPIENTS",
            accessor: "recipients",
            Cell: ({ row }) => (
                <Text>{row.original.recipient}</Text>
            ),
        },
        {
            Header: "SUBJECT",
            accessor: "subject",
            Cell: ({ row }) => (
                <Text>{row.original.subject}</Text>
            ),
        },
        {
            Header: "DATE",
            accessor: "date",
            Cell: ({ row }) => (
                <Text>{row.original.date}</Text>
            ),
        },
        {
            Header: "FINAL ACTION",
            accessor: "final_action",
        },
        // {
        //     Header: "ANALYSIS",
        //     accessor: "topic",
        // },
        // {
        //     Header: "STATUS",
        //     accessor: "status",

        // },

    ], []);

    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);

    const [months, setMonths] = useState(null);

      const [days, setDays] = useState(null);

      const [emailTraffic, setEmailTraffic] = useState(null);

      const [senderDomains, setSenderDomains] = useState(null);

      const [receiverDomains, setReceiverDomains] = useState(null);

    const [loading, setLoading] = useState(true);

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

    const tallyDaysAndMonths = async (arrayOfObjects) => {
        // Initialize tally objects for days of the week and months
        const dayTally = {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0
        };
        
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
          const { day, month } = obj;
      
          // Increment the corresponding day tally
          if (dayTally[day] !== undefined) {
            dayTally[day]++;
          }
      
          // Increment the corresponding month tally
          if (monthTally[month] !== undefined) {
            monthTally[month]++;
          }
        });
      
        setDays(dayTally);
        setMonths(monthTally);
      };

      
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/incident/get-mailbox', {
                    withCredentials: true, // Ensures the cookie is included in the request
                }); // Replace with your actual API endpoint
                console.log("FETCHED DATA: ", response);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTopSenderDomains = async (array) => {
        let senderDomainTally = {};
        array.forEach((obj) => {
            const { senderDomain } = obj;
            if (senderDomain!==undefined) {
                if (senderDomainTally[senderDomain] !== undefined ) {
                    senderDomainTally[senderDomain]++;
                } else {
                    senderDomainTally[senderDomain] = 0;
                }
            }
        });

        setSenderDomains(senderDomainTally);
    }

    const getTopReceiverDomains = async (array) => {
        let receiverDomainTally = {};
        array.forEach((obj) => {
            const { receiverDomain } = obj;
            if (receiverDomain!==undefined) {
                if (receiverDomainTally[receiverDomain] !== undefined ) {
                    receiverDomainTally[receiverDomain]++;
                } else {
                    receiverDomainTally[receiverDomain] = 0;
                }
            }
        });

        setReceiverDomains(receiverDomainTally);
    }

    useEffect(() => {
        if (data.length > 0) {
          tallyDaysAndMonths(data);
          tallyEmailCategories(data);
          getTopSenderDomains(data);
          getTopReceiverDomains(data);
        }
      }, [data]);

    const { colorMode } = useColorMode();

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const optionColor = useColorModeValue('gray.800', 'gray.200');
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const accBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.400');
    const selectStyles = {
        color: textColor,
        bg: useColorModeValue('white', 'gray.700'),
        // borderColor: borderColor,
    };
    const calendarIconColor = useColorModeValue(1, 0); // Light mode: invert (dark icon), Dark mode: no invert (light icon)

    const initialValues = {
        sender: '',
        timeDuration: '--Select Time Duration--',
        startDate: '',
        endDate: '',
        actionTaken: '--Select Action Taken--',
        recipient: '',
        subject: '',
    }

    const [filter, setFilter] = useState(initialValues);

    const handleFilterChange = (e) => {
        console.log("E TARGET: ",e.target.name);
        console.log("E TARGET: ",e.target.value);
        setFilter({ ...filter, [e.target.name]: e.target.value });
        console.log(filter);
    }

    const handleSave = () => {
        setTempData(data);
        const now = new Date();
        let startDate, endDate;
      
        if (filter.timeDuration === '24 Hours') {
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (filter.timeDuration === '72 Hours') {
          startDate = new Date(now.getTime() - 72 * 60 * 60 * 1000);
        } else if (filter.timeDuration === '1 Week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (filter.timeDuration === '1 Month') {
          startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else if (filter.timeDuration === 'Custom Date') {
          // Use the selected custom date range
          startDate = new Date(filter.startDate);
          endDate = new Date(filter.endDate);
        }
      
            const dateFilteredData = data.filter(email => {
            const emailDate = new Date(email.date); // Convert the email date string to a Date object
        
            if (filter.timeDuration === 'Custom Date') {
              return emailDate >= startDate && emailDate <= endDate;
            } else if (startDate) {
              return emailDate >= startDate;
            }
            return true;
          });
        
          // Now apply other filters for sender, recipient, and subject
          const finalFilteredData = dateFilteredData.filter(email => {
            const senderMatch = filter.sender ? email.senderEmail.toLowerCase().includes(filter.sender.toLowerCase()) : true;
            const recipientMatch = filter.recipient ? email.recipient.toLowerCase().includes(filter.recipient.toLowerCase()) : true;
            const subjectMatch = filter.subject ? email.subject.toLowerCase().includes(filter.subject.toLowerCase()) : true;
        
            return senderMatch && recipientMatch && subjectMatch;
          });

          setData(finalFilteredData);
    }

    const [expandedIndex, setExpandedIndex] = useState(null); // Manage expanded index state

    const handleCancel = () => {
        setExpandedIndex(null); // Set to null to close the Accordion
        setData(tempData);
        setFilter(initialValues);
    };

    useEffect(() => {
        const inputs = document.querySelectorAll('input[type="date"]');
        inputs.forEach(input => {
            if (colorMode === 'light') {
                input.classList.add('calendar-icon-light-mode');
                input.classList.remove('calendar-icon-dark-mode');
            } else {
                input.classList.add('calendar-icon-dark-mode');
                input.classList.remove('calendar-icon-light-mode');
            }
        });
    }, [colorMode]);
    return (
        <div>
            <Text fontSize="35px" fontWeight="600" >Mailbox Monitoring</Text>

            <Card overflow='auto' height='600px'>
                <Tabs >
                    <TabList>
                        <Tab _focus={{ boxShadow: "none" }}>Mail Search</Tab>
                        <Tab _focus={{ boxShadow: "none" }}>Analysis Reports</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Accordion allowToggle index={expandedIndex} onChange={setExpandedIndex} backgroundColor={accBgColor} >
                                <AccordionItem>
                                    <h2>
                                        <AccordionButton >
                                            <Box as='span' flex='1' textAlign='left' >
                                                Filter
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel>
                                        <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap="20px" mb="20px">
                                            <FormControl>
                                                <FormLabel>Sender</FormLabel>
                                                <Input type='text' placeholder='Sender' color={textColor} name='sender' id='sender' onChange={handleFilterChange} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Time Duration</FormLabel>
                                                <Select color={textColor} name='timeDuration' id='timeDuration' onChange={handleFilterChange} sx={{ option: { color: textColor } }} >
                                                    <option style={{ color: optionColor }}>--Select Time Duration--</option>
                                                    <option>24 Hours</option>
                                                    <option >72 hours</option>
                                                    <option >1 Week</option>
                                                    <option >1 Month</option>
                                                    <option >Custom Date</option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Action Taken</FormLabel>
                                                <Select color={textColor} name='actionTaken' id='actionTaken' onChange={handleFilterChange} sx={{ option: { color: textColor } }} >
                                                    <option >--Select Action Taken--</option>
                                                    <option >Quarantined</option>
                                                    <option >Sent</option>
                                                </Select>
                                                {/* <Input type='text' placeholder='Sender' /> */}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Recipient</FormLabel>
                                                <Input type='text' placeholder='Recipient' color={textColor} name='recipient' id='recipient' onChange={handleFilterChange} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Subject</FormLabel>
                                                <Input type='text' placeholder='subject' color={textColor} name='subject' id='subject' onChange={handleFilterChange} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>User Interaction with mail</FormLabel>
                                                <Input type='text' placeholder='User Interaction with mail' color={textColor} />
                                            </FormControl>
                                            {filter.timeDuration === 'Custom Date' ? (
                                                <>
                                                    <FormControl>
                                                        <FormLabel>From</FormLabel>
                                                        <Input type='date' placeholder='Recipient' color={textColor} name='startDate' id='startDate' onChange={handleFilterChange} className="date-input" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>To</FormLabel>
                                                        <Input type='date' placeholder='Recipient' color={textColor} name='endDate' id='endDate' onChange={handleFilterChange} className="date-input" />
                                                    </FormControl>
                                                </>
                                            ) : null}
                                            <Flex align='center' justify='start' mt='auto'>
                                                <Button
                                                    // me='100%'
                                                    // mb='50px'
                                                    w='80px'
                                                    // minW='100px'
                                                    // mt={{ base: "30px", "2xl": "auto" }}
                                                    variant='brand'
                                                    fontWeight='500'
                                                    onClick={handleSave}
                                                    mr={3}
                                                >
                                                    APPLY
                                                </Button>
                                                <Button w='80px'
                                                    backgroundColor='red.500'
                                                    color='white'
                                                    sx={{
                                                        _hover: {
                                                            backgroundColor: 'red.500', // Keeps the background color unchanged on hover
                                                            color: 'white',           // Keeps the text color unchanged on hover

                                                        }
                                                    }}
                                                    fontWeight='500' onClick={handleCancel}>CANCEL</Button>
                                            </Flex>
                                        </SimpleGrid>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            <MailboxMonitoringTable columns={columns} data={data} />
                        </TabPanel>
                        <TabPanel>
                            <Card
                                direction='column'
                                w='100%'
                                h="470px"
                                px='0px'
                                overflowX={{ sm: "scroll", lg: "auto" }}
                            >
                                <Text fontSize='26px' fontWeight='700' >Total Email Processed</Text>
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>                                    
                                {!loading && months && <EmailProcessedLine months={months} />}
                                {!loading && months && <EmailProcessedBar days={days} />}                            
                                </SimpleGrid>
                                <Text fontSize='26px' fontWeight='700' >Email Traffic Breakdown</Text>
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                                {!loading && months && <TrafficBreakDonut emailTraffic={emailTraffic} />}
                                {!loading && months && <TrafficBreakBar emailTraffic={emailTraffic} />}                                    
                                </SimpleGrid>
                                <Text fontSize='26px' fontWeight='700' >Top Sending and Receiving Domains</Text>
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                                    <TopSendingBar senderDomains={senderDomains} />
                                    <TopReceivingBar receiverDomains={receiverDomains} />
                                </SimpleGrid>
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                                    <TopSendingPie senderDomains={senderDomains} />
                                    <TopReceivingPie receiverDomains={receiverDomains} />
                                </SimpleGrid>
                                <Text fontSize='26px' fontWeight='700' >Inbound vs Outbound Traffic</Text>
                                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                                    <InOutBoundLine />
                                </SimpleGrid>
                            </Card>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
        </div>
    )
}

export default MailboxMonitoringTabs