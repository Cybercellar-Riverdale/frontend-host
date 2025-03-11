import React from "react";

// Chakra imports
import { Box, Flex, Icon, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import BarChart from "components/charts/BarChart";

// Custom components
import Card from "components/card/Card.js";
import {
    barChartDataBlockedEmails,
    barChartOptionsBlockedEmails,
} from "variables/charts";

// import { barChartDataTopSending, barChartOptionsTopSending } from './charts'

// Assets
import { RiArrowUpSFill } from "react-icons/ri";

export default function TopSendingBar(props) {
    const { senderDomains, ...rest } = props;

    // Move hooks to the top level
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "0px 18px 40px rgba(112, 144, 176, 0.12)"
    );
    const textColor = useColorModeValue("secondaryGray.900", "white");

    if (!senderDomains) {
        return null;
    }

    const entries = Object.entries(senderDomains);
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    const top4Entries = sortedEntries.slice(0, 4);
    const top4Urls = top4Entries.map(entry => entry[0]);
    const top4Values = top4Entries.map(entry => entry[1]);

    const barChartDataTopSending = [{ name: "Number of Emails", data: top4Values }];

    const barChartOptionsTopSending = {
        chart: { toolbar: { show: false } },
        tooltip: {
            style: { fontSize: "12px", fontFamily: undefined },
            onDatasetHover: { style: { fontSize: "12px", fontFamily: undefined } },
            theme: "dark",
        },
        xaxis: {
            categories: top4Urls,
            show: false,
            labels: { show: true, style: { colors: "#A3AED0", fontSize: "14px", fontWeight: "500" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: false,
            labels: { show: true, style: { colors: "#CBD5E0", fontSize: "14px" } },
        },
        grid: { show: false },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [[{ offset: 0, color: "#F0A356", opacity: 1 }, { offset: 100, color: "#F0A356", opacity: 0.28 }]],
            },
        },
        dataLabels: { enabled: false },
        plotOptions: { bar: { borderRadius: 0, columnWidth: "40px" } },
    };

    return (
        <Card align="center" direction="column" w="100%" {...rest} boxShadow={cardShadow}>
            <Flex justify="space-between" align="start" px="10px" pt="5px">
                <Text me="auto" color={textColor} fontSize="xl" fontWeight="700" lineHeight="100%">
                    Top Sending Domains
                </Text>
                <Textarea value={top4Urls} />
            </Flex>
            <Box h="240px" mt="auto">
                <BarChart chartData={barChartDataTopSending} chartOptions={barChartOptionsTopSending} />
            </Box>
        </Card>
    );
}

