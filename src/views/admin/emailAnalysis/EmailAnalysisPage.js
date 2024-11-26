import { Box, Button, Flex, FormControl, FormLabel, Input, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ModalContent, Divider, Select, } from '@chakra-ui/react';
import Card from 'components/card/Card';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import SPFCheckPie from '../incidentLog/SPFCheckPie';
import SPFResult from '../incidentLog/SPFResult';
import DKIMCheckPie from '../incidentLog/DKIMCheckPie';
import DMARCCheckPie from '../incidentLog/DMARCCheckPie';
import GaugeChart from './GaugeChart';
import AuthService from 'services/auth-service';

let details = '';

function EmailAnalysisPage() {
    const [emailDetails, setEmailDetails] = useState('');
    const location = useLocation();

    const { isOpen: isRemediationOpen, onOpen: onRemediationOpen, onClose: onRemediationClose } = useDisclosure();
    const { isOpen: isGaugeChartOpen, onOpen: onGaugeChartOpen, onClose: onGaugeChartClose } = useDisclosure();
    const { isOpen: isDomainAnalysisOpen, onOpen: onDomainAnalysisOpen, onClose: onDomainAnalysisClose } = useDisclosure();
    const { isOpen: isLinkAnalysisOpen, onOpen: onLinkAnalysisOpen, onClose: onLinkAnalysisClose } = useDisclosure();

    // Load email details from local storage or state
    useEffect(() => {
        details = localStorage.getItem('email_id');
        details = JSON.parse(details);
        console.log("Email details", details);
        console.log("Email details", details);
        if (details) {
            setEmailDetails(details);
        } else if (location.state && location.state.emailDetails) {
            setEmailDetails(location.state.emailDetails);
        }
    }, [location.state]);
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderTopColor = useColorModeValue("black", "white");
    const buttonBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300");

    const data = React.useMemo(() => [
        {
            "attack_score": emailDetails.emailSeverityScore,
            "attackType": emailDetails.emailCategory==="clean"? 'Nil': emailDetails.emailCategory,
            "attactTags": "", // Placeholder for other data you might want to display
        }
    ], [emailDetails]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Attack Score',
                accessor: 'attack_score'
            },
            {
                Header: 'Attack Type',
                accessor: 'attackType'
            },
            {
                Header: 'Attack Tags',
                accessor: 'attactTags'
            },
        ], []);

    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "0px 18px 40px rgba(112, 144, 176, 0.12)"
    );
    const tableInstance = useTable(
        {
            columns,
            data,
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
    } = tableInstance;
    initialState.pageSize = 5;

    let ipAddress = null;
    let ipAnalysisStats = null;
    let no_of_vendors = 0;
    let malicious_stats = 0;
    let ipCountry = null;
    let domainAnalysisUrl = null;
    let domainAnalysisCategory = null;
    let domainAnalysisStats = null;

    let linkAnalysisStats = null;
    let linkAnalysisUrls = [];

    let fileAnalysis = null;
    let fileAnalysisSHA256 = null;
    let fileName = null;
    let fileSize = null;
    let fileType = null;
    let fileDate = null;
    
    if (emailDetails && emailDetails.ipAnalysis && emailDetails.ipAnalysis.data.id && emailDetails.ipAnalysis.data && emailDetails.ipAnalysis.data.attributes && emailDetails.ipAnalysis.data.attributes.last_analysis_stats && emailDetails.ipAnalysis.data.attributes.country) {
        ipAnalysisStats = emailDetails.ipAnalysis.data.attributes.last_analysis_stats;
        no_of_vendors = Object.values(ipAnalysisStats).reduce((a, b) => a + b, 0);
        ipCountry = emailDetails.ipAnalysis.data.attributes.country;
        ipAddress = emailDetails.ipAnalysis.data.id;
        console.log("NO OF VENDORS", no_of_vendors);
        malicious_stats = ipAnalysisStats.malicious;
        console.log(malicious_stats);
    } else {
        console.log("ipAnalysis or necessary fields are missing in emailDetails");
    }

    if (emailDetails && emailDetails.domainAnalysis[0]["url"] && emailDetails.domainAnalysis[0]["category"] && emailDetails.domainAnalysis[0]) {
        domainAnalysisCategory = emailDetails.domainAnalysis[0]["category"];
        domainAnalysisUrl = emailDetails.domainAnalysis[0]["url"];
        domainAnalysisStats = emailDetails.domainAnalysis[0];
    }

    if(emailDetails && emailDetails.analysisArray) {
        linkAnalysisStats = emailDetails.analysisArray;
        let no_of_urls = emailDetails.analysisArray.length;
        for (let i = 0; i<no_of_urls; i++) {
            if (emailDetails.analysisArray[i]["url"]) {
                linkAnalysisUrls.push(emailDetails.analysisArray[i]["url"]);            
            } else {
                console.log("Missing url");
            }
        }

        // fileAnalysis = emailDetails.fileAnalysis;
        // fileAnalysisSHA256 = emailDetails["fileAnalysis"]["data"]["attributes"]["sha256"];
        // fileName = emailDetails.fileAnalysis.data.attributes.names[0];
        // fileSize = formatFileSize(emailDetails.fileAnalysis.data.attributes.size);
        // fileType = emailDetails.fileAnalysis.data.attributes.type_tag; //check tag_description too
        // fileDate = convertUnixToDate(emailDetails.fileAnalysis.data.attributes.last_submission_date);
    }


    // if (emailDetails && emailDetails.fileAnalysis && emailDetails.fileAnalysis.data && emailDetails.fileAnalysis.data.attributes && emailDetails.fileAnalysis.data.attributes.size && emailDetails.fileAnalysis.data.attributes.sha256 && emailDetails.fileAnalysis.data.attributes.name) {
    //     fileAnalysis = emailDetails.fileAnalysis;
    //     fileAnalysisSHA256 = emailDetails["fileAnalysis"]["data"]["attributes"]["sha256"];
    //     fileAnalysisSHA256 = emailDetails.fileAnalysis.data.attributes.sha256;
    //     fileName = emailDetails.fileAnalysis.data.attributes.names[0];
    //     fileSize = formatFileSize(emailDetails.fileAnalysis.data.attributes.size)
    // }


    if (emailDetails && emailDetails.fileAnalysis?.data?.attributes) {
        const { sha256, size, names } = emailDetails.fileAnalysis.data.attributes;
        fileAnalysisSHA256 = sha256;
        fileName = names[0];
        fileSize = formatFileSize(size);
    }
    

    function convertUnixToDate(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleDateString("en-GB", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function formatFileSize(bytes) {
        const kb = 1024;
        const mb = kb * 1024;
    
        if (bytes >= mb) {
            return (bytes / mb).toFixed(2) + ' MB';
        } else if (bytes >= kb) {
            return (bytes / kb).toFixed(2) + ' KB';
        } else {
            return bytes + ' Bytes';
        }
    }

    const handleQuarantine = async() => {
        try {
            const authService = new AuthService();
            const response = await authService.quarantine(emailDetails.id);
            console.log(response);
            //return history.push("/admin/mailboxmonitoring");
            window.location.href = "/admin/mailboxmonitoring";
        } catch (error) {
            console.log("Quarantine Handler Error: ", error);
        }
    }

    const handleLinkAnalysisClick = async(url) => {
        try {
            const parsedUrl = new URL(url);  // Parse the URL
            const domain_name = parsedUrl.hostname;
            console.log(domain_name); 
            window.open(`https://www.virustotal.com/gui/search/${domain_name}`, "_blank");
        } catch (error) {
            
        }
    }

    return (
        // <div>Hello{emailId.email_id}</div>
        <Card>
            {/* <h1>Email Analysis</h1>
            {emailDetails && (
                <div>
                    <p>Email ID: {emailDetails.emailId}</p>
                    <p>Email: {emailDetails.email}</p>
                    <p>Sender: {emailDetails.sender}</p>
                    <p>Subject: {emailDetails.subject}</p>
                    <p>Recipients: {emailDetails.recipients}</p>
                    <p>Attack Type: {emailDetails.attackType}</p>
                    <p>Impersonated Party: {emailDetails.impParty}</p>
                    <p>attack Score: {emailDetails.attack_score}</p>
                </div>
            )} */}
            <Flex align='center' justify='flex-end'>
                <Button onClick={onRemediationOpen} borderRadius={5} backgroundColor={buttonBgColor} >Remediation</Button>
            </Flex>
            <Modal isOpen={isRemediationOpen} onClose={onRemediationClose}>
                <ModalOverlay />
                <ModalContent maxW='-webkit-fit-content'>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt={4}>
                        <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap="20px" mb="20px">
                            <Button backgroundColor='blue.300' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'blue.400', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}
                                onClick={handleQuarantine}
                            >Quarantine</Button>
                            <Button backgroundColor='green.300' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'green.500', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}>Deletion</Button>
                            <Button backgroundColor='red.300' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'red.500', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}>Blocklist</Button>
                        </SimpleGrid>
                        <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap="20px" mb="20px">
                            <Button backgroundColor='orange.200' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'orange.500', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}>Rollback</Button>
                            <Button backgroundColor='pink.300' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'pink.500', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}>Password Reset</Button>
                            <Button backgroundColor='purple.300' color='white' borderRadius={5}
                                sx={{
                                    _hover: {
                                        backgroundColor: 'purple.500', // Keeps the background color unchanged on hover
                                        color: 'white',           // Keeps the text color unchanged on hover
                                    }
                                }}>Account Lockdown</Button>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter margin='auto'>
                        <Button onClick={onRemediationClose} backgroundColor='red.500' color='white' w='80px'
                            fontWeight='500' borderRadius={5}
                            sx={{
                                _hover: {
                                    backgroundColor: 'red.500', // Keeps the background color unchanged on hover
                                    color: 'white',           // Keeps the text color unchanged on hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Text fontSize='24px' fontWeight='700'>Verdict</Text>
            <Card boxShadow={cardShadow}>
                <Table {...getTableProps()} variant='striped' colorScheme="ucValuation" mb='24px'>
                    <Thead>
                        {headerGroups.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        pe='10px'
                                        key={index}
                                        borderColor={borderColor}>
                                        <Flex
                                            justify='space-between'
                                            align='center'
                                            fontSize={{ sm: "10px", lg: "12px" }}
                                            color='gray.400'>
                                            {column.render("Header")}
                                        </Flex>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()} fontWeight='500'>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => {

                                        return (
                                            <Td
                                                {...cell.getCellProps()}
                                                fontSize={{ sm: "14px" }}
                                                minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                                borderColor='transparent'>
                                                {cell.render('Cell')}

                                            </Td>
                                        );
                                    })}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Card>
            <Card boxShadow={cardShadow} mt={2}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
                    <div>
                        <Text
                            color='black'
                            style={{
                                background: "#d1d1d2",
                                textAlign: "center",
                                borderRadius: "5px",
                                marginBottom: "20px",
                            }}
                        >
                            Sender Info
                        </Text>
                        <FormControl isReadOnly>
                            <Flex align='center'>
                                <FormLabel w='152px'>Name :</FormLabel>
                                <Input value={emailDetails.senderName} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4} >
                            <Flex align='center'>
                                <FormLabel w='152px'>Email :</FormLabel>
                                <Input value={emailDetails.senderEmail} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Domain :</FormLabel>
                                <Input value={emailDetails.senderDomain} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Geolocation :</FormLabel>
                                <Input color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>IP :</FormLabel>
                                <Input value={emailDetails.senderIP} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Authentication :</FormLabel>
                                <Input color={textColor} />
                            </Flex>
                        </FormControl>
                    </div>
                    <di>
                        <Text
                            color='black'
                            style={{
                                background: "#d1d1d2",
                                textAlign: "center",
                                borderRadius: "5px",
                                marginBottom: "20px",
                            }}
                        >
                            Information Display
                        </Text>
                        <FormControl isReadOnly>
                            <Flex align='center'>
                                <FormLabel w='152px'>Subject :</FormLabel>
                                <Input value={emailDetails.subject} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4} >
                            <Flex align='center'>
                                <FormLabel w='152px'>Message Id :</FormLabel>
                                <Input value={emailDetails.id} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Recipient :</FormLabel>
                                <Input value={emailDetails.recipient} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Sender :</FormLabel>
                                <Input value={emailDetails.senderEmail} color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Return Path :</FormLabel>
                                <Input color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl isReadOnly mt={4}>
                            <Flex align='center'>
                                <FormLabel w='152px'>Date :</FormLabel>
                                <Input value={emailDetails.date} color={textColor} />
                            </Flex>
                        </FormControl>
                    </di>
                </SimpleGrid>
            </Card>
            <Text fontSize='24px' fontWeight='700' mt={2}>Detection Report</Text>
            <Card boxShadow={cardShadow} >
                <Tabs >
                    <TabList>
                        <Tab>Header Analysis</Tab>
                        <Tab>IP Check</Tab>
                        <Tab>Domain Analysis</Tab>
                        <Tab>Link Analysis</Tab>
                        <Tab>File Analysis</Tab>                        
                    </TabList>
                    <TabPanels>
                        <TabPanel>            
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb='20px' mx='auto' alignContent='center'>
                                    {/*<SPFCheckPie status={emailDetails.spf}/>*/}
                                    <SPFResult status={emailDetails.spf} />
                                    {/* <DKIMCheckPie /> */}
                                </SimpleGrid>
                                {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb='5px'>
                                    <DMARCCheckPie />
                                </SimpleGrid> */}
                        </TabPanel>
                        <TabPanel>
                        <GaugeChart value={malicious_stats} total={no_of_vendors} onClick={onGaugeChartOpen}/>
                            <Modal isOpen={isGaugeChartOpen} onClose={onGaugeChartClose} >
                                <ModalOverlay />
                                <ModalContent maxW='-webkit-fit-content'>
                                <ModalHeader></ModalHeader>
                                <ModalCloseButton />
                                <ModalBody mt={4}>
                                
                                <Textarea value={`IP Address: ${JSON.stringify(ipAddress, null, 1)} \n Vendor Analysis: ${JSON.stringify(ipAnalysisStats, null, 1)} \n Country: ${JSON.stringify(ipCountry, null, 1)} \n `} readOnly width="400px" height="400px" />                                    
                                </ModalBody>
                                </ModalContent>
                            </Modal>
                        </TabPanel>
                        <TabPanel>
                            <Box
                                width="100%"
                                height="400px"
                                fontFamily="monospace"
                                color="white"
                                p={4}
                                overflow="auto"
                                whiteSpace="pre-wrap"
                            >
                                {`${JSON.stringify(domainAnalysisStats, null, 2)} \n`}

                                Domain: {JSON.stringify(domainAnalysisUrl, null, 2)}
                                <br />
                                Domain Classification: {JSON.stringify(domainAnalysisCategory, null, 2)}
                                <br />
                                {/* Clickable part for analysis details */}
                                <Text as="span" color="blue.500" cursor="pointer" onClick={() => window.open(`https://www.virustotal.com/gui/search/${domainAnalysisUrl}`, "_blank")}>
                                (Click for analysis details)
                                </Text>
                            </Box>

                            {/* Modal for domain analysis */}
                            <Modal isOpen={isDomainAnalysisOpen} onClose={onDomainAnalysisClose}>
                                <ModalOverlay />
                                <ModalContent maxW="400px">
                                <ModalHeader></ModalHeader>
                                <ModalCloseButton />
                                <ModalBody mt={4}>
                                    <Textarea
                                    value={`${JSON.stringify(domainAnalysisStats, null, 2)} \n`}
                                    readOnly
                                    width="400px"
                                    height="400px"
                                    />
                                </ModalBody>
                                </ModalContent>
                            </Modal>
                        </TabPanel>

                        <TabPanel>
                            <Box
                                width="100%"
                                height="400px"
                                fontFamily="monospace"
                                color="white"
                                p={4}
                                overflow="auto"
                                whiteSpace="pre-wrap"
                            >
                            
                            {`Analysis Results: \n${JSON.stringify(linkAnalysisStats, null, 2)} \n`}
                                   

                                {linkAnalysisUrls.map((url, index) => (
                                    <Box key={index}>
                                        <Text as="span" color="blue.500" cursor="pointer" onClick={() => {handleLinkAnalysisClick(url)}}>
                                            {url}
                                        </Text>
                                        <br />
                                    </Box>
                                ))} 
                            </Box>
                            
                            <Modal isOpen={isLinkAnalysisOpen} onClose={onLinkAnalysisClose}>
                                <ModalOverlay />
                                <ModalContent maxW="400px">
                                <ModalHeader></ModalHeader>
                                <ModalCloseButton />
                                <ModalBody mt={4}>
                                    <Textarea
                                    value={`${JSON.stringify(linkAnalysisStats, null, 2)} \n`}
                                    readOnly
                                    width="400px"
                                    height="400px"
                                    />
                                </ModalBody>
                                </ModalContent>
                            </Modal>                        
                        </TabPanel>
                        <TabPanel>
                            <Textarea
                                value={` Name of file: ${fileName} \n Sha256: ${fileAnalysisSHA256} \n FILE SIZE: ${fileSize} \n File Type: ${fileType} \n Submission Date: ${fileDate} \n ${JSON.stringify(fileAnalysis)}`}
                                //value={`FILE ${JSON.stringify(emailDetails.fileAnalysis, null, 1)}`}
                                readOnly
                                width="100%"
                                height="400px"
                                // fontFamily="monospace"
                                // bgColor="gray.100"
                                // color="black"
                                // p={4}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
            <Text fontSize='24px' fontWeight='700' mt={2}>Content Analysis</Text>
            <Card boxShadow={cardShadow} >
                <Flex align='center' justify='space-between'>
                    <Card width='70%'>
                        <FormControl>
                            <Flex align='center'>
                                <FormLabel width='100px'>From:</FormLabel>
                                <Input value={emailDetails.senderEmail} type='text' color={textColor} isReadOnly />
                            </Flex>
                        </FormControl>
                        <FormControl mt={2}>
                            <Flex align='center'>
                                <FormLabel width='100px'>To:</FormLabel>
                                <Input value={emailDetails.recipient} type='text' color={textColor} isReadOnly />
                            </Flex>
                        </FormControl>
                        <FormControl mt={2}>
                            <Flex align='center'>
                                <FormLabel width='100px'>Subject:</FormLabel>
                                <Input value={emailDetails.subject} type='text' color={textColor} />
                            </Flex>
                        </FormControl>
                        <FormControl mt={2}>
                            <Flex align='center'>
                            <FormLabel width='100px'>Message Body:</FormLabel>
                                <Textarea readOnly value={emailDetails.body} placeholder='Message Body...' rows={6} color={textColor} />
                            </Flex>
                        </FormControl>
                        {/* <Divider mt={2} /> */}
                        <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap="20px" mt='5px' borderTop={`1px solid ${borderTopColor}`}>
                            <FormControl>
                                <FormLabel>Language Score</FormLabel>
                                <Input value={emailDetails.score_analysis} color={textColor} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Sentiment</FormLabel>
                                <Input value={emailDetails.sentiment_analysis} type='text' color={textColor} isReadOnly />                    
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tone</FormLabel>
                                <Input value={emailDetails.tone_analysis} type='text' color={textColor} isReadOnly />                                                
                            </FormControl>
                        </SimpleGrid>
                    </Card>
                    <Card ml={2} width='30%'>
                        <Text textAlign='center' fontSize='18px' fontWeight='700'>Campaign Activities</Text>
                        <FormControl mt={4} isReadOnly>
                            <FormLabel>Received Emails</FormLabel>
                            <Input color={textColor} />
                        </FormControl>
                        <FormControl mt={4} isReadOnly>
                            <FormLabel>Opened by User</FormLabel>
                            <Input color={textColor} />
                        </FormControl>
                        <FormControl mt={4} isReadOnly>
                            <FormLabel>Forwarded by User</FormLabel>
                            <Input color={textColor} />
                        </FormControl>
                        <FormControl mt={4} isReadOnly>
                            <FormLabel>Replied by User</FormLabel>
                            <Input color={textColor} />
                        </FormControl>
                    </Card>
                </Flex>
            </Card >
        </Card >
    );
}

