// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
// import { pieChartDataDKIMCheck, pieChartOptionsDKIMCheck } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";
// import { pieChartDataTopSending, pieChartOptionsTopSending } from './charts';

export default function TopSendingPie(props) {
    const { senderDomains, ...rest } = props;

    // Move Hooks to the top before any return
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const cardColor = useColorModeValue("white", "navy.700");
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "0px 18px 40px rgba(112, 144, 176, 0.12)"
    );

    if (!senderDomains) {
        return null;
    }

    const entries = Object.entries(senderDomains);
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    const top4Entries = sortedEntries.slice(0, 4);
    const top4Urls = top4Entries.map(entry => entry[0]);
    const top4Values = top4Entries.map(entry => entry[1]);

    const total = top4Values.reduce((acc, value) => acc + value, 0);
    const percentages = top4Values.map(value => Math.ceil((value / total) * 100));

    const pieChartOptionsTopSending = {
        labels: top4Urls,
        colors: ["#F8766D", "#C77CFF", "#00BFC4", "#7CAE00"],
        chart: { width: "50px" },
        states: { hover: { filter: { type: "none" } } },
        legend: { show: false },
        dataLabels: { enabled: false },
        hover: { mode: null },
        plotOptions: {
            donut: {
                expandOnClick: false,
                donut: { labels: { show: false } },
            },
        },
        fill: { colors: ["#F8AAA5", "#D1A3F5", "#A5F1F3", "#D7F390"] },
        tooltip: {
            enabled: true,
            theme: "dark",
            y: { formatter: value => `${value}%` },
        },
    };

    return (
        <Card p='20px' align='center' w='100%' {...rest} h="300px" boxShadow={cardShadow}>
            <Flex px={{ base: "0px", "2xl": "10px" }} justifyContent='space-between' alignItems='center' w='100%' mb='8px'>
                <Text color={textColor} fontSize='xl' fontWeight='600' mt='4px'>
                    Top Sending Domains
                </Text>
            </Flex>
            <PieChart h='100%' w='100%' chartData={percentages} chartOptions={pieChartOptionsTopSending} />
        </Card>
    );
}