export default EmailAnalysisPage;


/*
  "data": {
    "id": "17853a0db83f8d1756c047efeec4b1c3f080ca814d996606d8d1e30dcb0479e1",
    "type": "file",
    "links": {
      "self": "https://www.virustotal.com/api/v3/files/17853a0db83f8d1756c047efeec4b1c3f080ca814d996606d8d1e30dcb0479e1"
    },
    "attributes": {
      "size": 695416,
      "sha256": "17853a0db83f8d1756c047efeec4b1c3f080ca814d996606d8d1e30dcb0479e1",
      "type_description": "PDF",
      "last_submission_date": 1726640705,
      "ssdeep": "12288:4g2bWQn1ptZph115LbeBwgzBLEY2gxAIYGshjlVxjYkxA3BRNwZJj2allhBPJl:4g61ptZpv1gBlBLEWVYGsJlrjY2AtwzR",
      "pdf_info": {
        "encrypted": 0,
        "openaction": 0,
        "header": "%PDF-1.6",
        "num_object_streams": 2,
        "num_obj": 76,
        "num_endstream": 38,
        "flash": 0,
        "embedded_file": 0,
        "jbig2_compression": 0,
        "num_endobj": 76,
        "xfa": 0,
        "javascript": 0,
        "js": 0,
        "startxref": 1,
        "xref": 2,
        "num_stream": 38,
        "acroform": 0,
        "num_launch_actions": 0,
        "num_pages": 3,
        "suspicious_colors": 0,
        "trailer": 2,
        "autoaction": 0
      },
      "type_tag": "pdf",
      "names": [
        "A2en.pdf",
        "file-6770960_"
      ],
      "trid": [
        {
          "file_type": "Adobe Portable Document Format",
          "probability": 100
        }
      ],
      "first_submission_date": 1393305294,
      "sandbox_verdicts": {
        "Zenbox": {
          "category": "harmless",
          "confidence": 100,
          "sandbox_name": "Zenbox",
          "malware_classification": [
            "CLEAN"
          ]
        }
      },
      "reputation": 0,
      "sha1": "a96c7eee033c2fa7975217becaeeacc9813e86b5",
      "unique_sources": 6,
      "tags": [
        "pdf",
        "checks-user-input",
        "checks-network-adapters"
      ],
      "type_tags": [
        "document",
        "pdf"
      ],
      "meaningful_name": "A2en.pdf",
      "type_extension": "pdf",
      "last_analysis_date": 1708032112,
      "last_modification_date": 1726640705,
      "times_submitted": 14,
      "creation_date": 1390400921,
      "total_votes": {
        "harmless": 0,
        "malicious": 0
      },
      "magic": "PDF document, version 1.6, 2 pages (zip deflate encoded)",
      "vhash": "997b27a30f47458f8721f54bf66eb58ea",
      "tlsh": "T1ABE41268F3A06AEDEE460719074FBA0A1F0F73B2B9CC05427EAD8F455790E69C26B145",
      "md5": "617f6d23cfc27af0f33765ca7551f4d0",
      "last_analysis_stats": {
        "malicious": 0,
        "suspicious": 0,
        "undetected": 61,
        "harmless": 0,
        "timeout": 0,
        "confirmed-timeout": 0,
        "failure": 0,
        "type-unsupported": 15
      }
    }
  }
} */